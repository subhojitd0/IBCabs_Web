import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {ABP_API, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, BILL_TIMES_API, DAILY_OT_API, EXTRA_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_ABP, ROUTE_COAL_INDEX, ROUTE_DAILY_OT, ROUTE_OWNER, ROUTE_TIMES_BILL, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';
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
  year: string,
  partymaster: string,
  customfa: string,
  customfavalue: string,
  billCalType: string
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
  partymaster: string;
  customfa: string;
  customfavalue: string;
  billCalType: string;
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
  partymasterlist: Observable<string[]>;
  partynames: any;
  reportnames: any;
  allreports: any;
  loading: boolean;
  partymasterselect: FormControl;
  partymasternames: any;
  partymasternamestemp: any;

  //showButtons

  showParty: boolean = false;
  showPartyMaster: boolean = false;
  showBillSubject: boolean = false;
  showBillFrom: boolean = false;
  showBillTo: boolean = false;
  showReportTo: boolean = false;
  showNightStart: boolean = false;
  showNightEnd: boolean = false;
  showGstType: boolean = false;
  showParkingGST: boolean = false;
  showMonth: boolean = false;
  showYear: boolean = false;
  showCustomFA: boolean = false;
  showCustomFAVal: boolean = false;
  showTotalCal: boolean = false;
  showDayRate: boolean = false;
  showTotalCalABP: boolean = false;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.billDetails = new newbill();
   }
   ngOnInit() : void {
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.allreports = JSON.parse(localStorage.getItem('allreportto'));
    this.partynames = this.allparties.map(x=>x.name);
    this.reportnames = this.allreports.map(x=>x.report);
    this.partymasternamestemp = this.allparties.map(x=>x.master);
    this.partymasternames = [...new Set(this.partymasternamestemp)];
    this.partyselect = new FormControl();
    this.partymasterselect = new FormControl();
    this.reportselect = new FormControl();
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    this.partymasterlist = this.partymasterselect.valueChanges.pipe(startWith(''),map(value => this._filterPartyMaster(value)));
    this.reportlist = this.reportselect.valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
    
    this.billDetails.gsttype = "0";
    this.billDetails.parkinggst = "0";
    this.billDetails.format = "1";
    this.showFields();
   }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterPartyMaster(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partymasternames.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterReport(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.reportnames.filter(client => client.toLowerCase().includes(filterValue));
  }
  showFields(){
    if(this.billDetails.format === "1"){ //A
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = true;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = false;
      this.showNightStart = true;
      this.showNightEnd = true;
      this.showGstType = true;
      this.showParkingGST = true;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = true;
      this.showCustomFAVal = true;
      this.showTotalCal = true;
      this.showDayRate = false;
      this.showTotalCalABP = false;
    }
    else if(this.billDetails.format === "2"){ //B
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = true;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = false;
      this.showNightStart = false;
      this.showNightEnd = false;
      this.showGstType = true;
      this.showParkingGST = true;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = true;
      this.showCustomFAVal = true;
      this.showDayRate = false;
      this.showTotalCal = false;
      this.showTotalCalABP = false;
    }
    else if(this.billDetails.format === "3"){ //C
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = true;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = true;
      this.showNightStart = true;
      this.showNightEnd = true;
      this.showGstType = true;
      this.showParkingGST = true;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = true;
      this.showCustomFAVal = true;
      this.showTotalCal = false;
      this.showTotalCalABP = false;
      this.showDayRate = false;
    }
    else if(this.billDetails.format === "4"){ //D0
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = true;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = true;
      this.showNightStart = true;
      this.showNightEnd = true;
      this.showGstType = false;
      this.showParkingGST = false;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = false;
      this.showCustomFAVal = false;
      this.showTotalCalABP = false;
      this.showTotalCal = false;
      this.showDayRate = false;
    }
    else if(this.billDetails.format === "5"){ //D1
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = false;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = false;
      this.showNightStart = false;
      this.showNightEnd = false;
      this.showGstType = false;
      this.showParkingGST = false;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = false;
      this.showCustomFAVal = false;
      this.showDayRate = false;
      this.showTotalCal = false;
      this.showTotalCalABP = false;
    }
    else if(this.billDetails.format === "6"){ //D2
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = false;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = false;
      this.showNightStart = false;
      this.showNightEnd = false;
      this.showGstType = false;
      this.showParkingGST = false;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = false;
      this.showCustomFAVal = false;
      this.showTotalCal = false;
      this.showDayRate = false;
      this.showTotalCalABP = false;
    }
    else if(this.billDetails.format === "7"){ //C9 - NOT SAVED
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = false;
      this.showBillFrom = false;
      this.showBillTo = false;
      this.showReportTo = false;
      this.showNightStart = false;
      this.showNightEnd = false;
      this.showGstType = false;
      this.showParkingGST = false;
      this.showMonth = true;
      this.showYear = true;
      this.showCustomFA = false;
      this.showCustomFAVal = false;
      this.showTotalCal = false;
      this.showDayRate = false;
      this.showTotalCalABP = false;
    }
    else if(this.billDetails.format === "8"){ //E - ABP
      this.showParty = false;
      this.showPartyMaster = true;
      this.showBillSubject = true;
      this.showBillFrom = false;
      this.showBillTo = false;
      this.showReportTo = false;
      this.showNightStart = false;
      this.showNightEnd = false;
      this.showGstType = true;
      this.showParkingGST = true;
      this.showMonth = true;
      this.showYear = true;
      this.showCustomFA = true;
      this.showCustomFAVal = true;
      this.showTotalCal = false;
      this.showDayRate = false;
      this.showTotalCalABP = true;
    }
    else if(this.billDetails.format === "9"){ //F - Daily OT
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = true;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = false;
      this.showNightStart = true;
      this.showNightEnd = true;
      this.showGstType = true;
      this.showParkingGST = true;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = true;
      this.showCustomFAVal = true;
      this.showTotalCal = false;
      this.showTotalCalABP = false;
      this.showDayRate = false;
    }
    else if(this.billDetails.format === "10"){ //G - Times
      this.showParty = true;
      this.showPartyMaster = false;
      this.showBillSubject = true;
      this.showBillFrom = true;
      this.showBillTo = true;
      this.showReportTo = false;
      this.showNightStart = true;
      this.showNightEnd = true;
      this.showGstType = true;
      this.showParkingGST = true;
      this.showMonth = false;
      this.showYear = false;
      this.showCustomFA = true;
      this.showCustomFAVal = true;
      this.showTotalCal = false;
      this.showDayRate = true;
      this.showTotalCalABP = false;
    }
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
    }
    if(this.billDetails.format == "8"){
      billApi = ABP_API;
      redirectApi = ROUTE_ABP;
    }
    if(this.billDetails.format == "9"){
      billApi = DAILY_OT_API;
      redirectApi = ROUTE_DAILY_OT;
    }
    if(this.billDetails.format == "10"){
      billApi = BILL_TIMES_API;
      redirectApi = ROUTE_TIMES_BILL;
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
    localStorage.setItem("billfa", this.billDetails.customfa);
    localStorage.setItem("billfaval", this.billDetails.customfavalue);
    localStorage.setItem("billpartymaster", this.billDetails.partymaster);
    localStorage.setItem("billcaltype", this.billDetails.billCalType);
    this.apiService.post(billApi, this.billDetails).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigateByUrl('/' + redirectApi);
    });
  }

}
