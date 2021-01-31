import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {DRIVER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { AddPartyHeadComponent } from '../party/add-party-head/add-party-head.component';
import { ROUTE_ADD_DDR, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';

export interface NewRental {
  mode: string,
  dutydate: string,
  dutytime: string,
  party : string,
  bookedby: string,
  bookedbycontact: string,
  reporttoname: string,
  reporttonum: string,
  goutbeforetime: string,
  ginbeforetime: string,
  goutbeforekm: string,
  ginbeforekm: string,
  transportinfo: string,
  center: number,
  note: string,
  centerName: string,
  driver: string,
  drivernum: string,
  cartype: string,
  carnum: string,
  gintime: string,
  gouttime: string,
  ginkm:string,
  goutkm:string,
  parking:string,
  outstationtype:string,
  outstation:string,
  nightcharge:string
}
export class RentalAdd implements NewRental {
  mode: string;
  dutydate: string;
  dutytime: string;
  party : string;
  bookedby: string;
  bookedbycontact: string;
  reporttoname: string;
  reporttonum: string;
  goutbeforetime: string;
  ginbeforetime: string;
  goutbeforekm: string;
  ginbeforekm: string;
  transportinfo: string;
  center: number;
  note: string;
  centerName: string;
  driver: string;
  drivernum: string;
  cartype: string;
  carnum: string;
  gintime: string;
  gouttime: string;
  ginkm:string;
  goutkm:string;
  parking:string;
  outstationtype:string;
  outstation:string;
  nightcharge:string;
}

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class RentalDetailComponent implements OnInit {
  rentalAdd: RentalAdd;
  isLinear: boolean;
  cartypes: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  allparties: any;
  alldrivers: any;
  allcars: any;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private toastr: ToastrService) {}
  ngAfterViewInit() {
    //this.stepper.selectedIndex = 1; 
  }
  createparty(){
    localStorage.setItem('selectedpartyheadid', "0");
    const dialogRef = this.dialog.open(AddPartyHeadComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  savedataandexit(stepper: MatStepper){
    if(this.rentalAdd.goutbeforekm)
      this.rentalAdd.ginbeforekm = this.rentalAdd.goutbeforekm;
    if(this.rentalAdd.goutbeforetime)
      this.rentalAdd.ginbeforetime = this.rentalAdd.goutbeforetime;
    if(this.rentalAdd.centerName == "Park Circus"){
      this.rentalAdd.center = 1;
    }
    else{
      this.rentalAdd.center = 0;
    }
    if(this.rentalAdd.mode != "2"){
      this.rentalAdd.mode = "1";
    }
    var ot = "0";
    this.rentalAdd.outstationtype = "0";
    var json = 
      {
        "mode":4,
        "partyheadcode": this.allparties.filter(x=>x.name == this.rentalAdd.party)[0].headcode
      } 
      debugger;
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        ot = res.outstation;
        this.rentalAdd.outstation = (parseInt(this.rentalAdd.outstation) * parseInt(ot)).toString();
        debugger;
        this.apiService.post(RENTAL_DETAIL_API_OFFICE, this.rentalAdd).then((res: any)=>{ 
          this.toastr.success("Your data was successfully saved",'Success');
          this.router.navigateByUrl('/' + ROUTE_VIEW_DDR);
        });
      });
    
  }
  savedata(stepper: MatStepper){
    if(this.rentalAdd.goutbeforekm)
      this.rentalAdd.ginbeforekm = this.rentalAdd.goutbeforekm;
    if(this.rentalAdd.goutbeforetime)
      this.rentalAdd.ginbeforetime = this.rentalAdd.goutbeforetime;
    if(this.rentalAdd.centerName == "Park Circus"){
      this.rentalAdd.center = 1;
    }
    else{
      this.rentalAdd.center = 0;
    }
    if(this.rentalAdd.mode != "2"){
      this.rentalAdd.mode = "1";
    }
    var ot = "0";
    this.rentalAdd.outstationtype = "0";
    var json = 
      {
        "mode":4,
        "partyheadcode": this.allparties.filter(x=>x.name == this.rentalAdd.party)[0].headcode
      } 
      debugger;
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        ot = res.outstation;
        if(ot)
          this.rentalAdd.outstation = (parseInt(this.rentalAdd.outstation) * parseInt(ot)).toString();
        else
        this.rentalAdd.outstation = "0";
        debugger;
        this.apiService.post(RENTAL_DETAIL_API_OFFICE, this.rentalAdd).then((res: any)=>{ 
          this.toastr.success("Your data was successfully saved",'Success');
          localStorage.setItem('selectedduty', res.dutyid);
          location.reload();
          //this.stepper.next();
        });
      });
    
  }
  savedatacreate(stepper: MatStepper){
    debugger;
    this.rentalAdd.ginbeforekm = this.rentalAdd.goutbeforekm;
    this.rentalAdd.ginbeforetime = this.rentalAdd.goutbeforetime;
    if(this.rentalAdd.party && this.rentalAdd.dutydate && this.rentalAdd.dutytime && this.rentalAdd.centerName){
      this.toastr.info("Please wait while we are saving your request",'Information');
      if(this.rentalAdd.centerName == "Park Circus"){
        this.rentalAdd.center = 1;
      }
      else{
        this.rentalAdd.center = 0;
      }
      if(this.rentalAdd.mode != "2"){
        this.rentalAdd.mode = "1";
      }
      debugger;
      this.apiService.post(RENTAL_DETAIL_API_OFFICE, this.rentalAdd).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
  changeparty(){
    var json = 
      {
        "mode":4,
        "partyheadcode": this.allparties.filter(x=>x.name == this.rentalAdd.party)[0].headcode
      } 
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        this.rentalAdd.ginbeforekm = res.kmin;
        this.rentalAdd.goutbeforetime = res.garagein;
        this.rentalAdd.ginbeforetime = res.garageout;
        this.rentalAdd.goutbeforekm = res.kmout;
        this.rentalAdd.dutytime = res.starttime ? res.starttime.substr(0,5) : "";
      });
  }
  changecar(){

  }
  changedriver(){
    var drivercode = this.alldrivers.filter(x=>x.drivername == this.rentalAdd.driver)[0].drivercode;
    var json = 
      {
        "mode":4,
        "drivercode": drivercode
      } 
      this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
        this.rentalAdd.drivernum = res.contact;
      });
  }
  viewallduties(){
    this.router.navigateByUrl('/' + ROUTE_VIEW_DDR);
  }
  ngOnInit() {
    debugger;
    this.rentalAdd = new RentalAdd();
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.allcars = JSON.parse(localStorage.getItem('allcars'));
    this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
    this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
    this.isLinear = true;
    this.firstFormGroup = this._formBuilder.group({
      PartyControl: ['', Validators.required],
      DutyControl: ['', Validators.required],
      DutyTimeControl: ['', Validators.required],
      BookedByControl: [],
      BookedContactControl: [],
      ReportControl: [],
      ReportContactControl: [],
      DispatchControl: ['', Validators.required],
      GOUTKMBufferControl: [],
      GOUTTimeBufferControl: [],
      GINKMBufferControl: [],
      GINTimeBufferControl: [],
      FlightControl: [],
      NotesControl: []
    });
    this.secondFormGroup = this._formBuilder.group({
      DriverControl: ['', Validators.required],
      DriverContactControl: ['', Validators.required],
      CarTypeControl: ['', Validators.required],
      CarNumberControl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      GINTIMEControl: ['', Validators.required],
      GINKMControl: ['', Validators.required],
      GOUTTIMEControl: ['', Validators.required],
      GOUTKMControl: ['', Validators.required],
      ParkingControl: ['', Validators.required],
      OutstationControl: ['', Validators.required],
      NightControl: ['', Validators.required]
    });
    var dutyid = JSON.parse(localStorage.getItem('selectedduty'));
    if(dutyid != "0"){
      var json = 
      {
        "mode":"4",
        "dutyid": dutyid
      };
      this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
        debugger;
        this.rentalAdd = res;
        
        if(this.rentalAdd.center == 0){
          this.rentalAdd.centerName = "Tollygunge";
        }
        else{
          this.rentalAdd.centerName = "Park Circus";
        }
        this.rentalAdd.dutytime = this.rentalAdd.dutytime.substr(0,5);
        /* this.rentalAdd.ginbeforetime = this.rentalAdd.ginbeforetime.substr(3,2);
        this.rentalAdd.goutbeforetime = this.rentalAdd.goutbeforetime.substr(3,2); */
        var jsonParty ={
          "mode":4,
          "partyheadcode": this.allparties.filter(x=>x.name == this.rentalAdd.party)[0].headcode
        } 
        var ot=0;
        debugger;
        this.apiService.post(PARTY_HEAD_API, jsonParty).then((res: any)=>{ 
          ot = res.outstation;
          this.rentalAdd.mode = "2";
        if(this.rentalAdd.gintime)
          this.rentalAdd.gintime = this.rentalAdd.gintime.substr(0,5);
        if(this,this.rentalAdd.gouttime)
          this.rentalAdd.gouttime = this.rentalAdd.gouttime.substr(0,5);

        if(this.rentalAdd.outstation != "NaN")
          this.rentalAdd.outstation = (parseFloat(this.rentalAdd.outstation) / parseFloat(ot.toString())).toString();
        else
          this.rentalAdd.outstation = "0";
        
        if(!this.rentalAdd.parking)
          this.rentalAdd.parking = "0";
        if(!this.rentalAdd.nightcharge)
          this.rentalAdd.nightcharge = "0";

        this.stepper.next();
        localStorage.setItem("rentaldetails", JSON.stringify(res.result));
        localStorage.setItem('selectedduty', "0");
        });
      });
    }
    else{
      //this.rentalAdd.dutydate = 
      localStorage.setItem('selectedduty', "0");
    }
  }
}
