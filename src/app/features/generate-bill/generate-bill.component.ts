import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {BILL_API, BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_RELIANCE_API, OWNER_API, PARTY_HEAD_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_OWNER, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY } from 'src/shared/constants/constant';
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
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
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
    });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  downloadBill(bill: any){
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
  openIBNBill(element: any){
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
    this.apiService.post(BILL_CNN_API, json).then((res: any)=>{ 
      debugger;
      localStorage.setItem("billdata", JSON.stringify(res));
      this.toastr.success("Your bill was successfully created",'Success');
      this.router.navigateByUrl('/' + ROUTE_VIEW_BILL_CNN);
    });
  }
  openRelSummaryBill(element: any){
    debugger;
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
      this.router.navigateByUrl('/' + ROUTE_VIEW_BILL_RELIANCE_SUMMARY);
    });
  }
  openCoalBill(element: any){
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
      this.router.navigateByUrl('/' + ROUTE_VIEW_BILL_COAL_INDIA);
    });
  }
  openBill(element: any){
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
      this.router.navigateByUrl('/' + ROUTE_VIEW_BILL_RELIANCE_MIS);
    });
  }
  openJMSBill(element: any){
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
      this.router.navigateByUrl('/' + ROUTE_VIEW_BILL_RELIANCE_JMS);
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
