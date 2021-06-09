import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

//import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from "ng-apexcharts";

import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { AddFileComponent } from './components/add-file/add-file.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card'; 
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './components/alert/alert.component';
import { HelpComponent } from './components/help/help.component';

import { AuthGuard } from './auth.guard';
import { LoginService } from './services/login/login.service';
import { AddFilesService } from './services/add-files/add-files.service';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    ResetPasswordComponent,
    AddFileComponent,
    AlertComponent,
    HelpComponent,
    FileUploaderComponent,
  ],
  entryComponents: [AddFileComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatSliderModule,
    BrowserAnimationsModule,
    FormsModule,
    MatMenuModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxDropzoneModule,
    MatNativeDateModule,
    ScrollingModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    NgApexchartsModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    NgbModule
  ],
  providers: [
    AuthGuard,
    LoginService,
    AddFilesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
