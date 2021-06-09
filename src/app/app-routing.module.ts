import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login',
    component: LoginComponent 
  },
  { 
    path: 'sign-up',
    component: SignUpComponent 
  },
  { 
    path: 'forgot-password',
    component: ForgotPasswordComponent 
  },
  { 
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  { 
    path: 'home',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
