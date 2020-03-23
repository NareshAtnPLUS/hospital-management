import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/account/register/register.component';
import { LoginComponent } from './components/account/login/login.component';
import { OtpComponent } from './components/account/forgot-password/otp/otp.component';
import { UpdatePasswordComponent } from './components/account/forgot-password/update-password/update-password.component';
import { OfferComponent } from './components/offer/offer.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path:'',component:HomeComponent },
  { path:'admin',component:AdminComponent,canActivate:[AuthGuard] },
  { path:'offer-zone',component:OfferComponent },
  { path:'account',component:AccountComponent,children:[
    { path:'forgot-password',component:ForgotPasswordComponent,children:[
      { path:'otp',component:OtpComponent },
      { path:'update-password',component:UpdatePasswordComponent }
      ] 
    },
    { path:'register',component:RegisterComponent },
    { path:'login',component:LoginComponent }
    ] 
  },
  { path:'profile',component:ProfileComponent,canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
