import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../components/alert/alert.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  hide = true;

  matcher = new MyErrorStateMatcher();

  user: any = {
    email: "test@gmail.com",
    password: "122323",
  }

  test: any = {
    team: 1,
    email: "test@test.com",
    name: "Test test"
  }

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router, 
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  gotoForgot() {
    this.router.navigate(['forgot-password']);
  }

  gotoSignUp() {
    this.router.navigate(['sign-up']);
  }

  gotoSignIn() {
    if(!this.emailFormControl.hasError('required') && !this.emailFormControl.hasError('email') && 
      !this.password.hasError('required') && !this.password.errors?.minlength
    ) {
      this.user.email = this.emailFormControl.value;
      this.user.password = this.password.value;
      this.loginService.loginUser(this.user).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.openSnackBar(`Login with email ${this.emailFormControl.value}`, "success");
        let navigationExtras: NavigationExtras = {
          queryParams: {
            email: this.emailFormControl.value
          }
        };
        this.router.navigate(['home'], navigationExtras);
      }, (error: any) => {
        const dialogRef = this.dialog.open(AlertComponent, {
          width: '600px',
          height: '200px',
          data: {message: "Something went wrong!! Could not authenticate."}
        });
      });
    }
    else {
      const dialogRef = this.dialog.open(AlertComponent, {
        width: '600px',
        height: '200px',
        data: {message: "Enter a valid email and password!!"}
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
