import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, EXTRA_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_COAL_INDEX, ROUTE_OWNER, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';
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
  format: string,
  reportto: string,
  subject: string,
  mode: string,
  month: string,
  year: string
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
  reportto: string;
  subject: string;
  mode: string;
  month: string;
  year: string;
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
  reportselect: FormControl;
  partylist: Observable<string[]>;
  reportlist: Observable<string[]>;
  partynames: any;
  reportnames: any;
  allreports: any;
  loading: boolean;
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
    this.allreports = JSON.parse(localStorage.getItem('allreportto'));
    this.partynames = this.allparties.map(x=>x.name);
    this.reportnames = this.allreports.map(x=>x.report);
    this.partyselect = new FormControl();
    this.reportselect = new FormControl();
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    this.reportlist = this.reportselect.valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
    
    this.billDetails.gsttype = "0";
    this.billDetails.parkinggst = "1";
    this.billDetails.format = "1";
   }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterReport(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.reportnames.filter(client => client.toLowerCase().includes(filterValue));
  }
  somethingChanged(){
    if(this.billDetails.format === '3')
    {
      if(!this.billDetails.party){
        this.toastr.info("Please select a party for report to filter");
      }
      if(!this.billDetails.from){
        this.toastr.info("Please select a from date for report to filter");
      }
      if(!this.billDetails.to){
        this.toastr.info("Please select a to date for report to filter");
      }
      if(this.billDetails.party && this.billDetails.from && this.billDetails.to){
        debugger;
        var json = 
        {
          "mode":1,
          "party": this.billDetails.party,
          "start": this.billDetails.from,
          "end": this.billDetails.to
        } 
        this.loading = true;
        this.apiService.post(EXTRA_API, json).then((res: any)=>{ 
          debugger;
          this.loading = false;
          this.reportnames = res.result.map(x=>x.user);
          this.reportlist = this.reportselect.valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
        });
      }
    }
  }
  partychange(){
    if(this.billDetails.format == "4")
    {
      var json = 
      {
        "mode":3,
        "partyheadcode": this.billDetails.party
      } 
      this.apiService.post(ROUTE_VIEW_BILL_RELIANCE_MIS, json).then((res: any)=>{ 
        this.reportnames = [...new Set(res.map(item => item))];
        this.reportlist = this.reportselect.valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
      });
    }
    else {
    var json = 
      {
        "mode":4,
        "partyheadcode": this.billDetails.party
      } 
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        this.billDetails.subject = res.billsubject;
      });
    }
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
      //redirectApi = ROUTE_VIEW_BILL_RELIANCE_JMS;
    }
    if(this.billDetails.format == "3"){
      billApi = BILL_ONCALL_COAL_INDIA_API;
      redirectApi = ROUTE_VIEW_BILL_COAL_INDIA;
    }
    if(this.billDetails.format == "4"){
      billApi = BILL_RELIANCE_API;
      redirectApi = ROUTE_VIEW_BILL_RELIANCE_MIS;
      this.billDetails.mode = "0";
    }
    if(this.billDetails.format == "5"){
      billApi = BILL_RELIANCE_API;
      redirectApi = ROUTE_VIEW_BILL_RELIANCE_JMS;
      this.billDetails.mode = "1";
    }
    if(this.billDetails.format == "6"){
      billApi = BILL_RELIANCE_API;
      redirectApi = ROUTE_VIEW_BILL_RELIANCE_SUMMARY;
      this.billDetails.mode = "2";
    }
    if(this.billDetails.format == "7"){
      billApi = EXTRA_API;
      redirectApi = ROUTE_COAL_INDEX;
      this.billDetails.mode = "2";
      this.billDetails.party = "Coal India";
    }
    debugger;
    this.toastr.info("Please wait while we are generating your bill",'Information');
    localStorage.setItem("billfrom", this.billDetails.from);
    localStorage.setItem("billto", this.billDetails.to);
    localStorage.setItem("billparty", this.billDetails.party);
    localStorage.setItem("billsubject", this.billDetails.subject);
    localStorage.setItem("billgst", this.billDetails.gsttype);
    localStorage.setItem("billparking", this.billDetails.parkinggst);
    localStorage.setItem("billreportto", this.billDetails.reportto);
    localStorage.setItem("nightstart", this.billDetails.nightstart);
    localStorage.setItem("nightend", this.billDetails.nightend);
    localStorage.setItem("billmonth", this.billDetails.month);
    localStorage.setItem("billyear", this.billDetails.year);
    this.apiService.post(billApi, this.billDetails).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigateByUrl('/' + redirectApi);
    });
  }

}
