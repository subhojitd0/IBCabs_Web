import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

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
  month: any;
  year: any;
  loading: boolean = false;
  masterrentaldetails: any;
  selecteditem: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['dutydate', 'partyname', 'reportto', 'carnumber', 'status', 'options'];
  dataSource: MatTableDataSource<RentalDetail>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
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
   onChangeMonth(val){
    this.loading = true;
    this.month = val;
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
   onChangeYear(val){
    this.loading = true;
    this.year = val;
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
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectall(){
    //Shows all the duties
    this.selecteditem = "ALL";
    
  }
  selectstage1(){
    //Filter rental details with only stage1 completed
    this.selecteditem = "STAGE-1";
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "0");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
  }
  selectstage2(){
    //Filter rental details with only stage2 completed
    this.selecteditem = "STAGE-2";
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "1");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
  }
  selectstage3(){
    //Filter rental details with only stage3 completed
    this.selecteditem = "STAGE-3";
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "2");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
  }
  selectstage4(){
    //Filter rental details with only stage3 completed
    this.selecteditem = "STAGE-4";
    this.rentalDetails = this.masterrentaldetails.filter(x=>x.status == "3");
    this.dataSource = new MatTableDataSource(this.rentalDetails);
  }
  edit(id: any) {
    localStorage.setItem('selectedduty', id);
    this.router.navigateByUrl('/add-ddr');
  }
  newduty(){
    this.router.navigateByUrl('/add-ddr');
  }
  deleteduty(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "partyheadcode": id
      }
      this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
}
