import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_CNN_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_OWNER, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_CNN_CONTRACT } from 'src/shared/constants/constant';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  selector: 'app-advancedbill',
  templateUrl: './advancedbill.component.html',
  styleUrls: ['./advancedbill.component.css']
})
export class AdvancedBillComponent implements OnInit {
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
    this.billDetails.gsttype = "0";
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.partynames = this.allparties.map(x=>x.name);
    this.partyselect = new FormControl();
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
   }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  generateBill(){
    debugger;
    let redirectApi = "";
    //this.billDetails.party.includes("IBN") &&
    //this.billDetails.party.includes("CNN") && 
    
    if( (this.billDetails.party.includes("MONTHLY")) || 
    (this.billDetails.party.includes("M-"))){
      redirectApi = ROUTE_VIEW_BILL_CNN_CONTRACT;
    }
    debugger;
    this.toastr.info("Please wait while we are generating your bill",'Information');
    localStorage.setItem("billfrom", this.billDetails.from);
    localStorage.setItem("billto", this.billDetails.to);
    localStorage.setItem("billparty", this.billDetails.party);
    localStorage.setItem("billgst", this.billDetails.gsttype);
    this.router.navigateByUrl('/' + redirectApi);
  }

}
