import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {DRIVER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_WALKIN} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { AddPartyHeadComponent } from '../party/add-party-head/add-party-head.component';
import { ROUTE_ADD_DDR, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface NewRental {
  mode: string,
  dutydate: string,
  dutytime: string,
  party : string,
  bookedby: string,
  bookedbycontact: string,
  reporttonamea: string,
  reporttonuma: string,
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
  billamount:string,
  outstation:string,
  nightcharge:string,
  dutyid: string,
  replace: string,
  reporttonameb: string,
  reporttonumb: string,
  reporttonamec: string,
  reporttonumc: string,
  reporttonamed: string,
  reporttonumd: string,
  reporttonamee: string,
  reporttonume: string,
  pickuploc: string,
  droploc: string,
  dutytype: string,
  rintime: string,
  routtime: string,
  rinkm:string,
  routkm:string
}
export class RentalAdd implements NewRental {
  mode: string;
  dutydate: string;
  dutytime: string;
  party : string;
  bookedby: string;
  bookedbycontact: string;
  reporttonamea: string;
  reporttonuma: string;
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
  billamount:string;
  outstation:string;
  nightcharge:string;
  dutystatus: string;
  dutyid: string;
  replace: string;
  reporttonameb: string;
  reporttonumb: string = "";
  reporttonamec: string;
  reporttonumc: string = "";
  reporttonamed: string;
  reporttonumd: string = "";
  reporttonamee: string;
  reporttonume: string = "";
  pickuploc: string;
  droploc: string;
  dutytype: string;
  rintime: string;
  routtime: string;
  rinkm:string;
  routkm:string;
}

@Component({
  selector: 'app-rental-detail-walkin',
  templateUrl: './rental-detail-walkin.component.html',
  styleUrls: ['./rental-detail-walkin.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class RentalDetailWalkinComponent implements OnInit  {
  filteredOptionsCar: Observable<any[]>;
  filteredOptionsCarSub: Observable<any[]>;
  filteredOptionsCarType: Observable<any[]>;
  filteredOptionsDriver: Observable<any[]>;
  partylist: Observable<string[]>;
  alldrivernames: any;
  allcarno: any;
  allcarnosub: any[] =[];
  allcartype: any;
  partynames: any;
  rentalAdd: RentalAdd;
  isLinear: boolean;
  cartypes: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  allparties: any;
  alldrivers: any;
  allcars: any;
  report2visible = false;
  report3visible = false;
  report4visible = false;
  report5visible = false;
  @ViewChild('stepper') stepper: MatStepper;
  allreportto: any;
  filteredOptionsReport: Observable<string[]>;
  reporttos: any;
  ddrrole: string;
  approve: string;
  delete: string;
  ownername: any;

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
  setGRvalues(){
    //Assignning G values to R 
    if(this.rentalAdd.goutkm && !this.rentalAdd.routkm){
      this.rentalAdd.routkm = this.rentalAdd.goutkm;
    }
    if(this.rentalAdd.ginkm && !this.rentalAdd.rinkm){
      this.rentalAdd.rinkm = this.rentalAdd.ginkm;
    }
    if(this.rentalAdd.gouttime && (this.rentalAdd.routtime === undefined || this.rentalAdd.routtime === "0000-00-00T00:00")){
      this.rentalAdd.routtime = this.rentalAdd.gouttime;
    }
    if(this.rentalAdd.gintime && (this.rentalAdd.rintime === undefined || this.rentalAdd.rintime === "0000-00-00T00:00" )){
      this.rentalAdd.rintime = this.rentalAdd.gintime;
    }

    //Assignning R values to G
    if(!this.rentalAdd.goutkm && this.rentalAdd.routkm){
      this.rentalAdd.goutkm = this.rentalAdd.routkm;
    }
    if(!this.rentalAdd.ginkm && this.rentalAdd.rinkm){
      this.rentalAdd.ginkm = this.rentalAdd.rinkm;
    }
    if((this.rentalAdd.gouttime === undefined  || this.rentalAdd.gouttime === "0000-00-00T00:00" ) && this.rentalAdd.routtime){
      this.rentalAdd.gouttime = this.rentalAdd.routtime;
    }
    if((this.rentalAdd.gintime === undefined  || this.rentalAdd.gintime === "0000-00-00T00:00" ) && this.rentalAdd.rintime){
      this.rentalAdd.gintime = this.rentalAdd.rintime;
    }
    if(this.rentalAdd.ginkm === ""){
      this.rentalAdd.rinkm = "";
    }
    if(this.rentalAdd.goutkm === ""){
      this.rentalAdd.routkm = "";
    }
  }
  addreportto(){
    if(this.report2visible){
      if(this.report3visible){
        if(this.report4visible){
          if(this.report5visible){

          }
          else{
            this.report5visible = true;
          }
        }
        else{
          this.report4visible = true;
        }
      }
      else{
        this.report3visible = true;
      }
    }
    else{
      this.report2visible = true;
    }
  }
  checkreportto(){
    if(this.rentalAdd.reporttonameb)
      this.report2visible = true;
    if(this.rentalAdd.reporttonamec)
      this.report3visible = true;
    if(this.rentalAdd.reporttonamed)
      this.report4visible = true;
    if(this.rentalAdd.reporttonamee)
      this.report5visible = true;
  }
  removereportto(){
    if(this.report5visible){
      this.report5visible = false;
    }
    else{
      if(this.report4visible){
        this.report4visible = false;
      }
      else{
        if(this.report3visible){
          this.report3visible = false;
        }
        else{
          if(this.report2visible){
            this.report2visible = false;
          }
        }
      }
    }
  }
  savedataandexit(stepper: MatStepper, step: any){
    let id = localStorage.getItem('selectedduty');
    if(this.isValid(step)){
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
    this.setGRvalues();
    //this.rentalAdd.outstationtype = "0";
    var json = 
      {
        "mode":4,
        "partyheadcode": this.allparties.filter(x=>x.name == this.rentalAdd.party)[0].headcode
      } 
      debugger;
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        ot = res.outstation;
        //this.rentalAdd.outstation = (parseInt(this.rentalAdd.outstation) * parseInt(ot)).toString();
        debugger;
        if(isNaN(parseInt(id))|| parseInt(id) === 0){
          this.rentalAdd.mode = "1";
        }
        else{
          this.rentalAdd.mode = "2";
          this.rentalAdd.dutyid = id;
        }
        this.rentalAdd.dutytype = "1";
        this.apiService.post(RENTAL_DETAIL_API_WALKIN, this.rentalAdd).then((res: any)=>{ 
          this.toastr.success("Your data was successfully saved",'Success');
          this.router.navigateByUrl('/' + ROUTE_VIEW_DDR);
        });
      });
    }
  }
  savedata(stepper: MatStepper, step: any){
    let id = localStorage.getItem('selectedduty');
    if(this.isValid(step)){
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
    this.setGRvalues();
    //this.rentalAdd.outstationtype = "0";
    var json = 
      {
        "mode":4,
        "partyheadcode": this.allparties.filter(x=>x.name == this.rentalAdd.party)[0].headcode
      } 
      debugger;
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        ot = res.outstation;
        /* if(ot)
          this.rentalAdd.outstation = (parseInt(this.rentalAdd.outstation) * parseInt(ot)).toString();
        else
        this.rentalAdd.outstation = "0"; */
        debugger;
        if(isNaN(parseInt(id))|| parseInt(id) === 0){
          this.rentalAdd.mode = "1";
        }
        else{
          this.rentalAdd.mode = "2";
          this.rentalAdd.dutyid = id;
        }
        this.rentalAdd.dutytype = "1";
        this.apiService.post(RENTAL_DETAIL_API_WALKIN, this.rentalAdd).then((res: any)=>{ 
          this.toastr.success("Your data was successfully saved",'Success');
          localStorage.setItem('selectedduty', res.dutyid);
          //location.reload();
          if(step === 'save'){

          }
          else{
          this.stepper.next();
          }
        });
      });
    }
  }
  savedatacreate(stepper: MatStepper, step: any){
    let id = localStorage.getItem('selectedduty');
    debugger;
    if(this.isValid(step)){
      this.rentalAdd.ginbeforekm = this.rentalAdd.goutbeforekm;
      this.rentalAdd.ginbeforetime = this.rentalAdd.goutbeforetime;
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
      if(isNaN(parseInt(id)) || parseInt(id) === 0){
          this.rentalAdd.mode = "1";
        }
        else{
          this.rentalAdd.mode = "2";
          this.rentalAdd.dutyid = id;
        }
        this.rentalAdd.dutytype = "1";
        this.setGRvalues();
      this.apiService.post(RENTAL_DETAIL_API_WALKIN, this.rentalAdd).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        localStorage.setItem('selectedduty', "0");
        location.reload();
      });
    }
  }
  isValid(step: any){
    if(step === "save")
      return true;
    if(step === "1"){
      return (this.rentalAdd.party && this.rentalAdd.dutydate && this.rentalAdd.dutytime && this.rentalAdd.centerName && this.rentalAdd.reporttonamea);
    }
    if(step === "2"){
      return (this.rentalAdd.driver && this.rentalAdd.drivernum && this.rentalAdd.carnum && this.rentalAdd.cartype && this.rentalAdd.replace);
    }
    if(step === "3"){
      return ((this.rentalAdd.ginkm || this.rentalAdd.rinkm) && 
      (this.rentalAdd.goutkm || this.rentalAdd.routkm) && 
      (this.rentalAdd.gintime || this.rentalAdd.rintime) && 
      (this.rentalAdd.gouttime || this.rentalAdd.routtime) && this.rentalAdd.parking );
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
        this.rentalAdd.reporttonamea = res.reportto;
        this.rentalAdd.dutytime = res.starttime ? res.starttime.substr(0,5) : "";
      });
  }
  changecar(){
    var ownerid = this.allcars.filter(x=>x.carno === this.rentalAdd.carnum)[0].ownercode;
    if(ownerid){
      let owners = JSON.parse(localStorage.getItem('allowners'));
      this.ownername = owners.filter(x=>x.ownercode === ownerid)[0].ownername;
    }
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
  setAutoComplete(){
    //party
    this.partylist = this.firstFormGroup.get('PartyControl').valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    //carno
    this.filteredOptionsCar = this.secondFormGroup.get('CarNumberControl').valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    //carno
    this.filteredOptionsCarSub = this.secondFormGroup.get('SubCarNumberControl').valueChanges.pipe(startWith(''),map(value => this._filterCarSub(value)));
    //cartype
    this.filteredOptionsCarType = this.secondFormGroup.get('CarTypeControl').valueChanges.pipe(startWith(''),map(value => this._filterCarType(value)));
    this.filteredOptionsCarType = this.firstFormGroup.get('FlightControl').valueChanges.pipe(startWith(''),map(value => this._filterCarType(value)));
    //driver
    this.filteredOptionsDriver = this.secondFormGroup.get('DriverControl').valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
    //report
    this.filteredOptionsReport = this.firstFormGroup.get('ReportControl').valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
  }
  changeNote(){
    /* if(this.rentalAdd.centerName === "Others"){
      this.rentalAdd.note = "Airport";
    } */
  }
  public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterReport(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.reporttos.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCar(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcarno.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCarSub(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcarnosub.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCarType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcartype.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterDriver(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alldrivernames.filter(client => client.toString().toLowerCase().includes(filterValue));
  }
  ngOnInit() {
    debugger;
    this.ddrrole = localStorage.getItem("enterddr");
    this.approve = localStorage.getItem("approve");
    this.delete = localStorage.getItem("delete");
    this.rentalAdd = new RentalAdd();
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.allcars = JSON.parse(localStorage.getItem('allcars'));
    this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
    this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
    this.allreportto = JSON.parse(localStorage.getItem('allreportto'));
    this.alldrivernames = this.alldrivers.map(x=>x.drivername);
     this.allcarno = this.allcars.map(x=>x.carno);
    this.allcarnosub.push("NO SUBSTITUTE");
    this.allcarnosub.push("SUBSTITUTE CAR");
    this.allcars.map(x=>x.carno).filter((element: any)=>{
      this.allcarnosub.push(element);
    });
     //this.allcarnosub = this.allcars.map(x=>x.carno);
     this.allcartype = this.cartypes.map(x=>x.car);
     this.partynames = this.allparties.map(x=>x.name);
     this.reporttos = this.allreportto.map(x=>x.report);
    this.isLinear = true;
    this.firstFormGroup = this._formBuilder.group({
      PartyControl: ['', Validators.required],
      DutyControl: ['', Validators.required],
      DutyTimeControl: ['', Validators.required],
      BookedByControl: [],
      BookedContactControl: [],
      ReportControl: ['', Validators.required],
      ReportContactControl: [],
      ReportControl2: [],
      ReportContactControl2: [],
      ReportControl3: [],
      ReportContactControl3: [],
      ReportControl4: [],
      ReportContactControl4: [],
      ReportControl5: [],
      ReportContactControl5: [],
      DispatchControl: ['', Validators.required],
      GOUTKMBufferControl: [],
      GOUTTimeBufferControl: [],
      GINKMBufferControl: [],
      GINTimeBufferControl: [],
      FlightControl: ['', Validators.required],
      NotesControl: [],
      PickupControl: [],
      DropControl: []
    });
    this.secondFormGroup = this._formBuilder.group({
      DriverControl: ['', Validators.required],
      DriverContactControl: ['', Validators.required],
      CarTypeControl: ['', Validators.required],
      CarNumberControl: ['', Validators.required],
      SubCarNumberControl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      GINTIMEControl: ['', Validators.required],
      GINKMControl: ['', Validators.required],
      GOUTTIMEControl: ['', Validators.required],
      GOUTKMControl: ['', Validators.required],
      RINTIMEControl: [''],
      RINKMControl: [''],
      ROUTTIMEControl: [''],
      ROUTKMControl: [''],
      ParkingControl: ['', Validators.required],
      OutstationControl: ['', Validators.required]
    });
    this.setAutoComplete();
    var dutyid = JSON.parse(localStorage.getItem('selectedduty'));
    if(dutyid != "0"){
      var json = 
      {
        "mode":"4",
        "dutyid": dutyid
      };
      this.apiService.post(RENTAL_DETAIL_API_WALKIN, json).then((res: any)=>{ 
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
          debugger;
        if(this.rentalAdd.gintime){
          this.rentalAdd.gintime = this.rentalAdd.gintime.replace(" ","T");
          this.rentalAdd.gintime = this.rentalAdd.gintime.substr(0,this.rentalAdd.gintime.length - 3);
        }
          
        if(this,this.rentalAdd.gouttime){
          this.rentalAdd.gouttime = this.rentalAdd.gouttime.replace(" ","T");
          this.rentalAdd.gouttime = this.rentalAdd.gouttime.substr(0,this.rentalAdd.gouttime.length - 3);
        }

        /* if(this.rentalAdd.outstation != "NaN")
          this.rentalAdd.outstation = (parseFloat(this.rentalAdd.outstation) / parseFloat(ot.toString())).toString();
        else
          this.rentalAdd.outstation = "0"; */
        
        if(!this.rentalAdd.parking)
          this.rentalAdd.parking = "0";
        if(!this.rentalAdd.nightcharge)
          this.rentalAdd.nightcharge = "0";
        
        debugger;
        if(this.rentalAdd.dutystatus === "1")
        {
          this.stepper.next();
          this.stepper.next();
        }
        if(this.rentalAdd.dutystatus === "2")
        {
          this.stepper.next();
          this.stepper.next();
        }
        this.checkreportto();
        localStorage.setItem("rentaldetails", JSON.stringify(res.result));
        //localStorage.setItem('selectedduty', "0");
        });
      });
    }
    else{
      this.rentalAdd.replace = "NO SUBSTITUTE";
      //this.rentalAdd.dutydate = 
      localStorage.setItem('selectedduty', "0");
    }
  }
}

