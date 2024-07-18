import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {ABP_API, BILL_API_H, BILL_API_I, BILL_API_J, BILL_API_K, BILL_API_L, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_ONCALL_PACKAGE_API, BILL_ONCALL_SLAB_API, BILL_RELIANCE_API, BILL_TIMES_API, DAILY_OT_API, EXTRA_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_ABP, ROUTE_COAL_INDEX, ROUTE_DAILY_OT, ROUTE_OWNER, ROUTE_TIMES_BILL, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_H, ROUTE_VIEW_BILL_I, ROUTE_VIEW_BILL_J, ROUTE_VIEW_BILL_K, ROUTE_VIEW_BILL_L, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_PACKAGE_EXTRA, ROUTE_VIEW_BILL_SLAB_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';
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
  billCalType: string,
  fuelOpt: string
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
  fuelOpt: string;
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
  showbookedby: boolean = false;
  fuelOption: boolean = false;
  allbookedby: any;
  bookedbyselect: FormControl;
  bookedbylist: Observable<string[]>;
  allbookedbynames: any;
  billregdata: any[] = [];
  specificPartyReg: any[] = [];
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.billDetails = new newbill();
   }
   ngOnInit() : void {
    this.allbookedby = JSON.parse(localStorage.getItem("allbookedby"));
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.allreports = JSON.parse(localStorage.getItem('allreportto'));
    this.partynames = this.allparties.map(x=>x.name);
    this.reportnames = this.allreports.map(x=>x.report);
    this.partymasternamestemp = this.allparties.map(x=>x.master);
    this.partymasternames = [...new Set(this.partymasternamestemp)];
    this.allbookedbynames = this.allbookedby.map(x=>x.bookedby);
    this.partyselect = new FormControl();
    this.bookedbyselect = new FormControl();
    this.partymasterselect = new FormControl();
    this.reportselect = new FormControl();
    this.bookedbylist = this.bookedbyselect.valueChanges.pipe(startWith(''),map(value => this._filterBooked(value)));
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    this.partymasterlist = this.partymasterselect.valueChanges.pipe(startWith(''),map(value => this._filterPartyMaster(value)));
    this.reportlist = this.reportselect.valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
    
    this.billDetails.gsttype = "0";
    this.billDetails.parkinggst = "0";
    this.billDetails.format = "1";
    this.showFields();
   }
   public _filterBooked(value: string): string[]{
    const filterValue = value.toLowerCase();
    return this.allbookedbynames.filter(client => client.toLowerCase().includes(filterValue));
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
    if(this.billDetails.format === "1"){ //A - Party
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "2" || this.billDetails.format === "16" || this.billDetails.format === "17"){ //B - Party
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
      this.showDayRate = false;
      this.showTotalCal = false;
      this.showTotalCalABP = false;
      this.showbookedby = false;
      this.fuelOption = true;
    }
    else if(this.billDetails.format === "3"){ //C - Party & Report
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "4"){ //D0 - Party & Report
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "5"){ //D1 - Party
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "6"){ //D2 - Party
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
      this.showbookedby = false;
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "8" || this.billDetails.format === "13" || this.billDetails.format === "14" || this.billDetails.format === "15"){ //E - ABP - Party Master
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "9"){ //F - Daily OT - Party
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "10"){ //G - Times - Party
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
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "11"){ //A - Party
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
      this.showDayRate = false;
      this.showbookedby = false;
    }
    else if(this.billDetails.format === "12"){ //B  - Party
      this.showParty = false;
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
      this.showbookedby = true;
    }
  }
  somethingChanged(){
    if(this.showReportTo){
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
    if(this.validateDate()){
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
        localStorage.setItem("removeheader", "1");
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
      if(this.billDetails.format == "11"){
        billApi = BILL_API_H;
        redirectApi = ROUTE_VIEW_BILL_H;
      }
      if(this.billDetails.format == "12"){
        billApi = BILL_API_I;
        redirectApi = ROUTE_VIEW_BILL_I;
        localStorage.setItem("removeheader", "1");
      }
      if(this.billDetails.format == "13"){
        billApi = BILL_API_J;
        redirectApi = ROUTE_VIEW_BILL_J;
      }
      if(this.billDetails.format == "14"){
        billApi = BILL_API_K;
        redirectApi = ROUTE_VIEW_BILL_K;
      }
      if(this.billDetails.format == "15"){
        billApi = BILL_API_L;
        redirectApi = ROUTE_VIEW_BILL_L;
      }
      if(this.billDetails.format == "16"){
        billApi = BILL_ONCALL_PACKAGE_API;
        redirectApi = ROUTE_VIEW_BILL_PACKAGE_EXTRA;
        //redirectApi = ROUTE_VIEW_BILL_RELIANCE_JMS;
      }
      if(this.billDetails.format == "17"){
        billApi = BILL_ONCALL_SLAB_API;
        redirectApi = ROUTE_VIEW_BILL_SLAB_EXTRA;
        //redirectApi = ROUTE_VIEW_BILL_RELIANCE_JMS;
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
        this.router.navigate([]).then(result => {  window.open('/' + redirectApi, '_blank'); });
      });
    }
    else{
      this.toastr.error("You already have a bill within this period",'Error');
    }
  }
  validateDate(){
    /* return true; */
    this.billregdata = JSON.parse(localStorage.getItem("billregdata"));
    let returnVal = 0;
    this.specificPartyReg = this.getfilterdata();
    //checking if date exists
    let newStartDate = new Date(this.billDetails.from);
    let newEndDate = new Date(this.billDetails.to);
    if(this.specificPartyReg.length === 0 ) { returnVal = 1; }
    else {
      for( var element in this.specificPartyReg){
        let regStartDate = new Date(this.specificPartyReg[element].billfrom);
        let regEndDate = new Date(this.specificPartyReg[element].billto);
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
          else if(regStartDate >= newStartDate && newEndDate >= regEndDate){
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
  getfilterdata(){
    let returnarr = []; //party //reportto
    if(this.billDetails.format == "1"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    }
    if(this.billDetails.format == "2"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    }
    if(this.billDetails.format == "3"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party && x.reportto === this.billDetails.reportto);
    }
    if(this.billDetails.format == "4"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party && x.reportto === this.billDetails.reportto);
    }
    if(this.billDetails.format == "5"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    }
    if(this.billDetails.format == "6"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    }
    /* if(this.billDetails.format == "7"){
      returnarr = this.billregdata.filter(x=>x.ownername === this.billDetails.ownername);
    } */
    if(this.billDetails.format == "8" || this.billDetails.format == "13" || this.billDetails.format == "14" || this.billDetails.format == "15"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.partymaster);
    }
    if(this.billDetails.format == "9"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    }
    if(this.billDetails.format == "10"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    }
    if(this.billDetails.format == "11"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    }
    if(this.billDetails.format == "12"){
      returnarr = this.billregdata.filter(x=>x.party === this.billDetails.party);
    } 
    
    return returnarr;
  }
}
