import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {DRIVER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE, RENTAL_DETAIL_API_OFFICE_BULKEDIT} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { ROUTE_ADD_DDR, ROUTE_ADD_DDR_WALKIN, ROUTE_CHECK_DDR, ROUTE_EXPORT_DDR, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { Observable, Subject } from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import * as moment from 'moment-timezone';

export interface EditRentalDetail {
  isSelected: boolean;
  dutyid: string;
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
  rintime: string;
  routtime: string;
  rinkm:string;
  routkm:string;
  parking:string;
  billamount:string;
  outstation:string;
  nightcharge:string;
  options: string;
  status: string;
  slipo: string;
  da: string;
}

export interface RentalDetail {
  dutydate: string;
  dutyid: string;
  party: number;
  reportto: string;
  carnumber: string;
  status: string;
  dutytype: string;
  options: string;
}
@Component({
  selector: 'app-edit-rental-detail',
  templateUrl: './edit-rental-detail.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./edit-rental-detail.component.css']
})

export class EditRentalDetailComponent implements OnInit {
  rentalDetails: any;
  editRentalDetails: any;
  month: any;
  filterby: any;
  filtervalue: any;
  isBulkEdit: boolean;
  year: any;
  allcars: any;
  alldrivers: any;
  loading: boolean = false;
  masterrentaldetails: any;
  mastereditrentaldetails: any;
  selecteditem: any;
  cartypes: any;
  allparties: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['dutydt', 'party', 'carno', 'statusval', 'accept', 'options'];
  bulkdisplayedColumns: string[] = ['isselected','dutydate', 'partyname', 'reportto', 'driver', 'carnumber', 'cartype', 'slip', 'gouttime', 'goutkm', 'routtime', 'routkm', 'rintime', 'rinkm', 'gintime', 'ginkm', 'parking', 'outstation'];
  dataSource: MatTableDataSource<RentalDetail>;
  bulkDataSource: MatTableDataSource<EditRentalDetail>;
  filteredOptionsCar: Observable<any[]>;
  filteredOptionsCarType: Observable<any[]>;
  filteredOptionsDriver: Observable<any[]>;
  filteredOptionsReport: Observable<string[]>;
  reporttos: any;
  carFormControl: FormControl;
  carTypeFormControl: FormControl;
  driverFormControl: FormControl;
  alldrivernames: any;
  allcarno: any;
  allcartype: any;
  carselect: FormControl;
  driverselect: FormControl;
  partyselect: FormControl;
  reportselect: FormControl;
  partylist: Observable<string[]>;
  partynames: any;
  carlist: Observable<string[]>;
  driverlist: Observable<string[]>;
  ownerlist: Observable<string[]>;
  reportlist: Observable<string[]>;
  allcartypefilter: any;
  ddrrole: string;
  approverole: string;
  delete: string;
  allreportto: any;
  allreport: any;
  tkm: number;
  thr: any;
  ownerselect: FormControl;
  allowners: any;
  allownername: any;
  selectallval: boolean = false;
  date: any;
  dates: any[] = ["ALL",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  constructor(private cdRef:ChangeDetectorRef, private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
     this.date = "all";
    localStorage.setItem('selectedduty', "0");
    this.ddrrole = localStorage.getItem("enterddr");
    this.approverole = localStorage.getItem("approve");
    this.delete = localStorage.getItem("delete");
    this.partyselect = new FormControl();
    this.driverselect = new FormControl();
    this.carselect = new FormControl();
    this.reportselect = new FormControl();
    this.ownerselect = new FormControl();
    this.carFormControl = new FormControl();
    this.carTypeFormControl = new FormControl();
    this.driverFormControl = new FormControl();
    //this.assignAutoComplete();
     this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
     var yr = localStorage.getItem('rentalyr');
     var month = localStorage.getItem('rentalmonth');
     var dt = localStorage.getItem('rentaldate');
     var filterby = localStorage.getItem('rentalfilterby');
     var filterval = localStorage.getItem('rentalfilterval');
     this.allparties = JSON.parse(localStorage.getItem('allparties'));
     this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
     this.driverlogic();
     this.allowners = JSON.parse(localStorage.getItem('allowners'));
     this.allcars = JSON.parse(localStorage.getItem('allcars'));
     this.carlogic();
     this.alldrivernames = this.alldrivers.map(x=>x.drivername);
     this.allcarno = this.allcars.map(x=>x.carno);
     this.allcartype = this.cartypes.map(x=>x.car);
     this.allownername = this.allowners.map(x=>x.ownername);
     this.allreportto = JSON.parse(localStorage.getItem('allreportto'));
     this.allreport = this.allreportto.map(x=>x.report);
     this.partynames = this.allparties.map(x=>x.name);
     if(filterby)
        this.filterby = filterby;
     else 
        this.filterby = "party";

     if(filterval)
        this.filtervalue = filterval;
     else 
        this.filtervalue = this.allparties[0].name;

     if(yr && month){
      this.month = month;
      this.year = yr;
      this.date = dt;
     }
     else{
      this.month = new Date().getMonth() + 1;
      this.year = new Date().getFullYear();
      localStorage.setItem("rentalmonth", this.month);
      localStorage.setItem('rentaldate', this.date);
      localStorage.setItem("rentalyr", this.year);
      localStorage.setItem("rentalfilterby", this.filterby);
      localStorage.setItem("rentalfilterval", this.filtervalue);
     }
     this.isBulkEdit = false;
     this.selecteditem = "ALL";
    
    var json = 
    {
      "mode": 0,
      "month": this.month,
      "year": this.year,
      "filterby": this.filterby,
      "property": this.filtervalue
    };
    this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
      debugger;
      this.rentalDetails = res.result;
      this.masterrentaldetails = res.result;
      this.dataSource = new MatTableDataSource(this.rentalDetails);
      this.dataSource.paginator = this.paginator;
      localStorage.setItem("rentaldetails", JSON.stringify(res.result));
      this.assignAutoComplete();
    });
   
    debugger;
   }
   ngAfterViewChecked()
{
  console.log( "! changement de la date du composant !" );
  this.cdRef.detectChanges();
}
/* doFilter(x: any) {
  this.filteredOptionsDriver = this.alldrivernames.map(jokes => this.filter(jokes, x)),
  )
}
filter(val, x){
  return val.filter(joke => 
    joke.joke.toLowerCase().includes(x));
} */
checkddr(){
  localStorage.setItem("checkyear", this.year);
  localStorage.setItem("checkmonth", this.month);
  localStorage.setItem("checkfilter", this.filterby);
  localStorage.setItem("checkfilterby", this.filtervalue);
  this.router.navigateByUrl('/' + ROUTE_CHECK_DDR);
}
exportddr(){
  localStorage.setItem("exportyear", this.year);
  localStorage.setItem("exportmonth", this.month);
  this.router.navigateByUrl('/' + ROUTE_EXPORT_DDR);
}
  assignAutoComplete(){
   
    //party
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    //carno
    //this.filteredOptionsCar = this.carFormControl.valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    this.carlist = this.carselect.valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    //cartype
    this.reportlist = this.reportselect.valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
    //this.filteredOptionsCarType = this.carTypeFormControl.valueChanges.pipe(startWith(''),map(value => this._filterCarType(value)));
    //driver
    //this.filteredOptionsDriver = this.driverFormControl.valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
    this.driverlist = this.driverselect.valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
    this.ownerlist = this.ownerselect.valueChanges.pipe(startWith(''),map(value => this._filterOwner(value)));
   }
   public _filterOwner(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allownername.filter(client => client.toLowerCase().includes(filterValue));
  }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCar(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcarno.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterReport(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allreport.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCarType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcartype.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterDriver(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alldrivernames.filter(client => client.toString().toLowerCase().includes(filterValue)); 
  } 
  filterCarType(val: any){
    debugger;
    this.allcartype = this.cartypes.filter(x=>x.car.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.car);;
  }
  filterCar(val: any){
    debugger;
    this.allcarno = this.allcars.filter(x=>x.carno.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.carno);;
  }
  filterDriver(val: any){
    debugger;
    this.alldrivernames = this.alldrivers.filter(x=>x.drivername.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.drivername);;
  }
  filterReport(val: any){
    debugger;
    this.allreport = this.allreportto.filter(x=>x.report.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.report);;
  }
   showbulkedit(){
     this.loading = true;
     this.isBulkEdit = true;
     var json = 
    {
      "mode": 5,
      "month": this.month,
      "year": this.year,
      "filterby": this.filterby,
      "property": this.filtervalue
    };
    this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
      debugger;
      this.mastereditrentaldetails = res.result;
      this.allcars = JSON.parse(localStorage.getItem('allcars'));
      this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
      this.mastereditrentaldetails.forEach(element => {
        element.isSelected = false;
        var allparties = JSON.parse(localStorage.getItem('allparties'));
        var jsonParty ={
          "mode":4,
          "partyheadcode": allparties.filter(x=>x.name == element.party)[0].headcode
        } 
        var ot=0;
        this.apiService.post(PARTY_HEAD_API, jsonParty).then((res: any)=>{ 
          ot = res.outstation;
          //element.outstationtype = ot;
          //element.outstation = (parseInt(element.outstation) / parseInt(ot.toString())).toString();
        });
        if(element.gintime)
        {
          element.gintime = element.gintime.replace(" ","T");
          element.gintime = element.gintime.substr(0,element.gintime.length - 3);
        }
        if(element.gouttime)
        {
          element.gouttime = element.gouttime.replace(" ","T");
          element.gouttime = element.gouttime.substr(0,element.gouttime.length - 3);
        }

        if(element.rintime)
        {
          element.rintime = element.rintime.replace(" ","T");
          element.rintime = element.rintime.substr(0,element.rintime.length - 3);
        }
        if(element.routtime)
        {
          element.routtime = element.routtime.replace(" ","T");
          element.routtime = element.routtime.substr(0,element.routtime.length - 3);
        }
      
        if(!element.outstation || element.outstation == "NaN")
          element.outstation = "0";
        if(!element.parking)
          element.parking = "0";
        if(!element.nightcharge)
          element.nightcharge = "0";
      });
      
      this.editRentalDetails = this.mastereditrentaldetails;
      let filtered = this.mastereditrentaldetails.filter(x=>new Date(x.dutydate).getDate().toString() === this.date.toString());
      this.bulkDataSource = new MatTableDataSource(filtered);
      localStorage.setItem("editrentaldetails", JSON.stringify(res.result));
      this.loading = false;
    });
   }
   changedriver(){
   /*  var drivercode = this.alldrivers.filter(x=>x.drivername == this.editRentalDetails.driver)[0].drivercode;
    var json = 
      {
        "mode":4,
        "drivercode": drivercode
      } 
      this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
        this.editRentalDetails.drivernum = res.contact;
      }); */
  }
   showsingleedit(){
     this.isBulkEdit = false;
   }
   savebulkedit(){
    this.toastr.info("Please wait while we are saving your request",'Information');
     debugger;
     var allparties = JSON.parse(localStorage.getItem('allparties'));
     // && ( x.status !== '3' || x.status !== '4')
     var data = (this as any).mastereditrentaldetails.filter(x=>x.isSelected);
     data.forEach(async element => {
       debugger;
       //Assignning G values to R 
       if(element.goutkm && !element.routkm){
        element.routkm = element.goutkm;
      }
      if(element.ginkm && !element.rinkm){
        element.rinkm = element.ginkm;
      }
      if(element.gouttime && element.routtime === "0000-00-00T00:00"){
        element.routtime = element.gouttime;
      }
      if(element.gintime && element.rintime === "0000-00-00T00:00"){
        element.rintime = element.gintime;
      }
  
      //Assignning R values to G
      if(!element.goutkm && element.routkm){
        element.goutkm = element.routkm;
      }
      if(!element.ginkm && element.rinkm){
        element.ginkm = element.rinkm;
      }
      if(element.gouttime === "0000-00-00T00:00" && element.routtime){
        element.gouttime = element.routtime;
      }
      if(element.gintime === "0000-00-00T00:00" && element.rintime){
        element.gintime = element.rintime;
      }
      if(element.ginkm === ""){
        element.rinkm = "";
      }
      if(element.goutkm === ""){
        element.routkm = "";
      }
        //element.outstation = (parseInt(element.outstation) * parseInt(element.outstationtype.toString())).toString();
        //element.outstationtype = 0;
      });
     this.apiService.post(RENTAL_DETAIL_API_OFFICE_BULKEDIT, data).then((res: any)=>{ 
       debugger;
       this.toastr.success("Your data was successfully saved",'Success');
       this.router.navigateByUrl('/' + ROUTE_VIEW_DDR);
     });
   }
   onChangeMonth(val){
    this.loading = true;
    this.month = val;
    this.setJson();
   }
   onChangeYear(val){
    this.loading = true;
    this.year = val;
    this.setJson();
   }
   onChangeDay(val){
    this.loading = true;
    this.date = val;
    this.setJson();
   }
   onChangeFilter(val){
    this.loading = true;
    this.filterby = val;
    if(val === "party"){
      this.filtervalue = this.allparties[0].name;
    }
    else if(val === "driver"){
      this.filtervalue = this.alldrivers[0].drivercode;
    }
    else if(val === "report"){
      this.filtervalue = this.allreportto[0].drivercode;
    }
    else if(val === "owner"){
      this.filtervalue = this.allownername[0].ownercode;
    }
    else{
      this.filtervalue = this.allcars[0].carcode;
    }
    this.loading = true;
    this.setJson();
   }
   onChangeFilterVal(val){
    this.loading = true;
    this.filtervalue = val.option.value;
    this.setJson();
   }
   selectallduty(){
     this.selectallval = !this.selectallval;
     this.editRentalDetails.forEach(element => {
       if(element.status !== '3' && element.status !== '4')
          element.isSelected = this.selectallval;
     });
   }
   setJson(){
    localStorage.setItem("rentalmonth", this.month);
    localStorage.setItem("rentaldate", this.date);
    localStorage.setItem("rentalyr", this.year);
    localStorage.setItem("rentalfilterby", this.filterby);
    localStorage.setItem("rentalfilterval", this.filtervalue);
    if(this.isBulkEdit){
      var json = 
      {
        "mode": 5,
        "month": this.month,
        "year": this.year,
        "filterby": this.filterby,
        "property": this.filtervalue
      };
      this.loadOnChange(json);
    }
    else{
      var json = 
      {
        "mode": 0,
        "month": this.month,
        "year": this.year,
        "filterby": this.filterby,
        "property": this.filtervalue
      };
      this.loadOnChange(json);
    }
   }
   loadOnChange(json: any){
    if(this.isBulkEdit){
      this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
        debugger;
        this.editRentalDetails = res.result;
        if(this.date !== "ALL"){
          this.editRentalDetails = this.editRentalDetails.filter(x=>new Date(x.dutydate).getDate().toString() === this.date.toString());
        }
        this.allcars = JSON.parse(localStorage.getItem('allcars'));
        this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
        this.editRentalDetails.forEach(element => {
          element.isSelected = false;
        });
        if(this.editRentalDetails.gintime){
          this.editRentalDetails.gintime = this.editRentalDetails.gintime.replace(" ","T");
          this.editRentalDetails.gintime = this.editRentalDetails.gintime.substr(0,this.editRentalDetails.gintime.length - 3);
        }
        if(this.editRentalDetails.gouttime){
          this.editRentalDetails.gouttime = this.editRentalDetails.gouttime.replace(" ","T");
          this.editRentalDetails.gouttime = this.editRentalDetails.gouttime.substr(0,this.editRentalDetails.gouttime.length - 3);
        }
        if(this.editRentalDetails.rintime){
          this.editRentalDetails.rintime = this.editRentalDetails.rintime.replace(" ","T");
          this.editRentalDetails.rintime = this.editRentalDetails.rintime.substr(0,this.editRentalDetails.rintime.length - 3);
        }
        if(this.editRentalDetails.routtime){
          this.editRentalDetails.routtime = this.editRentalDetails.routtime.replace(" ","T");
          this.editRentalDetails.routtime = this.editRentalDetails.routtime.substr(0,this.editRentalDetails.routtime.length - 3);
        }
        this.mastereditrentaldetails = res.result;
        this.bulkDataSource = new MatTableDataSource(this.editRentalDetails);
        localStorage.setItem("editrentaldetails", JSON.stringify(res.result));
        this.loading = false;
      });
    }
    else{
      this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
        debugger;
        this.rentalDetails = res.result;
        if(this.date !== "ALL"){
          this.rentalDetails = this.rentalDetails.filter(x=>new Date(x.dutydate).getDate().toString() === this.date.toString());
        }
        this.masterrentaldetails = res.result;
        this.dataSource = new MatTableDataSource(this.rentalDetails);
        localStorage.setItem("rentaldetails", JSON.stringify(res.result));
        this.loading = false;
      });
    }
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectall(){
    //Shows all the duties
    this.selecteditem = "ALL";
    if(this.isBulkEdit){
      this.editRentalDetails = this.mastereditrentaldetails;
      this.bulkDataSource = new MatTableDataSource(this.editRentalDetails);
    }
    else{
    this.rentalDetails = this.masterrentaldetails;
    this.dataSource = new MatTableDataSource(this.rentalDetails);
    }
  }
  selectstage1(){
    debugger;
    //Filter rental details with only stage1 completed
    this.selecteditem = "STAGE-1";
    if(this.isBulkEdit){
      this.editRentalDetails = this.mastereditrentaldetails.filter(x=>x.status == "0");
      this.bulkDataSource = new MatTableDataSource(this.editRentalDetails);
    }
    else{
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "0");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
    }
  }
  selectstage2(){
    debugger;
    //Filter rental details with only stage2 completed
    this.selecteditem = "STAGE-2";
    if(this.isBulkEdit){
      this.editRentalDetails = this.mastereditrentaldetails.filter(x=>x.status == "1");
      this.bulkDataSource = new MatTableDataSource(this.editRentalDetails);
    }
    else{
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "1");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
    }
  }
  selectstage3(){
    debugger;
    //Filter rental details with only stage3 completed
    this.selecteditem = "STAGE-3";
    if(this.isBulkEdit){
      this.editRentalDetails = this.mastereditrentaldetails.filter(x=>x.status == "2");
      this.bulkDataSource = new MatTableDataSource(this.editRentalDetails);
    }
    else{
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "2");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
    }
  }
  selectstage4(){
    //Filter rental details with only stage3 completed
    this.selecteditem = "STAGE-4";
    if(this.isBulkEdit){
      this.editRentalDetails = this.mastereditrentaldetails.filter(x=>x.status == "3");
      this.bulkDataSource = new MatTableDataSource(this.editRentalDetails);
    }
    else{
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "3");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
    }
  }
  approve(id: any, party: any){
    /* localStorage.setItem('selectedrentalid', id ); */
    /* const dialogRefConf = this.dialog.open(ConfirmationModalComponent);

    dialogRefConf.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    }); */
    if(party === "WALK IN(ON CALL)"){
      localStorage.setItem('selectedduty', id);
      this.router.navigateByUrl('/' + ROUTE_ADD_DDR_WALKIN);
    }
    else{
      localStorage.setItem('selectedduty', id);
      this.router.navigateByUrl('/' + ROUTE_ADD_DDR);
    }
    /* localStorage.setItem('selectedduty', id);
    this.router.navigateByUrl('/' + ROUTE_ADD_DDR); */
  }

  caltotal(row)
  {
    this.tkm=parseFloat(row.ginkm)-parseFloat(row.goutkm);
    this.thr = moment.duration(moment(row.gintime).diff(moment(row.gouttime))).asMinutes()/60 ;

    //var time = new Date().getTime() - new Date("2013-02-20T12:01:04.753Z").getTime();
    //moment.duration(moment(row.gintime, "HH:mm:ss").diff(moment(row.gouttime, "HH:mm:ss"))).asMinutes() / 60
  }

  edit(id: any, party: any) {
    if(party === "WALK IN(ON CALL)"){
      localStorage.setItem('selectedduty', id);
      this.router.navigateByUrl('/' + ROUTE_ADD_DDR_WALKIN);
    }
    else{
      localStorage.setItem('selectedduty', id);
      this.router.navigateByUrl('/' + ROUTE_ADD_DDR);
    }
    
  }
  carlogic(){
    debugger;
    let validcars = [];
    this.allcars.forEach(element => {
      if(new Date() < new Date(element.puc) && new Date() < new Date(element.tax) && new Date() < new Date(element.ins)){
        validcars.push(element);
      }
    });
    this.allcars = [];
    this.allcars = validcars;
  }
  driverlogic(){
    debugger;
    let validdrivers = [];
    this.alldrivers.forEach(element => {
      if(element.licenseExpiry != "0000-00-00" && new Date() < new Date(element.licenseExpiry)){
        validdrivers.push(element);
      }
    });
    this.alldrivers = [];
    this.alldrivers = validdrivers;
  }
  newduty(){
    this.router.navigateByUrl('/' + ROUTE_ADD_DDR);
  }
  deleteduty(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "dutyid": id
      }
      this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
  sendMessage(id: any){
    localStorage.setItem('selectedrentalid', id );
    const dialogRef = this.dialog.open(MessageModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
  }
}
