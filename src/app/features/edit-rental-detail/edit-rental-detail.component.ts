import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {DRIVER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE, RENTAL_DETAIL_API_OFFICE_BULKEDIT} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { ROUTE_ADD_DDR } from 'src/shared/constants/constant';

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
  isBulkEdit: boolean;
  year: any;
  allcars: any;
  alldrivers: any;
  loading: boolean = false;
  masterrentaldetails: any;
  mastereditrentaldetails: any;
  selecteditem: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['dutydate', 'partyname', 'reportto', 'carnumber', 'status', 'options'];
  bulkdisplayedColumns: string[] = ['isselected','dutydate', 'partyname', 'reportto', 'driver', 'carnumber', 'cartype', 'goutkm', 'ginkm', 'gouttime', 'gintime', 'parking', 'outstation', 'night'];
  dataSource: MatTableDataSource<RentalDetail>;
  bulkDataSource: MatTableDataSource<EditRentalDetail>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
     this.isBulkEdit = false;
    this.selecteditem = "ALL";
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    var json = 
    {
      "mode": 0,
      "month": this.month,
      "year": this.year
    };
    this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
      debugger;
      this.rentalDetails = res.result;
      this.masterrentaldetails = res.result;
      this.dataSource = new MatTableDataSource(this.rentalDetails);
      localStorage.setItem("rentaldetails", JSON.stringify(res.result));
    });
   }
   showbulkedit(){
     this.isBulkEdit = true;
     var json = 
    {
      "mode": 5,
      "month": this.month,
      "year": this.year
    };
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
     debugger;
     var data = this.editRentalDetails.filter(x=>x.isSelected);
     this.apiService.post(RENTAL_DETAIL_API_OFFICE_BULKEDIT, data).then((res: any)=>{ 
       debugger;
     });
   }
   onChangeMonth(val){
    this.loading = true;
    this.month = val;
    if(this.isBulkEdit){
      var json = 
      {
        "mode": 5,
        "month": val,
        "year": this.year
      };
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
    var json = 
    {
      "mode": 0,
      "month": val,
      "year": this.year
    };
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
   onChangeYear(val){
    this.loading = true;
    this.year = val;
    if(this.isBulkEdit){
      var json = 
      {
        "mode": 5,
        "month": this.month,
        "year": val
      };
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
    var json = 
    {
      "mode": 0,
      "month": this.month,
      "year": val
    };
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
}
