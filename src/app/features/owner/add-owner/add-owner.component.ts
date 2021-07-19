import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_OWNER, ROUTE_VENDOR_RATE } from 'src/shared/constants/constant';

export interface OwnerDetails {
  ownername: string,
  contact: string,
  address: string,
  pan: string,
  gst: string,
  account: string,
  ifsc: string,
  mode: number
}

export class owner implements OwnerDetails{
  mode: number;
  ownername: string;
  contact: string;
  address: string;
  pan: string;
  gst: string;
  account: string;
  ifsc: string;
}
@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit {
  ownerid : any;
  ownerDetails: owner;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.ownerDetails = new owner();
    debugger;
    this.ownerid = JSON.parse(localStorage.getItem('selectedownerid'));
    if(this.ownerid.toString() != "0"){
      var json = 
      {
        "mode":4,
        "ownercode": this.ownerid
      } 
      this.apiService.post(OWNER_API, json).then((res: any)=>{ 
        if(res.hasOwnProperty('error')){
          this.toastr.error("You cannot edit the selected owner", "Error");
          location.reload();
        }
        else{
          debugger;
          this.ownerDetails = res;
          this.ownerDetails.mode = 2;
        }
      });
    }
    else{
      localStorage.setItem('selectedownerid', "0");
    }
   }
   ngOnInit() : void {
    
   }
   openvendorrates(){
    debugger;
    localStorage.setItem('selectedvendorname', this.ownerDetails.ownername);
    this.router.navigateByUrl('/' + ROUTE_VENDOR_RATE);
   }
  saveowner(){
    if(this.ownerDetails.pan){

   
    if(this.ownerDetails.mode != 2)
    {
      this.ownerDetails.mode = 1;
    }
    debugger;
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(OWNER_API, this.ownerDetails).then((res: any)=>{ 
      this.toastr.success("Your data was successfully saved",'Success');
      location.reload();
    });
  }
  else{
    this.toastr.error("Please enter a pan number");
  }
  }

}
