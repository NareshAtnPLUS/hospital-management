import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/services/http-handlers/http-handler.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-show-appointment',
  templateUrl: './show-appointment.component.html',
  styleUrls: ['./show-appointment.component.scss']
})
export class ShowAppointmentComponent implements OnInit {
  user:any;
  appointments:any;
  constructor(
    private httpHandler:HttpHandlerService,
    private authService:AuthService
  ) {
    this.user = JSON.parse(this.authService.getToken())
    console.log(this.user)
    this.httpHandler.getAppointments(this.user).subscribe((data:{appointments:{}}) => {
      this.appointments = data.appointments
      console.log(this.appointments)
    })
   }

  ngOnInit(): void {
  }

}
