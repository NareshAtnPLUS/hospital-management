import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/services/http-handlers/http-handler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private httpHandler:HttpHandlerService
  ) { 
    this.httpHandler.flaskCheck().subscribe((data:any) => {
      console.log(data)
    })
  }

  ngOnInit(): void {
  }

}
