import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {ABP_API, BILL_API, BILL_API_H, BILL_API_I, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, BILL_TIMES_API, BILL_VENDOR_PAY, DAILY_OT_API, OWNER_API, PARTY_HEAD_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_ABP, ROUTE_CAR, ROUTE_DAILY_OT, ROUTE_OWNER, ROUTE_TIMES_BILL, ROUTE_VENDOR_BILL, ROUTE_VENDOR_BILL_ORIGINAL, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_H, ROUTE_VIEW_BILL_I, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';
import { NewVendorBillComponent } from './new-bill/newbill.component';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { CoalIndiaModalComponent } from '../bills/coalindia/coalindia.modal';

export interface BillRegister {
  paymentid: string;
  ownerid: string;
  ownername: string;
  startdate: number;
  enddate: string;
  amount: string;
  details: string;
  option: string;
}

@Component({
  selector: 'app-generate-vendor-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css']
})
export class GenarateVendorBillComponent implements OnInit {
billRegDetails: any[] = [];
  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['vendor', 'startdate','enddate', 'amount','details','original','option'];
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
    var yr = localStorage.getItem('vendorbillregyear');
    var month = localStorage.getItem('vendorbillregmonth');
    if(yr && month){
      this.month = month;
      this.year = yr;
     }
     else{
      this.month = "0" + (new Date().getMonth() + 1);
      this.year = new Date().getFullYear();
      localStorage.setItem("vendorbillregmonth", this.month);
      localStorage.setItem("vendorbillregyear", this.year);
     }
    this.billrole = localStorage.getItem("createbill");
    this.approve = localStorage.getItem("approve");
    this.delete = localStorage.getItem("delete");
     debugger;
    var json = 
    {
      "mode": "0"
    };
    this.apiService.post(BILL_VENDOR_PAY, json).then((res: any)=>{ 
      debugger;
      const billReg: BillRegister[] = res.result;
      this.billRegDetails = res.result;
      this.dataSource = new MatTableDataSource(billReg);
      localStorage.setItem("vendorregdata", JSON.stringify(this.billRegDetails));
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
    localStorage.setItem("vendorbillregmonth", this.month);
    localStorage.setItem("vendorbillregyear", this.year);
    const billReg: BillRegister[] = [];
    this.billRegDetails.forEach(element =>{
      let year = element.enddate.substr(0,4);
      let month = element.enddate.substr(5,2);
      if(this.month === month && this.year.toString() === year)
        billReg.push(element);
    });
    this.dataSource = new MatTableDataSource(billReg);
    this.loading = false;
   }
   downloadOriginalBill(bill: any){
    this.toastr.info("Please wait while we are generating the bill");
    debugger;
    this.openOriginalBill(bill);
   }
  downloadBill(bill: any){
    this.toastr.info("Please wait while we are generating the bill");
    debugger;
    this.openVendorBill(bill);
  }
  openOriginalBill(element: any){
    debugger;
    let json = {
      ownername: element.ownername,
      startdate: element.startdate,
      enddate: element.enddate,
      ownercode: element.ownerid,
      mode: "3",
    }
    localStorage.setItem("vendorname", element.ownername);
    localStorage.setItem("vendorcode", element.ownercode);
    localStorage.setItem("vendorfrom", element.startdate);
    localStorage.setItem("vendorto", element.enddate);
    localStorage.setItem("vendoramount", element.amount);
    localStorage.setItem("vendorcomment", element.details);
    this.apiService.post(BILL_VENDOR_PAY, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("vendorbilldata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VENDOR_BILL_ORIGINAL, '_blank'); });
    });
  }
  openVendorBill(element: any){
    localStorage.setItem("removeheader", "1");
    debugger;
    let json = {
      ownername: element.ownername,
      startdate: element.startdate,
      enddate: element.enddate,
      ownercode: element.ownerid,
      mode: "1",
    }
    localStorage.setItem("vendorname", element.ownername);
    localStorage.setItem("vendorfinal", "1");
    localStorage.setItem("vendorcode", element.ownerid);
    localStorage.setItem("vendorfrom", element.startdate);
    localStorage.setItem("vendorto", element.enddate);
    localStorage.setItem("vendoramount", element.amount);
    localStorage.setItem("vendorcomment", element.details);
    this.apiService.post(BILL_VENDOR_PAY, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("vendorbilldata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigate([]).then(result => {  window.open('/' + ROUTE_VENDOR_BILL, '_blank'); });
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
      this.apiService.post(BILL_VENDOR_PAY, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
  openDialog(id: any) {
    const dialogRef = this.dialog.open(NewVendorBillComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
}
