import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from '../../../shared/services/service';
import { ToastrService } from 'ngx-toastr';
import {DRIVER_API, LOGIN_API, MSG_API} from '../../../shared/services/api.url-helper';
import { CAR_ASSIGNED_AIRPORT_TEMPLATE, CAR_ASSIGNED_MESSAGE_TEMPLATE, DRIVER_MESSAGE_AIRPORT_TEMPLATE, DRIVER_MESSAGE_TEMPLATE, MESSAGE_AUTH_SCHEME, MESSAGE_FORMAT, MESSAGE_METHOD, MESSAGE_PWD, MESSAGE_TYPE, MESSAGE_USER, MESSAGE_VERSION, ROUTE_BASIC, ROUTE_DASHBOARD } from 'src/shared/constants/constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface imsg {
  msgdate: string,
  party: string,
  partynumber: string,
  driver: string,
  drivernumber: string,
  carnumber: string,
  cartype: string,
  msgtype: string,
  mode:any,
  msgtime: any,
  reporting: any
}

export class msgclass implements imsg{
  msgdate: string;
  party: string;
  partynumber: string;
  driver: string;
  drivernumber: string;
  carnumber: string;
  cartype: string;
  msgtype: string;
  mode: any;
  msgtime: any;
  reporting: any;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  username: any;
  password: any;
  msg: msgclass;
  DriverControl: FormControl;
  DriverContactControl: FormControl;
  CarTypeControl: FormControl;
  CarNumberControl: FormControl;
  PartyControl: FormControl;
  PartyNumberControl: FormControl;
  MsgTimeControl: FormControl;
  ReportingControl: FormControl;
  allcartype: any;
  alldrivernames: any;
  allcarno: any;
  filteredOptionsCar: Observable<any[]>;
  filteredOptionsParty: Observable<any[]>;
  filteredOptionsCarType: Observable<any[]>;
  filteredOptionsDriver: Observable<any[]>;
  alldrivers: any;
  allcars: any;
  cartypes: any;
  showdriver: boolean = true;
  showpassenger: boolean = true;
  firstFormGroup: FormGroup;
  message: string;
  msglist : msgclass[] = [];
  partymessage: string;
  allparty: string[];
  constructor(private _formBuilder: FormBuilder,private router: Router,private apiService: ApiService, private toastr: ToastrService) {
    debugger;
    this.msg = new msgclass();
    this.firstFormGroup = this._formBuilder.group({
      PartyControl: [],
      PartyNumberControl: [],
      MsgTimeControl: [],
      ReportingControl: [],
      DriverControl: ['', Validators.required],
      DriverContactControl: ['', Validators.required],
      CarTypeControl: ['', Validators.required],
      CarNumberControl: ['', Validators.required]
    });
    /* this.DriverControl = new FormControl();
    this.DriverContactControl = new FormControl();
    this.CarTypeControl = new FormControl();
    this.CarNumberControl = new FormControl(); */
    /* 
    let isLoggedIn = localStorage.getItem('loggedin'); 
    if(isLoggedIn && isLoggedIn == "1"){
      this.router.navigateByUrl('/' + ROUTE_DASHBOARD);
    } */
  }
  changedriver(){
    var drivercode = this.alldrivers.filter(x=>x.drivername == this.msg.driver)[0].drivercode;
    var json = 
      {
        "mode":4,
        "drivercode": drivercode
      } 
      this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
        this.msg.drivernumber = res.contact;
      });
  }
  msgdisplay(){
    if(this.showdriver){
      this.formdrivermsg();
    
    }
    if(this.showpassenger){
      this.formpassengermsg();
    }
  }
  ngOnInit(): void {
    this.reset();
    this.msg.mode = 0;
    this.apiService.post(MSG_API, this.msg).then((res: any)=>{ 
      this.msglist = res.result;
      this.allparty = this.msglist.map(x=>x.party);
      this.filteredOptionsParty = this.firstFormGroup.get('PartyControl').valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    });
    this.allcars = JSON.parse(localStorage.getItem('allcars'));
    this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
    this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
    this.alldrivernames = this.alldrivers.map(x=>x.drivername);
     this.allcarno = this.allcars.map(x=>x.carno);
     this.allcartype = this.cartypes.map(x=>x.car);
    //carno
     this.filteredOptionsCar = this.firstFormGroup.get('CarNumberControl').valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    //cartype
    this.filteredOptionsCarType = this.firstFormGroup.get('CarTypeControl').valueChanges.pipe(startWith(''),map(value => this._filterCarType(value)));
    //driver
    this.filteredOptionsDriver = this.firstFormGroup.get('DriverControl').valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
    this.formdrivermsg();
    this.formpassengermsg();

  }
  formdrivermsg(){
    let body = DRIVER_MESSAGE_AIRPORT_TEMPLATE;
    body = body.split("%20").join(" ");
    body = body.split("%0A").join(" .");
    body = body.split("%3A").join(": ");
    body = body.split("%2C").join(".");
    body = body.replace("{0}", "1");
    body = body.replace("{1}", this.msg.driver);
    body = body.replace("{2}", "");
    body = body.replace("{3}", "");
    body = body.replace("{4}", this.msg.carnumber);
    body = body.replace("{5}", "");
    body = body.replace("{6}", "");
    body = body.replace("{7}", this.msg.party);
    body = body.replace("{8}", "");
    body = body.replace("{9}", "");
    body = body.replace("{10}", new Date().getUTCFullYear() + "/" + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate());
    body = body.replace("{11}", this.msg.msgtime);
    body = body.replace("{12}", this.msg.reporting);
    body = body.replace("{13}", "");
    body = body.replace("{14}", "");
    body = body.replace("{15}", "");
    body = body.replace("{16}", "");
    body = body.replace("{18}", this.msg.partynumber);
    body = body.replace("{17}", "");
    /* body = body.replace("{8}", this.msg.cartype);
    body = body.replace("{9}", new Date().getUTCFullYear() + "/" + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate());
    body = body.replace("{6}", this.msg.msgtime);
    body = body.replace("{7}", "Kolkata Airport"); */
    this.message = body;
  }
  formpassengermsg(){
    let body = CAR_ASSIGNED_AIRPORT_TEMPLATE;
    body = body.split("%20").join(" ");
    body = body.split("%0A").join(" .");
    body = body.split("%3A").join(": ");
    body = body.split("%2C").join(".");
    body = body.replace("{0}", this.msg.party);
    body = body.replace("{1}", "");
    body = body.replace("{2}", "");
    body = body.replace("{3}", "1");
    body = body.replace("{4}", new Date().getUTCFullYear() + "/" + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate());
    body = body.replace("{5}", this.msg.msgtime);
    body = body.replace("{6}", this.msg.reporting);
    body = body.replace("{7}", "");
    body = body.replace("{8}", "");
    body = body.replace("{9}", "");
    body = body.replace("{10}", this.msg.driver);
    body = body.replace("{11}", "");
    body = body.replace("{12}", "");
    body = body.replace("{13}", this.msg.drivernumber);
    body = body.replace("{14}", "");
    body = body.replace("{15}", this.msg.carnumber);
    body = body.replace("{16}", "");
    body = body.replace("{17}", "");
    this.partymessage = body;
  }
  public _filterCarType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcartype.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterDriver(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alldrivernames.filter(client => client.toString().toLowerCase().includes(filterValue));
  }
  public _filterCar(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcarno.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allparty.filter(client => client.toLowerCase().includes(filterValue));
  }
  sendmessagebtndriver(){
    if(!(this.msg.party && this.msg.partynumber && this.msg.driver && this.msg.drivernumber && this.msg.carnumber && this.msg.cartype)){
      this.toastr.error("Please enter all the details before sending message", "Error");
    }
    else{
      this.toastr.info("Please wait while we are sending the message", "Information");
      let queryParam = "";
      this.formdrivermsg();
      queryParam += "method=" + MESSAGE_METHOD;
      queryParam += "&send_to=" + this.msg.drivernumber;
      //queryParam += "&send_to=9874993247";
      queryParam += "&msg=" + this.message;
      queryParam += "&msg_type=" + MESSAGE_TYPE;
      queryParam += "&userid=" + MESSAGE_USER;
      queryParam += "&auth_scheme=" + MESSAGE_AUTH_SCHEME;
      queryParam += "&password=" + MESSAGE_PWD;
      queryParam += "&v=" + MESSAGE_VERSION;
      queryParam += "&format=" + MESSAGE_FORMAT;
      debugger;
      //this.toastr.success("The message has been successfully sent", "Success");
      this.apiService.sendMessage(queryParam).then((data)=>{
      }); 
      this.toastr.success("The message has been successfully sent", "Success");
        //Call our API
      this.msg.msgtype = "0";
      this.msg.mode = 1;
      this.msg.msgdate = new Date().getUTCFullYear() + "/" + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate();
      this.apiService.post(MSG_API, this.msg).then((res: any)=>{ 
        debugger;
        if(res.status === "success"){
          //Set for next message display
          /* this.showdriver = false;
          this.showpassenger = true; */
        }
      });
    }
    
  }
  reset(){
    this.msg.msgdate = "";
    this.msg.party = "";
    this.msg.partynumber = "";
    this.msg.driver = "";
    this.msg.drivernumber = "";
    this.msg.carnumber = "";
    this.msg.cartype = "";
    this.msg.msgtype = "";
    this.msg.mode = "";
    this.msg.msgtime = "";
    this.showdriver = true;
    this.showpassenger = true;
  }
  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/' + ROUTE_BASIC);
  }
  sendmessagebtnpassenger(){
    if(!(this.msg.party && this.msg.partynumber && this.msg.driver && this.msg.drivernumber && this.msg.carnumber && this.msg.cartype)){
      this.toastr.error("Please enter all the details before sending message", "Error");
    }
    else{
      let queryParam = "";
      this.formpassengermsg();
      queryParam += "method=" + MESSAGE_METHOD;
      queryParam += "&send_to=" + this.msg.partynumber;
      //queryParam += "&send_to=9874993247";
      queryParam += "&msg=" + this.partymessage;
      queryParam += "&msg_type=" + MESSAGE_TYPE;
      queryParam += "&userid=" + MESSAGE_USER;
      queryParam += "&auth_scheme=" + MESSAGE_AUTH_SCHEME;
      queryParam += "&password=" + MESSAGE_PWD;
      queryParam += "&v=" + MESSAGE_VERSION;
      queryParam += "&format=" + MESSAGE_FORMAT;
      debugger;
      this.apiService.sendMessage(queryParam).then((data)=>{
      });
      this.toastr.success("The message has been successfully sent", "Success");
        //Call our API
      this.msg.msgtype = "1";
      this.msg.mode = 1;
      this.msg.msgdate = new Date().getUTCFullYear() + "/" + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate();
      this.apiService.post(MSG_API, this.msg).then((res: any)=>{ 
        debugger;
        if(res.status === "success"){
        }
      });
    }
  }
}
