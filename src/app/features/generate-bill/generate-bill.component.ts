import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {ABP_API, BILL_API, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, BILL_TIMES_API, DAILY_OT_API, OWNER_API, PARTY_HEAD_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_ABP, ROUTE_CAR, ROUTE_DAILY_OT, ROUTE_OWNER, ROUTE_TIMES_BILL, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';
import { NewBillComponent } from './NewBill/newbill.component';
import { AdvancedBillComponent } from './AdvancedBill/advancedbill.component';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { CoalIndiaModalComponent } from '../bills/coalindia/coalindia.modal';

export interface BillRegister {
  billid: string;
  billnumber: string;
  billfrom: string;
  billto: number;
  billdate: string;
  party: string;
  path: string;
  option: string;
  billtype: string;
  reportto: string;
  nightstart: string;
  nightend: string;
  gsttype: string;
  parkinggst: string;
  subject: string;
}

@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css']
})
export class GenarateBillComponent implements OnInit {
billRegDetails: any[] = [];
  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['billid', 'billnumber', 'party', 'billfrom', 'billto', 'billdate', 'option'];
  dataSource: MatTableDataSource<BillRegister>;
  billrole: string;
  approve: string;
  delete: string;
  loading: boolean;
  month: any;
  year: any;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    localStorage.setItem("removeheader", "0");
    var yr = localStorage.getItem('billregyear');
    var month = localStorage.getItem('billregmonth');
    if(yr && month){
      this.month = month;
      this.year = yr;
     }
     else{
      this.month = "0" + (new Date().getMonth() + 1);
      this.year = new Date().getFullYear();
      localStorage.setItem("billregmonth", this.month);
      localStorage.setItem("billregyear", this.year);
     }
    this.billrole = localStorage.getItem("createbill");
    this.approve = localStorage.getItem("approve");
    this.delete = localStorage.getItem("delete");
     debugger;
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(BILL_API, json).then((res: any)=>{ 
      debugger;
      const billReg: BillRegister[] = res.result;
      this.billRegDetails = res.result;
      this.dataSource = new MatTableDataSource(billReg);
      this.setData();
    });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  onChangeMonth(val){
    this.loading = true;
    this.month = val;
    this.setData();
   }
   onChangeYear(val){
    this.loading = true;
    this.year = val;
    this.setData();
   }
   setData(){
    localStorage.setItem("billregmonth", this.month);
    localStorage.setItem("billregyear", this.year);
    const billReg: BillRegister[] = [];
    this.billRegDetails.forEach(element =>{
      let year = element.billto.substr(0,4);
      let month = element.billto.substr(5,2);
      if(this.month === month && this.year.toString() === year)
        billReg.push(element);
    });
    this.dataSource = new MatTableDataSource(billReg);
    this.loading = false;
   }
  downloadBill(bill: any){
    debugger;
    if(bill.billtype === "D0"){
      this.openBill(bill);
    }
    else if(bill.billtype === "D1"){
      this.openJMSBill(bill);
    }
    else if(bill.billtype === "D2"){
      this.openRelSummaryBill(bill);
    }
    else if(bill.billtype === "C"){
      this.openCoalBill(bill);
    }
    else if(bill.billtype === "A"){
      this.openIBNBill(bill);
    }
    else if(bill.billtype === "F"){
      this.openDailyOTBill(bill);
    }
    else if(bill.billtype === "E"){
      this.openCumulativeBill(bill);
    }
    else if(bill.billtype === "b"){
      this.openOnCallBill(bill);
    }
    else if(bill.billtype === "G"){
      this.openTimesBill(bill);
    }
    else{
      localStorage.setItem("billmodalbody", bill.path);
      const dialogRef = this.dialog.open(CoalIndiaModalComponent);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog closed`);
      });
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
    }
    
  }
  openTimesBill(element: any){
    localStorage.setItem("removeheader", "0");
    debugger;
    let json = {
      party: element.party,
      subject: element.subject,
      from: element.billfrom,
      to: element.billto,
      format: "10",
      mode: "1",
      gsttype: element.gsttype,
      parkinggst: element.parkinggst,
      nightstart: element.nightstart,
      nightend: element.nightend,
      billCalType: element.billCalType
    }
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billgst", element.gsttype);
    localStorage.setItem("billparking", element.parkinggst);
    localStorage.setItem("billsubject", element.subject);
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    localStorage.setItem("nightstart", element.nightstart);
    localStorage.setItem("nightend", element.nightend);
    localStorage.setItem("billcaltype", element.billCalType);
    this.apiService.post(BILL_TIMES_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_TIMES_BILL, '_blank'); });
    });
  }
  openOnCallBill(element: any){
    debugger;
    let json = {
      party: element.party,
      subject: element.subject,
      from: element.billfrom,
      to: element.billto,
      format: "2",
      mode: "1",
      gsttype: element.gsttype,
      parkinggst: element.parkinggst
    }
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billgst", element.gsttype);
    localStorage.setItem("billparking", element.parkinggst);
    localStorage.setItem("billsubject", element.subject);
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    this.apiService.post(BILL_ONCALL_EXTRA_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      if(res.body.length > 60){
        localStorage.setItem("removeheader", "1");
      }
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_ONCALL_EXTRA, '_blank'); });
    });
  }
  openDailyOTBill(element: any){
    localStorage.setItem("removeheader", "0");
    debugger;
    let json = {
      party: element.party,
      from: element.billfrom,
      to: element.billto,
      format: "9",
      nightstart: element.nightstart,
      nightend: element.nightend,
      gsttype: element.gsttype,
      parkinggst: element.parkinggst,
    }
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billreportto", element.reportto);
    localStorage.setItem("billgst", element.gsttype);
    localStorage.setItem("billparking", element.parkinggst);
    localStorage.setItem("nightstart", element.nightstart);
    localStorage.setItem("nightend", element.nightend);
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    this.apiService.post(DAILY_OT_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_DAILY_OT, '_blank'); });
    });
  }
  openCumulativeBill(element: any){
    localStorage.setItem("removeheader", "0");
    let month = element.billto.substr(5,2);
    if(month.startsWith("0")){
      month = month.replace("0","");
    }
    let json = {
      partymaster: element.party,
      month: month,
      format: "1",
      gsttype: element.gsttype,
      parkinggst: element.parkinggst,
      customfa: element.fa,
      customfavalue: element.favalue
    }
    localStorage.setItem("billmonth", month);
    localStorage.setItem("billfa", element.fa);
    localStorage.setItem("billfaval", element.favalue);
    localStorage.setItem("billpartymaster", element.party);
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billreportto", element.reportto);
    localStorage.setItem("billgst", element.gsttype);
    localStorage.setItem("billparking", element.parkinggst);
    localStorage.setItem("nightstart", element.nightstart);
    localStorage.setItem("nightend", element.nightend);
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    this.apiService.post(ABP_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_ABP, '_blank'); });
    });
  }
  openIBNBill(element: any){
    localStorage.setItem("removeheader", "0");
    debugger;
    let json = {
      party: element.party,
      from: element.billfrom,
      to: element.billto,
      format: "1",
      nightstart: element.nightstart,
      nightend: element.nightend,
      gsttype: element.gsttype,
      parkinggst: element.parkinggst,
      billCalType: element.billCalType
    }
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billreportto", element.reportto);
    localStorage.setItem("billgst", element.gsttype);
    localStorage.setItem("billparking", element.parkinggst);
    localStorage.setItem("nightstart", element.nightstart);
    localStorage.setItem("nightend", element.nightend);
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    localStorage.setItem("billcaltype", element.billCalType);
    this.apiService.post(BILL_CNN_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_CNN, '_blank'); });
    });
  }
  openRelSummaryBill(element: any){
    debugger;
    localStorage.setItem("removeheader", "0");
    let json = {
      from: element.billfrom,
      to: element.billto,
      format: "6",
      mode: "2",
      party:element.party
    }
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    this.apiService.post(BILL_RELIANCE_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_RELIANCE_SUMMARY, '_blank'); });
    });
  }
  openCoalBill(element: any){
    localStorage.setItem("removeheader", "0");
    debugger;
    let json = {
      party: element.party,
      from: element.billfrom,
      to: element.billto,
      format: "3",
      gsttype: element.gsttype,
      parkinggst: element.parkinggst,
      reportto: element.reportto,
    }
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billreportto", element.reportto);
    localStorage.setItem("billgst", element.gsttype);
    localStorage.setItem("billparking", element.parkinggst);
    localStorage.setItem("nightstart", element.nightstart);
    localStorage.setItem("nightend", element.nightend);
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    this.apiService.post(BILL_ONCALL_COAL_INDIA_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_COAL_INDIA, '_blank'); });
    });
  }
  openBill(element: any){
    localStorage.setItem("removeheader", "0");
    debugger;
    let json = {
      party: element.party,
      from: element.billfrom,
      to: element.billto,
      nightstart: element.nightstart,
      nightend: element.nightend,
      format: "4",
      reportto: element.reportto,
      mode: "0"
    }
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billreportto", element.reportto);
    localStorage.setItem("nightstart", element.nightstart);
    localStorage.setItem("nightend", element.nightend);
    this.apiService.post(BILL_RELIANCE_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_RELIANCE_MIS, '_blank'); });
    });
  }
  openJMSBill(element: any){
    localStorage.setItem("removeheader", "0");
    debugger;
    let json = {
      party: element.party,
      from: element.billfrom,
      to: element.billto,
      format: "5",
      mode: "1"
    }
    localStorage.setItem("billnumber", element.billnumber);
    localStorage.setItem("billdate", element.billdate);
    localStorage.setItem("billfrom", element.billfrom);
    localStorage.setItem("billto", element.billto);
    localStorage.setItem("billparty", element.party);
    localStorage.setItem("billreportto", element.reportto);
    localStorage.setItem("nightstart", element.nightstart);
    localStorage.setItem("nightend", element.nightend);
    this.apiService.post(BILL_RELIANCE_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_RELIANCE_JMS, '_blank'); });
    });
  }
  deleteBill(billid: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "billid": billid
      }
      this.apiService.post(BILL_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
  openDialog(id: any) {
    const dialogRef = this.dialog.open(NewBillComponent);

    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  openAdvancedDialog(id: any){
    const dialogRef = this.dialog.open(AdvancedBillComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  /* deleteOwner(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "ownerccode": id
      }
      this.apiService.post(OWNER_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  } */
}
