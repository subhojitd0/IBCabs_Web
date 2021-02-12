import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ROUTE_ADD_DDR, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { Observable, Subject } from 'rxjs';
import {startWith, map} from 'rxjs/operators';

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
  parking:string;
  outstationtype:string;
  outstation:string;
  nightcharge:string;
  options: string;
  status: string;
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
  displayedColumns: string[] = ['dutydt', 'party', 'carno', 'statusval', 'options'];
  bulkdisplayedColumns: string[] = ['isselected','dutydate', 'partyname', 'reportto', 'driver', 'carnumber', 'cartype', 'goutkm', 'ginkm', 'gouttime', 'gintime', 'parking', 'outstation', 'night'];
  dataSource: MatTableDataSource<RentalDetail>;
  bulkDataSource: MatTableDataSource<EditRentalDetail>;
  filteredOptionsCar: Observable<any[]>;
  filteredOptionsCarType: Observable<any[]>;
  filteredOptionsDriver: Observable<any[]>;
  carFormControl: FormControl;
  carTypeFormControl: FormControl;
  driverFormControl: FormControl;
  alldrivernames: any;
  allcarno: any;
  allcartype: any;
  carselect: FormControl;
  driverselect: FormControl;
  partyselect: FormControl;
  partylist: Observable<string[]>;
  partynames: any;
  carlist: Observable<string[]>;
  driverlist: Observable<string[]>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    this.assignAutoComplete();
     this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
     var yr = localStorage.getItem('rentalyr');
     var month = localStorage.getItem('rentalmonth');
     var filterby = localStorage.getItem('rentalfilterby');
     var filterval = localStorage.getItem('rentalfilterval');
     this.allparties = JSON.parse(localStorage.getItem('allparties'));
     this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
     this.allcars = JSON.parse(localStorage.getItem('allcars'));
     this.alldrivernames = this.alldrivers.map(x=>x.drivername);
     this.allcarno = this.allcars.map(x=>x.carno);
     this.allcartype = this.cartypes.map(x=>x.car);
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
     }
     else{
      this.month = new Date().getMonth() + 1;
      this.year = new Date().getFullYear();
      localStorage.setItem("rentalmonth", this.month);
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
    });
    this.assignAutoComplete();
    debugger;
   }
   assignAutoComplete(){
    this.partyselect = new FormControl();
    this.driverselect = new FormControl();
    this.carselect = new FormControl();
    this.carFormControl = new FormControl();
    this.carTypeFormControl = new FormControl();
    this.driverFormControl = new FormControl();
    //party
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    //carno
    this.filteredOptionsCar = this.carFormControl.valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    this.carlist = this.carselect.valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    //cartype
    this.filteredOptionsCarType = this.carTypeFormControl.valueChanges.pipe(startWith(''),map(value => this._filterCarType(value)));
    //driver
    this.filteredOptionsDriver = this.driverFormControl.valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
    this.driverlist = this.driverselect.valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
   }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCar(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcarno.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCarType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcartype.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterDriver(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alldrivernames.filter(client => client.toString().toLowerCase().includes(filterValue));
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
          element.outstationtype = ot;
          element.outstation = (parseInt(element.outstation) / parseInt(ot.toString())).toString();
        });
        if(element.gintime)
          element.gintime = element.gintime.substr(0,5);
        if(element.gouttime)
          element.gouttime = element.gouttime.substr(0,5);
      
        if(!element.outstation || element.outstation == "NaN")
          element.outstation = "0";
        if(!element.parking)
          element.parking = "0";
        if(!element.nightcharge)
          element.nightcharge = "0";
      });
      

      this.bulkDataSource = new MatTableDataSource(this.mastereditrentaldetails);
      localStorage.setItem("editrentaldetails", JSON.stringify(res.result));
      this.loading = false;
    });
   }
   changedriver(){
    var drivercode = this.alldrivers.filter(x=>x.drivername == this.editRentalDetails.driver)[0].drivercode;
    var json = 
      {
        "mode":4,
        "drivercode": drivercode
      } 
      this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
        this.editRentalDetails.drivernum = res.contact;
      });
  }
   showsingleedit(){
     this.isBulkEdit = false;
   }
   savebulkedit(){
    this.toastr.info("Please wait while we are saving your request",'Information');
     debugger;
     var allparties = JSON.parse(localStorage.getItem('allparties'));
     var data = (this as any).mastereditrentaldetails.filter(x=>x.isSelected);
     data.forEach(async element => {
        element.outstation = (parseInt(element.outstation) * parseInt(element.outstationtype.toString())).toString();
        element.outstationtype = 1;
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
   onChangeFilter(val){
    this.loading = true;
    this.filterby = val;
    if(val === "party"){
      this.filtervalue = this.allparties[0].name;
    }
    else if(val === "driver"){
      this.filtervalue = this.alldrivers[0].drivercode;
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
   setJson(){
    localStorage.setItem("rentalmonth", this.month);
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
        this.allcars = JSON.parse(localStorage.getItem('allcars'));
        this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
        this.editRentalDetails.forEach(element => {
          element.isSelected = false;
        });
        if(this.editRentalDetails.gintime)
            this.editRentalDetails.gintime = this.editRentalDetails.gintime.substr(0,5);
          if(this,this.editRentalDetails.gouttime)
            this.editRentalDetails.gouttime = this.editRentalDetails.gouttime.substr(0,5);
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
  approve(id){
    localStorage.setItem('selectedrentalid', id );
    const dialogRefConf = this.dialog.open(ConfirmationModalComponent);

    dialogRefConf.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
  }
  edit(id: any) {
    localStorage.setItem('selectedduty', id);
    this.router.navigateByUrl('/' + ROUTE_ADD_DDR);
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
