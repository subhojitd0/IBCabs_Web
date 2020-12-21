import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {PARTY_HEAD_API, RENTAL_DETAIL_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

export interface RentalDetail {
  date: string;
  partyname: number;
  reportto: string;
  carno: string;
  status: string;
  options: string;
}

@Component({
  selector: 'app-edit-rental-detail',
  templateUrl: './edit-rental-detail.component.html',
  styleUrls: ['./edit-rental-detail.component.css']
})

export class EditRentalDetailComponent implements OnInit {
  rentalDetails: any;
  selecteditem: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['date', 'partyname', 'reportto', 'carno', 'status', 'options'];
  dataSource: MatTableDataSource<RentalDetail>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    this.selecteditem = "ALL";
    var json = 
    {
      "mode": 0
    };
    /* this.apiService.post(RENTAL_DETAIL_API, json).then((res: any)=>{ 
      debugger;
      this.rentalDetails = res.result;
      this.dataSource = new MatTableDataSource(this.rentalDetails);
      localStorage.setItem("rentaldetails", JSON.stringify(res.result));
    }); */
    this.dataSource = new MatTableDataSource(this.rentalDetails);
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
  }
  selectstage2(){
    //Filter rental details with only stage2 completed
    this.selecteditem = "STAGE-2";
  }
  selectstage3(){
    //Filter rental details with only stage3 completed
    this.selecteditem = "STAGE-3";
  }
  edit(id: any) {
    /* localStorage.setItem('selectedpartyheadid', id);
    const dialogRef = this.dialog.open(AddPartyHeadComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    }); */
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
      this.apiService.post(RENTAL_DETAIL_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
}
