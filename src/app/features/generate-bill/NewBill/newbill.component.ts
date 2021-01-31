import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_CNN_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_OWNER, ROUTE_VIEW_BILL_CNN } from 'src/shared/constants/constant';

export interface inewbill {
  party: string,
  from: string,
  to: string,
  nightstart: string,
  nightend: string,
  gsttype: string,
  parkinggst: string
}

export class newbill implements inewbill{
  party: string;
  from: string;
  to: string;
  nightstart: string;
  nightend: string;
  gsttype: string;
  parkinggst: string;
}
@Component({
  selector: 'app-newbill',
  templateUrl: './newbill.component.html',
  styleUrls: ['./newbill.component.css']
})
export class NewBillComponent implements OnInit {
  newbillDet : any;
  allparties: any;
  billDetails: newbill;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.billDetails = new newbill();
    debugger;
    //this.ownerid = JSON.parse(localStorage.getItem('selectedownerid'));
    /* if(this.ownerid.toString() != "0"){
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
          this.ownerDetails = res;
          this.ownerDetails.mode = 2;
        }
      });
    }
    else{
      localStorage.setItem('selectedownerid', "0");
    } */
   }
   ngOnInit() : void {
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
   }
  generateBill(){
    debugger;
    let billApi = "";
    let redirectApi = "";
    if((this.billDetails.party.includes("IBN") && this.billDetails.party.includes("(M")) || 
    (this.billDetails.party.includes("IBN") && this.billDetails.party.includes("(M"))){
      billApi = BILL_CNN_API;
      redirectApi = ROUTE_VIEW_BILL_CNN;
    }
    debugger;
    this.toastr.info("Please wait while we are generating your bill",'Information');
    localStorage.setItem("billfrom", this.billDetails.from);
    localStorage.setItem("billto", this.billDetails.to);
    localStorage.setItem("billparty", this.billDetails.party);
    this.apiService.post(billApi, this.billDetails).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigateByUrl('/' + redirectApi);
    });
  }

}
