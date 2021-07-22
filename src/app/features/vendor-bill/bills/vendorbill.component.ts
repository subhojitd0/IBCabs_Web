import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {ABP_API, BILL_API, BILL_API_H, BILL_API_I, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, BILL_TIMES_API, BILL_VENDOR_PAY, BILL_VENDOR_PAY_UPDATE, DAILY_OT_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_ABP, ROUTE_CAR, ROUTE_DAILY_OT, ROUTE_GENERATE_BILL, ROUTE_GENERATE_VENDOR_BILL, ROUTE_OWNER, ROUTE_TIMES_BILL, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_H, ROUTE_VIEW_BILL_I, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';

export interface iBillDet {
  sl: string;
  dutydate: string;
  carno: string;
  cartype: string;
  party: string;
  reportto: string;
  totalhr: string;
  totalkm: string;
  parking: number;
  billnumber: string;
  billid: string;
  amount: string;
  dutycode: string;
  billtype: string;
}
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

export class BillDet implements iBillDet {
  sl: string;
  dutydate: string;
  carno: string;
  cartype: string;
  party: string;
  reportto: string;
  totalhr: string;
  totalkm: string;
  parking: number;
  billnumber: string;
  billid: string;
  amount: string;
  dutycode: string;
  billtype: string;
}
export interface iCarDet{
  carno: any;
  data: any[];
}
export class CarDet implements iCarDet{
  carno: any;
  data: any[];
}

export interface iSaveBill {
  ownerid: any;
  ownername: any;
  startdate: any;
  enddate: any;
  amount: any;
  details: any;
  mode: any;
}
export class SaveBill implements iSaveBill {
  ownerid: any;
  ownername: any;
  startdate: any;
  enddate: any;
  amount: any;
  details: any;
  mode: any;
}
@Component({
  selector: 'app-vendorbill',
  templateUrl: './vendorbill.component.html',
  styleUrls: ['./vendorbill.component.css']
})
export class VendorBillComponent implements OnInit {
  fromdate: any;
  todate: any;
  billno: any;
  billdate: any;
  billdetails: any;
  amountInWord: any;
  roundedgross: any;
  billfrom: any;
  taxable: any;
  cgst: any;
  sgst: any;
  totalgst: any;
  gstinwords: any;
  totalamount: any;
  totalmountinwords: any;
  billto: any;
  gstamountinwords: any;
  totalno: any;
  marginTop: any;
  fontSize: any;
  monthNames = ["","January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  isConfirmVisible: any = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sl', 'dutydate', 'reportto', 'carno', 'cartype', 'hour', 'km', 'rate', 'amount', 'parking', 'outstation'];
  dataSource: MatTableDataSource<BillDet>;
  roundedtotal: number;
  roundedamount: number;
  roundedtax: number;
  party: string;
  data: any;
  year: string;
  month: string;
  carlist: any[];
  alldata: any[];
  comments: any;
  total: any;
  vendorname: string;
  vendorcode: string;
  startdate: string;
  enddate: string;
  billRegDetails: any;
  userrole: string;
  loading: boolean;
  showsubmit: boolean = false;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.loading = true;
    this.userrole = localStorage.getItem("loggedinuser");
    this.billdetails = JSON.parse(localStorage.getItem("vendorbilldata"));
    this.vendorname = localStorage.getItem("vendorname");
    this.vendorcode =   localStorage.getItem("vendorcode");
    this.startdate =   localStorage.getItem("vendorfrom");
    this.enddate =   localStorage.getItem("vendorto");
    let amount = localStorage.getItem("vendoramount");
    let comment = localStorage.getItem("vendorcomment");
    if(amount){
      this.isConfirmVisible = false;
      this.total = amount;
      this.showsubmit = true;
    }
    if(comment){
      this.isConfirmVisible = false;
      this.comments = comment;
      this.showsubmit = true;
    }
    /* this.party = localStorage.getItem("billparty");
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.month = this.monthNames[localStorage.getItem("billmonth")];
    this.year = localStorage.getItem("billyear"); */
    debugger;
    const carlist : CarDet[] = [];
    if(this.billdetails){
      let uniqueCars = [...new Set(this.billdetails.result.map(x=>x.carno))];
      uniqueCars.forEach((car: any)=>{
        let carD = new CarDet();
        carD.carno = car;
        carD.data = this.billdetails.result.filter(x=>x.carno === car);
        let slno = 0;
        let tothr = 0;
        let totkm = 0;
        let totparking = 0;
        let totamt = 0;
        carD.data.forEach((dat: any)=>{
          dat.sl = slno + 1;
          slno = slno + 1;
          tothr = parseFloat(dat.totalhr) + tothr;
          totkm = parseFloat(dat.totalkm) + totkm;
          totparking = parseFloat(dat.parking) + totparking;
          totamt = parseFloat(dat.amount) + totamt;
        })
        let newData={
          sl: "Total",
          totalhr: tothr,
          totalkm: totkm,
          parking: totparking,
          amount: totamt
        }
        carD.data.push(newData);
        carlist.push(carD);
      });
      this.alldata = carlist;
    }
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(BILL_API, json).then((res: any)=>{ 
      debugger;
      const billReg: BillRegister[] = res.result;
      this.billRegDetails = res.result;
    });
    localStorage.removeItem("vendoramount");
    localStorage.removeItem("vendorcomment");
    this.loading = false;
   }
   changeamount(row: any){
     debugger;
     let totamt = 0;
     this.alldata.filter(x=>x.carno === row.carno)[0].data.filter(x=>x.sl !== "Total").forEach(element => {
      totamt = totamt + parseFloat(element.amount);
     });
     this.alldata.filter(x=>x.carno === row.carno)[0].data.filter(x=>x.sl === "Total")[0].amount = totamt;
   }
   save(){
     this.toastr.info("Please wait while we are saving the data");
     this.loading = true;
     let updateData: any[] = [];
     this.alldata.forEach((row: any)=>{
       row.data.forEach(element => {
         updateData.push(element);
       });
     });
     debugger;
    this.apiService.post(BILL_VENDOR_PAY_UPDATE, updateData).then((res: any)=>{ 
        
        if(res.result.length > 0 && res.result[0].status === "Success"){
          debugger;
          this.loading = false;
          this.toastr.success("Data has been saved successfully");
          this.showsubmit  = true;
        }
        else{
          this.toastr.error("There was an error saving your data");
          this.loading = false;
        }
        /* if(res.result.lengt === "success"){
        //this.exportAsPDF("container");
        this.isConfirmVisible = false;
        this.toastr.success("Your bill was successfully created",'Success');
        this.router.navigateByUrl('/' + ROUTE_GENERATE_VENDOR_BILL);
      } */
    });
   }
   submit(){
    if(!(this.comments && this.total)){
      this.toastr.error("Please enter a proper comment and amount to proceed");
     }
     else{
      let billSave : SaveBill = new SaveBill();
      billSave.ownername = this.vendorname;
      billSave.ownerid = this.vendorcode;
      billSave.startdate = this.startdate;
      billSave.enddate = this.enddate;
      billSave.details = this.comments;
      billSave.amount = this.total;
      billSave.mode = "2";
      this.apiService.post(BILL_VENDOR_PAY, billSave).then((res: any)=>{ 
          debugger;
          if(res.status === "success"){
          //this.exportAsPDF("container");
          this.isConfirmVisible = false;
          this.toastr.success("Your bill was successfully created",'Success');
          this.router.navigateByUrl('/' + ROUTE_GENERATE_VENDOR_BILL);
        }
      });
     }
   }
   showbill(childrow: any){
     this.toastr.info("Please wait while we are opening the bill");
    let row = this.billRegDetails.filter(x=>x.billnumber === childrow.billnumber)[0];
    let billtype = childrow.billtype;
    if(billtype === "D0"){
      this.openBill(row);
    }
    else if(billtype === "D1"){
      this.openJMSBill(row);
    }
    else if(billtype === "D2"){
      this.openRelSummaryBill(row);
    }
    else if(billtype === "C"){
      this.openCoalBill(row);
    }
    else if(billtype === "A"){
      this.openIBNBill(row);
    }
    else if(billtype === "F"){
      this.openDailyOTBill(row);
    }
    else if(billtype === "E"){
      this.openCumulativeBill(row);
    }
    else if(billtype === "B"){
      this.openOnCallBill(row);
    }
    else if(billtype === "G"){
      this.openTimesBill(row);
    }
    else if(billtype === "H"){
      this.openBillH(row);
    }
    else if(billtype === "I"){
      this.openWalkinBill(row);
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
  openWalkinBill(element: any){
    debugger;
    let json = {
      party: element.party,
      subject: element.subject,
      from: element.billfrom,
      to: element.billto,
      format: "12",
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
    this.apiService.post(BILL_API_I, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      if(res.body.length > 60){
        localStorage.setItem("removeheader", "1");
      }
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_I, '_blank'); });
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
      customfavalue: element.favalue,
      billCalType: element.billCalType
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
    localStorage.setItem("billcaltype", element.billCalType);
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
  openBillH(element: any){
    localStorage.setItem("removeheader", "0");
    debugger;
    let json = {
      party: element.party,
      from: element.billfrom,
      to: element.billto,
      format: "11",
      nightstart: element.nightstart,
      nightend: element.nightend,
      gsttype: element.gsttype,
      parkinggst: element.parkinggst
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
    this.apiService.post(BILL_API_H, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_H, '_blank'); });
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
      localStorage.setItem("removeheader", "1");
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
}
