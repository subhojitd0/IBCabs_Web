import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_OWNER, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_ONCALL_EXTRA } from 'src/shared/constants/constant';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface inewbill {
  party: string,
  from: string,
  to: string,
  nightstart: string,
  nightend: string,
  gsttype: string,
  parkinggst: string,
  format: string
}

export class newbill implements inewbill{
  party: string;
  from: string;
  to: string;
  nightstart: string;
  nightend: string;
  gsttype: string;
  parkinggst: string;
  format: string;
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
  partyselect: FormControl;
  partylist: Observable<string[]>;
  partynames: any;
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
    this.partynames = this.allparties.map(x=>x.name);
    this.partyselect = new FormControl();
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    this.billDetails.gsttype = "0";
    this.billDetails.parkinggst = "1";
    this.billDetails.format = "1";
   }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  generateBill(){
    debugger;
    let billApi = "";
    let redirectApi = "";
    if(this.billDetails.format == "1"){
      billApi = BILL_CNN_API;
      redirectApi = ROUTE_VIEW_BILL_CNN;
    }
    if(this.billDetails.format == "2"){
      billApi = BILL_ONCALL_EXTRA_API;
      redirectApi = ROUTE_VIEW_BILL_ONCALL_EXTRA;
    }
    if(this.billDetails.format == "3"){
      billApi = BILL_ONCALL_COAL_INDIA_API;
      redirectApi = ROUTE_VIEW_BILL_COAL_INDIA;
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
