import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register/register.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { map,debounceTime, distinctUntilChanged } from 'rxjs/operators'
import  axios  from 'axios';
import { HttpHandlerService } from 'src/app/services/http-handlers/http-handler.service';
let username;
export interface State{
  value:string;
  viewValue:string;
}
export interface Country{
  value:string;
  viewValue:string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements AfterViewInit {
  userDisease = {
    diseases: [
      { name: 'Thyroid',  selected: false, id: 1 },
      { name: 'Cholestrol',  selected: false, id: 2 },
    ]
  }
  
  profileForm = this.fb.group({
    firstName:['',Validators.minLength(4)],
    height:['',Validators.minLength(4)],
    weight:['',Validators.minLength(4)],
    age:['',Validators.minLength(2)],
    dob:['',Validators.minLength(4)],
    lastName:['',Validators.minLength(5)],
    userName:['',Validators.minLength(8)],
    email:['',Validators.required],
    password:['',Validators.minLength(8)],
    confirmPassword:['',Validators.minLength(8)],
    specialist:['',Validators.minLength(5)],
    qualifications:['',Validators.minLength(5)],
    surgeries:['',Validators.required],
    address:this.fb.group({
      doorNo:['',Validators.required],
      street:['',Validators.required],
      district:['',Validators.required],
      state:['',Validators.required],
    }),
    diseases:this.buildDiseases()
  })
  get diseases() {
    return this.profileForm.get('diseases');
  };
  buildDiseases() {
    const arr = this.userDisease.diseases.map(skill => {
      return this.fb.control(skill.selected);
    });
    return this.fb.array(arr);
  }
  accountType:String = "User";
  user:{
    firstName:string;
    lastName:string;
    email:string;
    userName:string;
    password:string;
    accountType:String;
  };
  state:State[]=[
    {value:'chennai',viewValue:'Chennai'},
    {value:'kanchipuram',viewValue:'Kanchipuram'},
    {value:'coimbatore',viewValue:'Coimbatore'},
  ];
  country:Country[]=[
    {value:'tamilnadu',viewValue:'TamilNadu'},
    {value:'kerala',viewValue:'Kerala'},
    {value:'karnataka',viewValue:'Karnataka'},
  ];
  textFeildObservable$:any;
  constructor(
    private fb:FormBuilder,
    private flashMessage:NgFlashMessageService,
    private httpHandler:HttpHandlerService
    ) { 
      this.observer = {
        next:async function(data:string){
          console.log(data)
          
          const res = await axios.post('http://localhost:3000/users/check_username',{username:data});
            
          console.log(res.data)
          if(res.data.success){
            username =  true;
          } else{
            username =  false;
          }
          
        },
        error:function(err){
          console.error(err);
        },
        complete:function(){
          console.log('Completed');
        }
      }
    }
    observer:any
    
   

    ngAfterViewInit() {
      // const textFeild = document.getElementById('userName')
      // this.textFeildObservable$ = fromEvent(textFeild, 'input');
      // this.textFeildObservable$.pipe(map((event:any) => event.target.value+`-${this.accountType}`),debounceTime(1000),distinctUntilChanged())
      // .subscribe(this.observer)
    }
  
  async onRegisterSubmit(){
    console.log('regise')
    const userForm = await Object.assign({},this.profileForm.value,{
      diseases:this.profileForm.value.diseases.map((selected,i)=>{
        if(selected){
        return this.userDisease.diseases[i].name
        }
      })
    })
    this.user = this.profileForm.value;
    userForm.accountType = this.accountType;
    userForm.dob = userForm.dob.toLocaleDateString()
    console.log(userForm)
    await this.httpHandler.registerHttpHandler(userForm,this.accountType,this.profileForm);
    
  }

}