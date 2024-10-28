import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {DRIVER_API, MSG_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE, RENTAL_DETAIL_API_OFFICE_BULKEDIT, RENTAL_DETAIL_API_WALKIN} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE, CAR_ASSIGNED_MESSAGE_TEMPLATE, DRIVER_MESSAGE_TEMPLATE, MESSAGE_AUTH_SCHEME, MESSAGE_FORMAT, MESSAGE_METHOD, MESSAGE_PWD, MESSAGE_TYPE, MESSAGE_USER, MESSAGE_VERSION, ROUTE_ADD_DDR, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';

export interface IReportToNames{
  id: any;
  name: any;
  num: any;
}

export class ReportToNames implements IReportToNames{
  id: any;
  name: any;
  num: any;
}

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
  isWalkinDuty: boolean = false;
  phoneNumbers: any[] = [];
  selectedParty: any;
  counter: number = 0;
  walkinnumbers: string = "";
  reporttonames : IReportToNames[] = [];
  ddr1green: boolean = false;
  ddr2green: boolean = false;
  ddr3green: boolean = false;
  ddr4green: boolean = false;
  ddr5green: boolean = false;
  walkinmultiplereport: string;
  constructor(private router: Router,private apiService: ApiService, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    let selectedId = JSON.parse(localStorage.getItem('selectedrentalid'));
    this.selectedParty = localStorage.getItem('selectedrentalparty');
    let api = RENTAL_DETAIL_API_OFFICE;
    if(this.selectedParty === "WALK IN(ON CALL)"){
      this.isWalkinDuty = true;
      api = RENTAL_DETAIL_API_WALKIN;
    }
    var json = 
      {
        "mode":"4",
        "dutyid": selectedId
      };
      this.apiService.post(api, json).then((res: any)=>{ 
        this.rentalDetails = res;
        this.walkinmultiplereport = "";
        if(this.selectedParty === "WALK IN(ON CALL)"){
          if(this.rentalDetails.reportida){
            this.reporttonames.push({ id: this.rentalDetails.reportida, name: this.rentalDetails.reporttonamea , num: this.rentalDetails.reporttonuma});
            this.walkinnumbers += this.rentalDetails.reporttonuma + ",";
            this.counter++;
          }
          if(this.rentalDetails.reportidb){
            this.reporttonames.push({ id: this.rentalDetails.reportidb, name: this.rentalDetails.reporttonameb , num: this.rentalDetails.reporttonumb});
            this.walkinnumbers += this.rentalDetails.reporttonumb + ",";
            this.counter++;
          }
          if(this.rentalDetails.reportidc){
            this.reporttonames.push({ id: this.rentalDetails.reportidc, name: this.rentalDetails.reporttonamec , num: this.rentalDetails.reporttonumc});
            this.walkinnumbers += this.rentalDetails.reporttonumc + ",";
            this.counter++;
          }
          if(this.rentalDetails.reportidd){
            this.reporttonames.push({ id: this.rentalDetails.reportidd, name: this.rentalDetails.reporttonamed , num: this.rentalDetails.reporttonumd});
            this.walkinnumbers += this.rentalDetails.reporttonumd + ",";
            this.counter++;
          }
          if(this.rentalDetails.reportide){
            this.reporttonames.push({ id: this.rentalDetails.reportide, name: this.rentalDetails.reporttonamee , num: this.rentalDetails.reporttonume});
            this.walkinnumbers += this.rentalDetails.reporttonume + ",";
            this.counter++;
          }
          this.walkinnumbers = this.walkinnumbers.replace(/,*$/, "");
          this.walkinmultiplereport = this.walkinnumbers;
          var json = 
      {
        "mode":"11",
        "dutyid": this.rentalDetails.dutyid
      };
      this.apiService.post(MSG_API, json).then((res: any)=>{
        if(res.result.filter(x=>x.message === "BookingConfirmation").length > 0){
          this.ddr1green = true;
        }
        if(res.result.filter(x=>x.message === "BookingConfirmationBooked").length > 0){
          this.ddr2green = true;
        }
        if(res.result.filter(x=>x.message === "Driver").length > 0){
          this.ddr3green = true;
        }
        if(res.result.filter(x=>x.message === "CarAssigned").length > 0){
          this.ddr4green = true;
        }
        if(res.result.filter(x=>x.message === "CarAssignedBooked").length > 0){
          this.ddr5green = true;
        }
      });
        }
      });
   }
 
   refreshNumber(){
     debugger;
     this.phoneNumbers = [];
     debugger;
    //Report To
    if(this.selectedType == "BookingConfirmation"){
      if(this.selectedParty === "WALK IN(ON CALL)"){
          this.walkinnumbers = this.walkinmultiplereport;
          let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
          body = body.split("%20").join(" ");
          body = body.split("%0A").join(" .");
          body = body.split("%3A").join(": ");
          body = body.split("%2C").join(".");
          debugger;
          body = body.replace("{0}", this.rentalDetails.dutyid);
          body = body.replace("{1}", this.counter > 1 ? "REPORT TO NAMES" : this.rentalDetails.reporttonamea);
          body = body.replace("{2}", this.rentalDetails.dutydate);
          body = body.replace("{3}", this.rentalDetails.dutytime.substr(0,5));
          body = body.replace("{4}", this.rentalDetails.transportinfo === "" ? "Vehicle to be assigned" : this.rentalDetails.transportinfo);
          this.message = body;
      }
      else{
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
    }

    //Booked By
    if(this.selectedType == "BookingConfirmationBooked"){
      if(this.rentalDetails.dutytype === "1"){
        this.phoneNumbers.push(this.rentalDetails.bookedbycontact);
        if(this.selectedParty === "WALK IN(ON CALL)"){
          this.walkinnumbers = this.rentalDetails.bookedbycontact;
        }
      }
      else{
        this.phoneNumbers.push(this.rentalDetails.reporttonum);
        if(this.selectedParty === "WALK IN(ON CALL)"){
          this.walkinnumbers = this.walkinmultiplereport;
        }
      }
      let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
      body = body.split("%20").join(" ");
      body = body.split("%0A").join(" .");
      body = body.split("%3A").join(": ");
      body = body.split("%2C").join(".");
      body = body.replace("{0}", this.rentalDetails.dutyid);
      if(this.rentalDetails.dutytype === "1"){
        body = body.replace("{1}", this.rentalDetails.reporttoname);
      }
      else{
        body = body.replace("{1}", this.rentalDetails.bookedby);
      }
      body = body.replace("{2}", this.rentalDetails.dutydate);
      body = body.replace("{3}", this.rentalDetails.dutytime.substr(0,5));
      body = body.replace("{4}",  this.rentalDetails.transportinfo === "" ? "Vehicle to be assigned" : this.rentalDetails.transportinfo);
      this.message = body;
    }

    //Driver
    if(this.selectedType == "Driver"){
      if(this.selectedParty === "WALK IN(ON CALL)"){
        this.walkinnumbers = this.rentalDetails.drivernum;
      }
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

    //Report To
    if(this.selectedType == "CarAssigned"){
      if(this.selectedParty === "WALK IN(ON CALL)"){
        this.walkinnumbers = this.walkinmultiplereport;
      }
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

    //Booked By
    if(this.selectedType == "CarAssignedBooked"){
      if(this.selectedParty === "WALK IN(ON CALL)"){
        this.walkinnumbers = this.rentalDetails.bookedbycontact;
      }
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
    for(let i=0; i< this.counter; i++){
      let queryParam = "";
      let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
      body = body.replace("{0}", this.rentalDetails.dutyid);
      body = body.replace("{1}", this.reporttonames[i].name);
      body = body.replace("{2}", this.rentalDetails.dutydate);
      body = body.replace("{3}", this.rentalDetails.dutytime.substr(0,5));
      body = body.replace("{4}", this.rentalDetails.transportinfo);
      queryParam += "method=" + MESSAGE_METHOD;
      queryParam += "&send_to=" + this.reporttonames[i].num;
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
    var json = 
    {
      "mode":"12",
      "dutyid": this.rentalDetails.dutyid,
      "message": "BookingConfirmation"
    };
    this.apiService.post(MSG_API, json).then((res: any)=>{ 
    });
   }
   sendBookingConfirmationMessageBooked(){
    this.toastr.info("Please wait while we are sending the message", "Information");
    let queryParam = "";
    let body = BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE;
    body = body.replace("{0}", this.rentalDetails.dutyid);
    if(this.rentalDetails.dutytype === "1"){
      body = body.replace("{1}", this.rentalDetails.reporttoname);
    }
    else{
      body = body.replace("{1}", this.rentalDetails.bookedby);
    }
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
    var json = 
    {
      "mode":"12",
      "dutyid": this.rentalDetails.dutyid,
      "message": "BookingConfirmationBooked"
    };
    this.apiService.post(MSG_API, json).then((res: any)=>{ 
    });
   }
   sendCarAssignedMessage(){
    this.toastr.info("Please wait while we are sending the message", "Information");
    for(let i=0; i< this.counter; i++){
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
      queryParam += "&send_to=" + this.reporttonames[i].num;
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
    var json = 
    {
      "mode":"12",
      "dutyid": this.rentalDetails.dutyid,
      "message": "CarAssigned"
    };
    this.apiService.post(MSG_API, json).then((res: any)=>{ 
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
    var json = 
    {
      "mode":"12",
      "dutyid": this.rentalDetails.dutyid,
      "message": "CarAssignedBooked"
    };
    this.apiService.post(MSG_API, json).then((res: any)=>{ 
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
    var json = 
      {
        "mode":"12",
        "dutyid": this.rentalDetails.dutyid,
        "message": "Driver"
      };
      this.apiService.post(MSG_API, json).then((res: any)=>{ 
      });
  }
}
