import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_API, BILL_VENDOR_PAY, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_CAR, ROUTE_GENERATE_BILL, ROUTE_GENERATE_VENDOR_BILL, ROUTE_OWNER } from 'src/shared/constants/constant';

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
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
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
    }
    if(comment){
      this.isConfirmVisible = false;
      this.comments = comment;
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
        carD.data.forEach((dat: any)=>{
          dat.sl = slno + 1;
          slno = slno + 1;
          tothr = parseFloat(dat.totalhr) + tothr;
          totkm = parseFloat(dat.totalkm) + totkm;
          totparking = parseFloat(dat.parking) + totparking;
        })
        let newData={
          sl: "Total",
          totalhr: tothr,
          totalkm: totkm,
          parking: totparking,
          amount: 0
        }
        carD.data.push(newData);
        carlist.push(carD);
      });
      this.alldata = carlist;
    }
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
     /* if(!(this.billno && this.billdate)){
      alert("Please enter a proper bill number and bill date to proceed");
     }
     else{
      let billSave : SaveBill = new SaveBill();
      billSave.billdate = this.billdate;
      billSave.billnumber = this.billno;
      billSave.billfrom = localStorage.getItem("billfrom");
      billSave.billto = localStorage.getItem("billto");
      billSave.party = this.party;
      billSave.billtype = "D2";
      billSave.mode = "1";
      billSave.amount = this.billdetails.billtotal;
      this.apiService.post(BILL_API, billSave).then((res: any)=>{ 
          debugger;
          if(res.status === "success"){
          //this.exportAsPDF("container");
          this.isConfirmVisible = false;
          this.toastr.success("Your bill was successfully created",'Success');
          this.router.navigateByUrl('/' + ROUTE_GENERATE_BILL);
        }
      });
     } */
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
}
