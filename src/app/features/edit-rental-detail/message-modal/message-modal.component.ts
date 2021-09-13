import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {DRIVER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE, RENTAL_DETAIL_API_OFFICE_BULKEDIT} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE, CAR_ASSIGNED_MESSAGE_TEMPLATE, DRIVER_MESSAGE_TEMPLATE, MESSAGE_AUTH_SCHEME, MESSAGE_FORMAT, MESSAGE_METHOD, MESSAGE_PWD, MESSAGE_TYPE, MESSAGE_USER, MESSAGE_VERSION, ROUTE_ADD_DDR, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})

export class MessageModalComponent implements OnInit {
  phoneNumber: any;
  selectedType: any;
  rentalDetails: any;
  message: any;
  phoneNumbers: any[] = [];
  constructor(private router: Router,private apiService: ApiService, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    let selectedId = JSON.parse(localStorage.getItem('selectedrentalid'));
    var json = 
      {
        "mode":"4",
        "dutyid": selectedId
      };
      this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
        this.rentalDetails = res;
      });
   }
 
   refreshNumber(){
     debugger;
     this.phoneNumbers = [];
     debugger;
    if(this.selectedType == "BookingConfirmation"){
      this.phoneNumbers.push(this.rentalDetails.reporttonum);
      let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
      body = body.split("%20").join(" ");
      body = body.split("%0A").join(" .");
      body = body.split("%3A").join(": ");
      body = body.split("%2C").join(".");
      body = body.replace("{0}", this.rentalDetails.dutyid);
      body = body.replace("{1}", this.rentalDetails.reporttoname);
      body = body.replace("{2}", this.rentalDetails.dutydate);
      body = body.replace("{3}", this.rentalDetails.dutytime.substr(0,5));
      body = body.replace("{4}", this.rentalDetails.transportinfo === "" ? "Vehicle to be assigned" : this.rentalDetails.transportinfo);
      this.message = body;
    }
    if(this.selectedType == "BookingConfirmationBooked"){
      this.phoneNumbers.push(this.rentalDetails.reporttonum);
      let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
      body = body.split("%20").join(" ");
      body = body.split("%0A").join(" .");
      body = body.split("%3A").join(": ");
      body = body.split("%2C").join(".");
      body = body.replace("{0}", this.rentalDetails.dutyid);
      body = body.replace("{1}", this.rentalDetails.bookedby);
      body = body.replace("{2}", this.rentalDetails.dutydate);
      body = body.replace("{3}", this.rentalDetails.dutytime.substr(0,5));
      body = body.replace("{4}",  this.rentalDetails.transportinfo === "" ? "Vehicle to be assigned" : this.rentalDetails.transportinfo);
      this.message = body;
    }
    if(this.selectedType == "Driver"){
      this.phoneNumbers.push(this.rentalDetails.drivernum);
      let body = DRIVER_MESSAGE_TEMPLATE;
      body = body.split("%20").join(" ");
      body = body.split("%0A").join(" .");
      body = body.split("%3A").join(": ");
      body = body.split("%2C").join(".");
      body = body.replace("{0}", this.rentalDetails.dutyid);
      body = body.replace("{1}", this.rentalDetails.reporttoname);
      body = body.replace("{2}", this.rentalDetails.reporttonum);
      body = body.replace("{3}", this.rentalDetails.carnum);
      body = body.replace("{4}", this.rentalDetails.cartype);
      body = body.replace("{5}", this.rentalDetails.dutydate);
      body = body.replace("{6}", this.rentalDetails.dutytime.substr(0,5));
      body = body.replace("{7}", this.rentalDetails.pickuploc);
      this.message = body;
    }
    if(this.selectedType == "CarAssigned"){
      this.phoneNumbers.push(this.rentalDetails.reporttonum);
      let body = CAR_ASSIGNED_MESSAGE_TEMPLATE;
      body = body.split("%20").join(" ");
      body = body.split("%0A").join(" .");
      body = body.split("%3A").join(": ");
      body = body.split("%2C").join(".");
      body = body.replace("{0}", this.rentalDetails.dutyid);
      body = body.replace("{1}", this.rentalDetails.carnum);
      body = body.replace("{2}", this.rentalDetails.cartype);
      body = body.replace("{3}", this.rentalDetails.driver);
      body = body.replace("{4}", this.rentalDetails.drivernum);
      body = body.replace("{5}", this.rentalDetails.dutydate);
      body = body.replace("{6}", this.rentalDetails.dutytime.substr(0,5));
      body = body.replace("{7}", this.rentalDetails.pickuploc);
      this.message = body;
    } 
    if(this.selectedType == "CarAssignedBooked"){
      this.phoneNumbers.push(this.rentalDetails.bookedbycontact);
      let body = CAR_ASSIGNED_MESSAGE_TEMPLATE;
      body = body.split("%20").join(" ");
      body = body.split("%0A").join(" .");
      body = body.split("%3A").join(": ");
      body = body.split("%2C").join(".");
      body = body.replace("{0}", this.rentalDetails.dutyid);
      body = body.replace("{1}", this.rentalDetails.carnum);
      body = body.replace("{2}", this.rentalDetails.cartype);
      body = body.replace("{3}", this.rentalDetails.driver);
      body = body.replace("{4}", this.rentalDetails.drivernum);
      body = body.replace("{5}", this.rentalDetails.dutydate);
      body = body.replace("{6}", this.rentalDetails.dutytime.substr(0,5));
      body = body.replace("{7}", this.rentalDetails.pickuploc);
      this.message = body;
    } 
   }

   sendmessagebtn(number: any){
     debugger;
    this.phoneNumber = number;
    this.selectedType == "BookingConfirmation" ? this.sendBookingConfirmationMessage() : 
    this.selectedType == "BookingConfirmationBooked" ? this.sendBookingConfirmationMessageBooked() : 
    this.selectedType == "Driver" ? this.sendDriverMessage() :
    this.selectedType == "CarAssigned" ? this.sendCarAssignedMessage() :
    this.selectedType == "CarAssignedBooked" ? this.sendCarAssignedMessageBooked() : "" ;
   }
   sendBookingConfirmationMessage(){
    this.toastr.info("Please wait while we are sending the message", "Information");
    let queryParam = "";
    let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
    body = body.replace("{0}", this.rentalDetails.dutyid);
    body = body.replace("{1}", this.rentalDetails.reporttoname);
    body = body.replace("{2}", this.rentalDetails.dutydate);
    body = body.replace("{3}", this.rentalDetails.dutytime.substr(0,5));
    body = body.replace("{4}", this.rentalDetails.transportinfo);
    queryParam += "method=" + MESSAGE_METHOD;
    queryParam += "&send_to=" + this.phoneNumber;
    //queryParam += "&send_to=9874993247";
    queryParam += "&msg=" + body;
    queryParam += "&msg_type=" + MESSAGE_TYPE;
    queryParam += "&userid=" + MESSAGE_USER;
    queryParam += "&auth_scheme=" + MESSAGE_AUTH_SCHEME;
    queryParam += "&password=" + MESSAGE_PWD;
    queryParam += "&v=" + MESSAGE_VERSION;
    queryParam += "&format=" + MESSAGE_FORMAT;
    this.toastr.success("The message has been successfully sent", "Success");
    this.apiService.sendMessage(queryParam).then((data)=>{
      debugger;
      this.toastr.success("The message has been successfully sent", "Success");
    });
   }
   sendBookingConfirmationMessageBooked(){
    this.toastr.info("Please wait while we are sending the message", "Information");
    let queryParam = "";
    let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
    body = body.replace("{0}", this.rentalDetails.dutyid);
    body = body.replace("{1}", this.rentalDetails.bookedby);
    body = body.replace("{2}", this.rentalDetails.dutydate);
    body = body.replace("{3}", this.rentalDetails.dutytime.substr(0,5));
    body = body.replace("{4}", this.rentalDetails.transportinfo);
    queryParam += "method=" + MESSAGE_METHOD;
    queryParam += "&send_to=" + this.phoneNumber;
    //queryParam += "&send_to=9874993247";
    queryParam += "&msg=" + body;
    queryParam += "&msg_type=" + MESSAGE_TYPE;
    queryParam += "&userid=" + MESSAGE_USER;
    queryParam += "&auth_scheme=" + MESSAGE_AUTH_SCHEME;
    queryParam += "&password=" + MESSAGE_PWD;
    queryParam += "&v=" + MESSAGE_VERSION;
    queryParam += "&format=" + MESSAGE_FORMAT;
    this.toastr.success("The message has been successfully sent", "Success");
    this.apiService.sendMessage(queryParam).then((data)=>{
      debugger;
      this.toastr.success("The message has been successfully sent", "Success");
    });
   }
   sendCarAssignedMessage(){
    this.toastr.info("Please wait while we are sending the message", "Information");
    let queryParam = "";
    let body = CAR_ASSIGNED_MESSAGE_TEMPLATE;
    body = body.replace("{0}", this.rentalDetails.dutyid);
    body = body.replace("{1}", this.rentalDetails.carnum);
    body = body.replace("{2}", this.rentalDetails.cartype);
    body = body.replace("{3}", this.rentalDetails.driver);
    body = body.replace("{4}", this.rentalDetails.drivernum);
    body = body.replace("{5}", this.rentalDetails.dutydate);
    body = body.replace("{6}", this.rentalDetails.dutytime.substr(0,5));
    body = body.replace("{7}", this.rentalDetails.pickuploc);
    queryParam += "method=" + MESSAGE_METHOD;
    queryParam += "&send_to=" + this.phoneNumber;
    //queryParam += "&send_to=9874993247";
    queryParam += "&msg=" + body;
    queryParam += "&msg_type=" + MESSAGE_TYPE;
    queryParam += "&userid=" + MESSAGE_USER;
    queryParam += "&auth_scheme=" + MESSAGE_AUTH_SCHEME;
    queryParam += "&password=" + MESSAGE_PWD;
    queryParam += "&v=" + MESSAGE_VERSION;
    queryParam += "&format=" + MESSAGE_FORMAT;
    this.toastr.success("The message has been successfully sent", "Success");
    this.apiService.sendMessage(queryParam).then((data)=>{
      debugger;
      this.toastr.success("The message has been successfully sent", "Success");
    });
  }

  sendCarAssignedMessageBooked(){
    this.toastr.info("Please wait while we are sending the message", "Information");
    let queryParam = "";
    let body = CAR_ASSIGNED_MESSAGE_TEMPLATE;
    body = body.replace("{0}", this.rentalDetails.dutyid);
    body = body.replace("{1}", this.rentalDetails.carnum);
    body = body.replace("{2}", this.rentalDetails.cartype);
    body = body.replace("{3}", this.rentalDetails.driver);
    body = body.replace("{4}", this.rentalDetails.drivernum);
    body = body.replace("{5}", this.rentalDetails.dutydate);
    body = body.replace("{6}", this.rentalDetails.dutytime.substr(0,5));
    body = body.replace("{7}", this.rentalDetails.pickuploc);
    queryParam += "method=" + MESSAGE_METHOD;
    queryParam += "&send_to=" + this.phoneNumber;
    //queryParam += "&send_to=9874993247";
    queryParam += "&msg=" + body;
    queryParam += "&msg_type=" + MESSAGE_TYPE;
    queryParam += "&userid=" + MESSAGE_USER;
    queryParam += "&auth_scheme=" + MESSAGE_AUTH_SCHEME;
    queryParam += "&password=" + MESSAGE_PWD;
    queryParam += "&v=" + MESSAGE_VERSION;
    queryParam += "&format=" + MESSAGE_FORMAT;
    this.toastr.success("The message has been successfully sent", "Success");
    this.apiService.sendMessage(queryParam).then((data)=>{
      debugger;
      this.toastr.success("The message has been successfully sent", "Success");
    });
  }

  sendDriverMessage(){ 
    this.toastr.info("Please wait while we are sending the message", "Information");
    let queryParam = "";
    let body = DRIVER_MESSAGE_TEMPLATE;
    body = body.replace("{0}", this.rentalDetails.dutyid);
    body = body.replace("{1}", this.rentalDetails.reporttoname);
    body = body.replace("{2}", this.rentalDetails.reporttonum);
    body = body.replace("{3}", this.rentalDetails.carnum);
    body = body.replace("{4}", this.rentalDetails.cartype);
    body = body.replace("{5}", this.rentalDetails.dutydate);
    body = body.replace("{6}", this.rentalDetails.dutytime.substr(0,5));
    body = body.replace("{7}", this.rentalDetails.pickuploc);
    queryParam += "method=" + MESSAGE_METHOD;
    queryParam += "&send_to=" + this.phoneNumber;
    //queryParam += "&send_to=9874993247";
    queryParam += "&msg=" + body;
    queryParam += "&msg_type=" + MESSAGE_TYPE;
    queryParam += "&userid=" + MESSAGE_USER;
    queryParam += "&auth_scheme=" + MESSAGE_AUTH_SCHEME;
    queryParam += "&password=" + MESSAGE_PWD;
    queryParam += "&v=" + MESSAGE_VERSION;
    queryParam += "&format=" + MESSAGE_FORMAT;
    this.toastr.success("The message has been successfully sent", "Success");
    this.apiService.sendMessage(queryParam).then((data)=>{
      debugger;
      this.toastr.success("The message has been successfully sent", "Success");
    });
  }
}
