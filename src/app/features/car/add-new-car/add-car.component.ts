import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {CAR_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface CarDetails {
  ownercode: string,
  mode: number,
  carno: string,
  cartype: string,
  tax: string,
  ins: string,
  puc: string,
  rc: string,
  cf: string,
  billmode: string,
  fixamount: string
}

export class car implements CarDetails{
  ownercode: string;
  mode: number;
  carno: string;
  cartype: string;
  tax: string;
  ins: string;
  puc: string;
  rc: string;
  cf: string;
  billmode: string;
  fixamount: string;
}
@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {
  carid : any;
  carDetails: car;
  ownerid: any;
  billmodeyes: boolean = false;
  billmodeno: boolean = false;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.carDetails = new car();
    debugger;
    this.carid = JSON.parse(localStorage.getItem('selectedcarid'));
    this.ownerid = JSON.parse(localStorage.getItem('selectedownerid'));
    if(this.carid.toString() != "0"){
      var json = 
      {
        "mode":4,
        "carcode": this.carid
      } 
      this.apiService.post(CAR_API, json).then((res: any)=>{ 
        if(res.hasOwnProperty('error')){
          this.toastr.error("You cannot edit the selected car", "Error");
          location.reload();
        }
        else{
          this.carDetails = res;
          this.carDetails.mode = 2;
          this.carDetails.ownercode = this.ownerid;
          this.carDetails.tax =  res.taxdate;
          this.carDetails.ins =  res.insdate;
          this.carDetails.puc =  res.pucdate;
          this.carDetails.cf =  res.cfdate;
          this.carDetails.rc =  res.rcdate;
          this.billmodeyes = res.billmode ? true: false;
          this.billmodeno = res.billmode ? false: true;
          //this.carDetails.tax = this.carDetails.tax.substr(8,2) + "-" + this.carDetails.tax.substr(4,2) + "-" + this.carDetails.tax.substr(0,4);
          debugger;
        }
      });
    }
    else{
      localStorage.setItem('selectedcarid', "0");
    }
   }
   ngOnInit() : void {
    
   }
   selectbillmodeyes(){
    this.billmodeyes = true;
    this.billmodeno = false;
   }
   selectbillmodeno(){
    this.billmodeyes = false;
    this.billmodeno = true;
   }
  savecar(){
    this.carDetails.ownercode = this.ownerid;
    if(this.carDetails.mode != 2)
    {
      this.carDetails.mode = 1;
    }
    this.carDetails.billmode = this.billmodeyes ? "1" : "0";
    debugger;
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(CAR_API, this.carDetails).then((res: any)=>{ 
      this.toastr.success("Your data was successfully saved",'Success');
      location.reload();
    });
  }

}
