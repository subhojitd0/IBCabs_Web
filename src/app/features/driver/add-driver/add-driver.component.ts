import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {DRIVER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_DRIVER } from 'src/shared/constants/constant';

export interface DriverDetails {
    mode: number,
    drivercode: string,
    drivername: string,                               
    contact: string,                                  
    address: string,                           
    pan: string,
    license: string,                           
    expiry: string,
    salary: string,                           
    starttime: string,                          
    endtime: string,
    isActive: boolean,
    panUrl: string,
    photoUrl: string,
    licenseUrl: string,
    adhaarUrl: string
  }

export class driver implements DriverDetails{
  mode: number;
  drivername: string;  
  drivercode: string;                             
  contact: string;                                
  address: string;                           
  pan: string;
  license: string;                           
  expiry: string;
  salary: string;                           
  starttime: string;                          
  endtime: string;
  isActive: boolean;
  panUrl: string;
  photoUrl: string;
  licenseUrl: string;
  adhaarUrl: string;
}
@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css']
})
export class AddDriverComponent implements OnInit {
  driverid : any;
  isPack:boolean=false;
  isSlab:boolean=false;
  driverDetails: driver;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.driverDetails = new driver();
    debugger;
    this.driverid = JSON.parse(localStorage.getItem('selecteddriverid'));
    if(this.driverid.toString() != "0"){
      var json = 
      {
        "mode":4,
        "drivercode": this.driverid
      } 
      this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
        if(res.hasOwnProperty('error')){
          this.toastr.error("You cannot edit the selected driver", "Error");
          this.router.navigateByUrl('/' + ROUTE_DRIVER);
        }
        else{
          this.driverDetails = res;
          this.driverDetails.mode = 2;
          this.driverDetails.starttime = this.driverDetails.starttime.substr(0,5);
          this.driverDetails.endtime = this.driverDetails.endtime.substr(0,5);
          this.driverDetails.drivercode = this.driverid;
          /* this.partyheaddetails.partyheadid = this.partyheadid;
          if(this.partyheaddetails.ratetype == 0){
            this.isPack = true;
            this.isSlab = false;
          } 
          else{
            this.isSlab = true;
            this.isPack = false;
          }  */
        }
      });
    }
    else{
      localStorage.setItem('selecteddriverid', "0");
    }
   }
   ngOnInit() : void {
    
   }
  savedriver(){
    debugger;
    this.driverDetails.isActive = true;
    if(this.driverDetails.mode != 2)
    {
      this.driverDetails.mode = 1;
    }
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(DRIVER_API, this.driverDetails).then((res: any)=>{ 
      this.toastr.success("Youe data was successfully saved",'Success');
      //this.router.navigateByUrl('/' + ROUTE_DRIVER);
      location.reload();
    });
  }
}
