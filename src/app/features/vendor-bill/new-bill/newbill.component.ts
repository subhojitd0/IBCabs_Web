import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {ABP_API, BILL_API_H, BILL_API_I, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, BILL_TIMES_API, BILL_VENDOR_PAY, DAILY_OT_API, EXTRA_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_ABP, ROUTE_COAL_INDEX, ROUTE_DAILY_OT, ROUTE_OWNER, ROUTE_TIMES_BILL, ROUTE_VENDOR_BILL, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_H, ROUTE_VIEW_BILL_I, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface inewbill {
  ownername: string,
  startdate: string,
  enddate: string,
  ownercode: string
}

export class newbill implements inewbill{
  ownername: string;
  startdate: string;
  enddate: string;
  ownercode: string;
  mode: string;
}
@Component({
  selector: 'app-newvendorbill',
  templateUrl: './newbill.component.html',
  styleUrls: ['./newbill.component.css']
})
export class NewVendorBillComponent implements OnInit {
  newbillDet : any;
  allparties: any;
  billDetails: newbill;
  partyselect: FormControl;
  partylist: Observable<string[]>;
  partynames: any;
  loading: boolean;
  vendorregdata: any;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.billDetails = new newbill();
   }
   ngOnInit() : void {
    this.vendorregdata = JSON.parse(localStorage.getItem("vendorregdata"));
    this.allparties = JSON.parse(localStorage.getItem('allowners'));
    this.partynames = this.allparties.map(x=>x.ownername);
    this.partyselect = new FormControl();
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
   }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }

  validateDate(){
    let returnVal = 0;
    let specificPartyReg = this.vendorregdata.filter(x=>x.ownername === this.billDetails.ownername);
    //checking if date exists
    let newStartDate = new Date(this.billDetails.startdate);
    let newEndDate = new Date(this.billDetails.enddate);
    if(specificPartyReg.length === 0 ) { returnVal = 1; }
    else {
      for( var element in specificPartyReg){
        let regStartDate = new Date(specificPartyReg[element].startdate);
        let regEndDate = new Date(specificPartyReg[element].enddate);
        if(newStartDate >= regStartDate && newEndDate <= regEndDate){
          returnVal = 0;
          break;
        }
        else{
          if(regStartDate <= newStartDate && newStartDate <= regEndDate){
            returnVal = 0;
            break;
          }
          else if(regStartDate <= newEndDate && newEndDate <= regEndDate){
            returnVal = 0;
            break;
          }
          else{
            returnVal = 1;
          }
        }
      }
    }
    if(returnVal === 1){
      return true;
    }
    else{
      return false;
    }
  }
  generateBill(){
    if(this.validateDate()){
      this.billDetails.ownercode = this.allparties.filter(x=>x.ownername === this.billDetails.ownername)[0].ownercode;
      let billApi = BILL_VENDOR_PAY;
      let redirectApi = ROUTE_VENDOR_BILL;
      debugger;
      this.toastr.info("Please wait while we are generating your bill",'Information');
      localStorage.setItem("vendorname", this.billDetails.ownername);
      localStorage.setItem("vendorcode", this.billDetails.ownercode);
      localStorage.setItem("vendorfrom", this.billDetails.startdate);
      localStorage.setItem("vendorto", this.billDetails.enddate);
      this.billDetails.mode = "1";
      this.apiService.post(billApi, this.billDetails).then((res: any)=>{ 
        debugger;
        localStorage.setItem("vendorbilldata", JSON.stringify(res));
        this.toastr.success("Your bill was successfully created",'Success');
        this.router.navigateByUrl('/' + redirectApi);
      });
    }
    else{
      this.toastr.error("There is already a vendor bill within this date range");
    }
  }

}
