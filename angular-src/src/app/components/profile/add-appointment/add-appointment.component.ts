import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpHandlerService } from 'src/app/services/http-handlers/http-handler.service';
import { map } from 'rxjs/operators'
import { AuthService } from 'src/app/services/auth/auth.service';
interface Doctor{
  value:string;
  viewValue:string;
}
@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent implements OnInit {
  doctors:any;
  constructor(
    private fb:FormBuilder,
    private httpHandler:HttpHandlerService,
    private authService:AuthService
  ) {
    this.patient = JSON.parse(this.authService.getToken())
    this.httpHandler.getDoctors().subscribe((data:{doctors:[]}) => {
      this.doctors = data.doctors
      console.log(this.doctors)
      this.doctorsList  = this.doctors.map((doc)=>{
        return {
          viewValue:doc.firstName+' '+doc.lastName+" "+doc.qualifications+' '+doc.specialist,
          value:doc.userName
        }
      })
    })
    
  }
  patient:any;
  ngOnInit(): void {
  }
  appointmentForm=this.fb.group({
    doctorName:['',Validators.minLength(4)],
    reason:['',Validators.minLength(4)],
    reasonDescription:['',Validators.minLength(4)],
    appointment_date:['',Validators.minLength(4)]
  })
  doctorsList:Doctor[];
  onAppointmentSubmit(){
    console.log(this.appointmentForm.value,this.doctorsList)
    const dateString = this.appointmentForm.value.appointment_date.toLocaleDateString()
    const appointment = {
        doctorName:this.appointmentForm.value.doctorName,
        reason:this.appointmentForm.value.reason,
        reasonDescription:this.appointmentForm.value.reasonDescription,
        patientUsername:this.patient.userName,
        patientAge:this.patient.age,
        appointmentDate:dateString
    }
    console.log(appointment)
    this.httpHandler.appointmentSubmitHandler(appointment)
  }

}
