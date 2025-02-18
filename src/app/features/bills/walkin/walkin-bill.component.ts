import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_CAR, ROUTE_GENERATE_BILL, ROUTE_OWNER } from 'src/shared/constants/constant';
import { BillUploadComponent } from '../bill-upload/bill-upload.component';
import * as XLSX from 'xlsx';
export interface iBillDet {
  sl: string;
  dutydate: string;
  reportto: string;
  carno: string;
  cartype: string;
  hour: string;
  rate: string;
  amount: string;
  outstation: string;
  km: number;
  parking: string;
}

export class BillDet implements iBillDet {
    sl: string;
    dutydate: string;
    reportto: string;
    carno: string;
    cartype: string;
    hour: string;
    rate: string;
    amount: string;
    outstation: string;
    km: number;
    parking: string;
}

export interface iSaveBill {
  billnumber: string;
  billfrom: string;
  billto: string;
  billdate: string;
  party: string;
  subject: string;
  gsttype: string;
  parkingtype: string;
  billtype: string;
  total: string;
  mode: string;
  reportto: string;
  fa: string;
  favalue: string;
}
export class SaveBill implements iSaveBill {
  billnumber: string;
  billfrom: string;
  billto: string;
  billdate: string;
  party: string;
  subject: string;
  gsttype: string;
  parkingtype: string;
  billtype: string;
  total: string;
  mode: string;
  reportto: string;
  fa: string;
  favalue: string;
}
@Component({
  selector: 'app-walkin-bill',
  templateUrl: './walkin-bill.component.html',
  styleUrls: ['./walkin-bill.component.css']
})
export class WalkinBillComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  billno: any;
  billdate: any;
  billdetails: any;
  amountInWord: any;
  roundedgross: any;
  billfrom: any;
  billto: any;
  gstamountinwords: any;
  totalno: any;
  marginTop: any;
  fontSize: any;
  billgst: any;
  isConfirmVisible: any = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sl', 'dutydate', 'reportto', 'carno', 'cartype', 'hour', 'km', 'rate', 'amount', 'parking', 'outstation'];
  dataSource: MatTableDataSource<BillDet>;
  removeheader: string;
  normalgross: number;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.removeheader = localStorage.getItem("removeheader");
    this.billgst = localStorage.getItem("billgst");
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.billfrom = localStorage.getItem("billfrom");
    this.billto = localStorage.getItem("billto");
    let billdate = localStorage.getItem("billdate");
    let billno = localStorage.getItem("billnumber");
    if(billdate){
      this.isConfirmVisible = false;
      this.billdate = billdate;
    }
    if(billno){
      this.isConfirmVisible = false;
      this.billno = billno;
    }
    debugger;
    if(this.billdetails){
      /* let billTot : BillDet = new BillDet();
      billTot.carno = "Total";
      billTot.sl = "";
      billTot.dutydate = "";
      billTot.hour = this.billdetails.bodytotal[0].hour;
      billTot.km = this.billdetails.bodytotal[0].km;
      billTot.parking = this.billdetails.bodytotal[0].parking;
      this.billdetails.body.push(billTot); */
      this.dataSource = new MatTableDataSource(this.billdetails.body);
      //localStorage.setItem("billdata", "");
      this.totalno = this.billdetails.body.length;
      this.normalgross = this.billdetails.tail[0].grosstotal.toString();
      this.roundedgross = Math.round(parseFloat(this.billdetails.tail[0].grosstotal.toString().replace(',','')));
      /* let index = this.billdetails.tail[0].grosstotal.toString().indexOf('.');
      let substringVal = this.billdetails.tail[0].grosstotal;
      if(index > 0)
         substringVal = this.billdetails.tail[0].grosstotal.toString().substr(0, index);
      substringVal = substringVal.toString().replace(',',''); */
      let gstRounded = Math.round(parseFloat(this.billdetails.gst[0].total.toString().replace(',','')));
      if(this.billgst !== '2'){
        this.normalgross = parseFloat(this.billdetails.tail[0].grosstotal.toString().replace(',','')) + parseFloat(this.billdetails.gst[0].total.toString().replace(',',''));
        this.roundedgross = this.roundedgross + gstRounded;
      }
      this.amountInWord = this.apiService.convertAmountToWord(this.roundedgross);
      this.gstamountinwords = this.apiService.convertAmountToWord(gstRounded);
      this.marginTop = 30;
      this.fontSize = 20 + this.marginTop * 0.03;
      localStorage.removeItem("billnumber");
      localStorage.removeItem("billdate");
      localStorage.setItem("removeheader", "0");
    }
    
   }
   save(){
     if(!(this.billno && this.billdate)){
      alert("Please enter a proper bill number and bill date to proceed");
     }
     else{
      let billSave : SaveBill = new SaveBill();
      billSave.billdate = this.billdate;
      billSave.billnumber = this.billno;
      billSave.billfrom = localStorage.getItem("billfrom");
      billSave.billto = localStorage.getItem("billto");
      billSave.party = "WALK IN(ON CALL)";
      billSave.subject =  localStorage.getItem("billsubject");
      billSave.gsttype = localStorage.getItem("billgst");
      billSave.parkingtype = localStorage.getItem("billparking");
      billSave.billtype = "I";
      billSave.reportto = localStorage.getItem("billreportto");
      billSave.fa= this.billdetails.tail[0].customfa;
      billSave.favalue=this.billdetails.tail[0].customfavalue;
      billSave.total = this.roundedgross;
      billSave.mode = "1";
      this.apiService.post(BILL_API, billSave).then((res: any)=>{ 
          debugger;
          if(res.status === "success"){
            localStorage.setItem('selectedbillregid', res.id);
           // this.exportAsPDF("printdiv");
            this.isConfirmVisible = false;
            this.toastr.success("Your bill was successfully created. Total " + res.count + " duty slips were updated" ,'Success');
            this.router.navigateByUrl('/' + ROUTE_GENERATE_BILL);
        }
      });
     }
   }
   export(){
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bill');
    
    
    XLSX.writeFile(wb, 'OnCallBill.xlsx');
    this.toastr.success("Excel generation successful");
   }
   exportAsPDF(div_id)
  {
    let data = document.getElementById(div_id);  
    html2canvas(data).then(canvas => {
      var margin = 0;
      var imgWidth = 180 - 2*margin; 
      var pageHeight = 300 + 2*margin;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jspdf('p', 'mm');
      var positiony = 10;
      var positionx = 15;

      doc.addImage(canvas, 'PNG', positionx, positiony, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        positiony = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, 'PNG', positionx, positiony, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save( 'file.pdf');
      /* if(this.billno){
        
      } */
    }); 
  }
}
