import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RegisterService } from '../register/register.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { AuthService } from '../auth/auth.service';
import { Res as ResLogin } from '../../components/account/login/login.component';
import { Res as ResForgotPassword } from '../../components/account/forgot-password/forgot-password.component';
import { Res as ResOtp } from '../../components/account/forgot-password/otp/otp.component';
import { Res as ResUpdatePassword } from '../../components/account/forgot-password/update-password/update-password.component';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {

  constructor(
    private router:Router,
    private http:HttpClient,
    private registerService:RegisterService,
    private flashMessage:NgFlashMessageService,
    private authService:AuthService
  ) { }
  baseUrl = "http://127.0.0.1:5000";
  flaskCheck():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/user/home`)
      .pipe(
        retry(2),
        catchError(this.errorHandler)
    )
  }
  errorHandler(error){
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
  }
  updatePasswordHandler(updatePasswordForm){
    if(this.registerService.validateUpdatePassword(updatePasswordForm.value)){
      // console.log(this.updatePasswordForm.value);
      
      //this.user.password = this.updatePasswordForm.value;
      const user = {
        userName: this.authService.getUpdateToken(),
        password:updatePasswordForm.value,
      }
      // console.log(this.user)
      const req = this.http.post<ResUpdatePassword>('http://localhost:3000/user/update-password', user).subscribe(
      res => {
        if (res.success) {
          this.flashMessage.showFlashMessage({
          messages: [res.msg],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/login']);
        } else {
          this.flashMessage.showFlashMessage({
            messages: [res.msg],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/forgot-password/update-password']);
        }
      },
      err => {

        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/register']);
     });
      
    }
  }
  otpHttpHandler(otp){
    const req = this.http.post<ResOtp>('http://localhost:3000/user/verify-otp', otp).subscribe(
      res => {
        // console.log(res);
        if (res.success) {
          this.authService.storeUserData(res.msg, res.user);
          this.flashMessage.showFlashMessage({
          messages: ['OTP verification sucessfull!'],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/forgot-password/update-password']);
        // console.log(res.msg, res.user);
        } else {
          this.flashMessage.showFlashMessage({
            messages: ['Username does not exists!,Please register yourself as a valid User'],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/register']);
        }
      },
      err => {
        // console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/register']);
     });
  }
  forgotPasswordHttpHandler(user){
    const req = this.http.post<ResForgotPassword>('http://localhost:3000/user/request-otp', user).subscribe(
      res => {
        // console.log(res.success);
        if (res.success) {
          this.authService.sendTokenUpdatePassword(res.user);
          this.flashMessage.showFlashMessage({
          messages: ['Username exists enter OTP!'],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/forgot-password/otp']);
        // console.log(res.token, res.user);
        } else {
          this.flashMessage.showFlashMessage({
            messages: ['Username does not exists!,Please register yourself as a valid User'],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/register']);
        }
      },
      err => {
        // console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/register']);
     });
  }
  loginHttpHandler(user){
    
    const url = `http://localhost:5000/${user.accountType.toLowerCase()}/authenticate`;
    const req = this.http.post<ResLogin>(url, user).subscribe(
      res => {
        // console.log(res.success,res.msg);
        if (res.success) {
          this.authService.storeUserData(res.msg, res.user);
          this.flashMessage.showFlashMessage({
          messages: ['You Are Now Logged In'],
          dismissible: true, timeout: 3000, type: 'success'
          });
          if(user.accountType === 'User') this.router.navigate(['/profile']);
          else if(user.accountType === 'Admin') this.router.navigate(['/admin']);
          else if(user.accountType === 'Doctor') this.router.navigate(['/doctorProfile']);
        //console.log(res.msg, res.user);
        } else {
          this.flashMessage.showFlashMessage({
            messages: ['Check Login Credentials,User Name or password mismatch'],
          dismissible: true, timeout: 5000, type: 'danger'
          });
          this.router.navigate(['/account/login']);
        }
      },
      err => {
        // console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/account/login']);
     });
  }
  registerHttpHandler(user,accountType,profileForm){
    if(!this.registerService.validateEmail(user.email)){
      this.flashMessage.showFlashMessage({
        messages:['Please Use Valid Email'],
        dismissible: true, timeout: 5000, type: 'danger'
      })
      return false
    }
    if(!(this.registerService.validateUpdatePassword(profileForm.value))){
      this.flashMessage.showFlashMessage({
        messages:['Passwords mismatch!,ReEnter with care'],
        dismissible: true, timeout: 3000, type: 'danger'
      })
      return false      
    }
    // console.log(accountType);
    
    const url = `${this.baseUrl}/${accountType.toLowerCase()}/register`
    const req = this.http.post( url, user).subscribe(
      res => {
        // console.log(res);
        this.flashMessage.showFlashMessage({
          messages: ['You Are Now Registered and can Login'],
          dismissible: true, timeout: 3000, type: 'success'
          });
        this.router.navigate(['/account/login']);
      },
      err => {
        console.log('Error Occured');
        this.flashMessage.showFlashMessage({
          messages: ['Something Went Wrong'],
          dismissible: true, timeout: 3000, type: 'danger'
          });
        this.router.navigate(['/']);
      });
  }

}
