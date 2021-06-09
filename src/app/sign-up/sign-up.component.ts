import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { LoginService } from '../services/login/login.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertComponent } from '../components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  name = new FormControl('', [Validators.required]);
  team = new FormControl('', [Validators.required]);
  role = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
  password2 = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);

  hide = true;
  hide2 = true;

  matcher = new MyErrorStateMatcher();

  destroy$: Subject<boolean> = new Subject<boolean>();

  user: any = {
    name: "test",
    email: "test@gmail.com",
    password: "122323",
    team: 4,
    role: 5,
  }

  roles: any;
  teams: any;

  constructor(
    private router: Router, 
    private loginService: LoginService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginService.getTeams().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      console.log(res);
      this.teams = res
    });

    this.loginService.getRole().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      console.log(res);
      this.roles = res;
    });
  }

  gotoSignIn() {
    if(!this.emailFormControl.hasError('required') && !this.emailFormControl.hasError('email') && !this.password.hasError('required') && !this.password2.hasError('required') 
      && !this.team.hasError('required') && !this.role.hasError('required') && !this.password.hasError('pattern') && !this.password2.hasError('pattern')) {
      if (this.password.value != this.password2.value) {
        const dialogRef = this.dialog.open(AlertComponent, {
          width: '600px',
          height: '200px',
          data: {message: "Password didn't match!!"}
        });
      }
      else {
        this.user.name = this.name.value;
        this.user.team = this.team.value;
        this.user.role = this.role.value;
        this.user.email = this.emailFormControl.value;
        this.user.password = this.password.value;
        this.loginService.registerUser(this.user).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
            data: {message: "Something went wrong!!"}
          });
        });
      }
    }
    else {
      console.log("error");
      const dialogRef = this.dialog.open(AlertComponent, {
        width: '600px',
        height: '200px',
        data: {message: "Enter valid data!!"}
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
