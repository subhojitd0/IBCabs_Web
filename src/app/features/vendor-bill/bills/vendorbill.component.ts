import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {ABP_API, BILL_API, BILL_API_H, BILL_API_I, BILL_API_J, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, BILL_TIMES_API, BILL_VENDOR_PAY, BILL_VENDOR_PAY_UPDATE, DAILY_OT_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_ABP, ROUTE_CAR, ROUTE_DAILY_OT, ROUTE_GENERATE_BILL, ROUTE_GENERATE_VENDOR_BILL, ROUTE_OWNER, ROUTE_TIMES_BILL, ROUTE_VENDOR_BILL_ORIGINAL, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_H, ROUTE_VIEW_BILL_I, ROUTE_VIEW_BILL_J, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';

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
  tothr: any;
  totkm: any;
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
  vendorname: string = "";
  vendorcode: string;
  startdate: string = "";
  enddate: string = "";
  billRegDetails: any;
  userrole: string;
  loading: boolean;
  showsubmit: boolean = false;
  gTotal = 0;
  defaultnote = {
    "dutycode" : "0",
    "vendor" : this.vendorname,
    "amount": 0,
    "totalhr": "",
    "totalkm": 0,
    "start": this.startdate,
    "end": this.enddate,
    "car": "",
    "extra": 1,
    "sl": ""
  }
  extradetails: any[] = [];
  tothr = 0;
  totkm = 0;
  amount: string;
  comment: string;
  vendorfinal: string;
  isConfirmed: boolean = false;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.loading = true;
    this.userrole = localStorage.getItem("loggedinuser");
    this.vendorfinal = localStorage.getItem("vendorfinal");
    debugger;
    console.log("vedor : " , this.vendorfinal);
    if(this.vendorfinal && this.vendorfinal === "1"){
      this.isConfirmed = true;
    }
    this.vendorname = localStorage.getItem("vendorname");
    this.vendorcode =   localStorage.getItem("vendorcode");
    this.startdate =   localStorage.getItem("vendorfrom");
    this.enddate =   localStorage.getItem("vendorto");
    this.amount = localStorage.getItem("vendoramount");
    this.comment = localStorage.getItem("vendorcomment");
    let vendorsave = localStorage.getItem("vendorbillsave");
    if(vendorsave === "1"){
      this.showsubmit = true;
      var json = {
        ownername: this.vendorname,
        startdate: this.startdate,
        enddate: this.enddate,
        ownercode: this.vendorcode,
        mode: "1"
      };
      this.apiService.post(BILL_VENDOR_PAY, json).then((res: any)=>{ 
        debugger;
        localStorage.setItem("vendorbilldata", JSON.stringify(res));
        this.toastr.success("Your bill was successfully created",'Success');
        this.startprocess();
      });
    }
    else{
      this.showsubmit = false;
      this.startprocess();
    }
    
   }
   startprocess(){
    this.billdetails = JSON.parse(localStorage.getItem("vendorbilldata"));
    if(this.amount){
      this.isConfirmVisible = false;
      this.total = this.amount;
      this.showsubmit = true;
    }
    if(this.comment){
      this.isConfirmVisible = false;
      this.comments = this.comment;
      this.showsubmit = true;
    }
    const carlist : CarDet[] = [];
    if(this.billdetails){
      let tempextradetails = this.billdetails.extra; //extra detail for all
      let uniqueCars = [...new Set(this.billdetails.result.map(x=>x.carno))];
      uniqueCars.forEach((car: any)=>{
        let carD = new CarDet();
        carD.carno = car;
        carD.data = this.billdetails.result.filter(x=>x.carno === car);
        let slno = 0;
        carD.tothr = 0;
        carD.totkm = 0;
        /* let tothr = 0;
        let totkm = 0; */
        let totparking = 0;
        let totamt = 0;
        carD.data.forEach((dat: any)=>{
          dat.sl = slno + 1;
          slno = slno + 1;
          dat.car = "";
          dat.startdate = "0";
          dat.enddate = "0";
          dat.vendor = "0";
          dat.extra = 0;
          dat.amount = (dat.amount.toString() === "0.01" || dat.amount.toString() === "0.01") ? "0.00": dat.amount.toString().replace(',','');
          carD.tothr = parseFloat(dat.totalhr) + carD.tothr;
          carD.totkm = parseFloat(dat.totalkm) + carD.totkm;
          totparking = parseFloat(dat.parking) + totparking;
          totamt = parseFloat(dat.amount) + totamt;
        })
        let newData={
          sl: "Total",
          totalhr: carD.tothr,
          totalkm: carD.totkm,
          extra: 0,
          parking: totparking,
          //amount: totamt
        }
    
        carD.data.push(newData);
        
        if(tempextradetails && tempextradetails.length > 0){
          let count = 0;
        tempextradetails.filter(x=>x.car === car).forEach(element => {
            let json = {
              "sl": count,
              "dutycode" : element.noteid,
              "vendor" : this.vendorname,
              "amount": element.amount,
              "totalhr": element.note,
              "totalkm": element.amount,
              "startdate": this.startdate,
              "enddate": this.enddate,
              "car": car,
              "extra": 1
            }
            totamt = totamt + parseFloat(element.amount);
            this.extradetails.push(json);
            
            carD.data.push(json);
            count = count + 1;
          });
        }
        let extracount = 5 - this.extradetails.filter(x=>x.car === car).length;
        for(let j=0; j<extracount; j++){
          let note = {
            "dutycode" : "0",
            "vendor" : this.vendorname,
            "amount": 0,
            "totalhr": "",
            "totalkm": 0,
            "startdate": this.startdate,
            "enddate": this.enddate,
            "car": car,
            "extra": 1,
            "sl": (extracount + j).toString()
          }
          this.extradetails.push(note);
          carD.data.push(note);
        }
        let newJsonTotal={
          sl: "Total Amount",
          amount: totamt,
          extra: 1,
          hr: "Total Amount",
          totalhr: "Total Amount"   
          //amount: totamt
        }
        carD.data.push(newJsonTotal);
        carlist.push(carD);
        this.gTotal = this.gTotal + totamt;
      });

      this.alldata = carlist;
      this.total = this.gTotal;
    }
    var json2 = 
    {
      "mode": 0
    };
    this.apiService.post(BILL_API, json2).then((res: any)=>{ 
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
     let totkm = 0;
     let tothr = 0;
     this.alldata.filter(x=>x.carno === row.carno)[0].data.filter(x=>x.sl !== "Total" && x.sl !== "Total Amount").forEach(element => {
      totamt = totamt + parseFloat(element.amount);
      debugger;
      if(element.extra === 0){
        totkm = totkm + parseFloat(element.totalkm);
        tothr = tothr + parseFloat(element.totalhr === "" ? 0 : element.totalhr);
      }
     });
     this.alldata.filter(x=>x.carno === row.carno)[0].data.filter(x=>x.sl === "Total Amount")[0].amount = totamt;
     this.alldata.filter(x=>x.carno === row.carno)[0].data.filter(x=>x.sl === "Total")[0].totalhr = tothr;
     this.alldata.filter(x=>x.carno === row.carno)[0].data.filter(x=>x.sl === "Total")[0].totalkm = totkm;
     
   }
   changeextra(row: any){
    debugger;
    let totamt = 0;
    this.alldata.filter(x=>x.carno === row.car)[0].data.filter(x=>x.sl !== "Total" && x.sl !== "Total Amount").forEach(element => {
     totamt = totamt + parseFloat(element.amount);
    });
    //this.gTotal = totamt;
    this.alldata.filter(x=>x.carno === row.car)[0].data.filter(x=>x.sl === "Total Amount")[0].amount = totamt;
   }
   downloadOriginalBill(){
    this.toastr.info("Please wait while we are generating the bill");
    debugger;
    this.openOriginalBill();
   }
   openOriginalBill(){
    debugger;
    let json = {
      ownername: this.vendorname,
      startdate: this.startdate,
      enddate: this.enddate,
      ownercode: this.vendorcode,
      mode: "3",
    }
    localStorage.setItem("vendorname", this.vendorname);
    localStorage.setItem("vendorcode", this.vendorcode);
    localStorage.setItem("vendorfrom", this.startdate);
    localStorage.setItem("vendorto", this.enddate);
    this.apiService.post(BILL_VENDOR_PAY, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("vendorbilldata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VENDOR_BILL_ORIGINAL, '_blank'); });
    });
  }
   save(){
     this.toastr.info("Please wait while we are saving the data");
     this.loading = true;
     let updateData: any[] = [];
     this.alldata.forEach((row: any)=>{
       row.data.forEach(element => {
         if(element.extra === 1){
          element.hr = element.totalhr;
          element.km = element.car;
         }
         else{
          element.vendor = "0";
          element.hr = element.totalhr;
          element.km = element.totalkm;
         }
         
         updateData.push(element);
       });
     });
     debugger;
    this.apiService.post(BILL_VENDOR_PAY_UPDATE, updateData).then((res: any)=>{ 
        debugger;
        if(res.result.length > 0 && res.result[0].status === "Success"){
          debugger;
          this.loading = false;
          this.toastr.success("Data has been saved successfully");
          localStorage.setItem("vendorbillsave", "1");
          location.reload();
        }
        else{
          this.toastr.error("There was an error saving your data");
          this.loading = false;
        }
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
    else if(billtype === "J"){
      this.openBillJ(row);
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
  openBillJ(element: any){
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
    this.apiService.post(BILL_API_J, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      localStorage.setItem("removeheader", "1");
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VIEW_BILL_J, '_blank'); });
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
