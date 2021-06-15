import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../../shared/services/service';
import {BILL_API, OWNER_API, PARTY_HEAD_API} from '../../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_CAR, ROUTE_GENERATE_BILL, ROUTE_OWNER } from 'src/shared/constants/constant';

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
  mode: string;
  billtype: any;
  amount: any;
}
export class SaveBill implements iSaveBill {
  billnumber: string;
  billfrom: string;
  billto: string;
  billdate: string;
  party: string;
  mode: string;
  billtype: any;
  amount: any;
}
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class RelinceSummaryComponent implements OnInit {
  fromdate: any;
  todate: any;
  billno: any;
  billdate: any;
  billdetails: any;
  amountInWord: any;
  roundedgross: any;
  billfrom: any;
  jmssuv: any;
  jmsdzire: any;
  workorderdate: any;
  jmsinnova: any;
  amountdzire: any;
  amountsuv: any;
  amountinnova: any;
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

  isConfirmVisible: any = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sl', 'dutydate', 'reportto', 'carno', 'cartype', 'hour', 'km', 'rate', 'amount', 'parking', 'outstation'];
  dataSource: MatTableDataSource<BillDet>;
  roundedtotal: number;
  roundedamount: number;
  roundedtax: number;
  party: string;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
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
    this.party = localStorage.getItem("billparty");
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.fromdate = localStorage.getItem("billfrom");
    this.todate = localStorage.getItem("billto");
    debugger;
    if(this.billdetails){
      debugger;
      if(this.party.toString().includes("SUV")){
        this.jmssuv = this.billdetails.jmsno;
        this.amountsuv= this.billdetails.amount;
      }
      else if(this.party.toString().includes("INNOVA")){
        this.jmsinnova= this.billdetails.jmsno;
        this.amountinnova= this.billdetails.amount;
      }
      else{
        this.jmsdzire = this.billdetails.jmsno;
        this.amountdzire= this.billdetails.amount;
      }
      this.taxable= "";
      this.cgst= this.billdetails.cgst;
      this.sgst= this.billdetails.sgst;
      this.totalgst= this.billdetails.gst;
      this.totalamount= this.billdetails.billtotal;
      this.roundedamount = Math.round(parseFloat(this.billdetails.billtotal.toString().replace(',','')));
      this.roundedtax = Math.round(parseFloat(this.totalgst.toString().replace(',','')));
      this.gstinwords= this.apiService.convertAmountToWord(this.roundedtax);
      this.totalmountinwords= this.apiService.convertAmountToWord(this.roundedamount);
      /* let billTot : BillDet = new BillDet();
      billTot.carno = "Total";
      billTot.sl = "";
      billTot.dutydate = "";
      billTot.hour = this.billdetails.bodytotal[0].hour;
      billTot.km = this.billdetails.bodytotal[0].km;
      billTot.parking = this.billdetails.bodytotal[0].parking;
      this.billdetails.body.push(billTot); 
      this.dataSource = new MatTableDataSource(this.billdetails.body);
      //localStorage.setItem("billdata", "");
      this.totalno = this.billdetails.body.length;
      this.roundedgross = Math.round(parseFloat(this.billdetails.tail[0].grosstotal.toString().replace(',','')));
      /* let index = this.billdetails.tail[0].grosstotal.toString().indexOf('.');
      let substringVal = this.billdetails.tail[0].grosstotal;
      if(index > 0)
         substringVal = this.billdetails.tail[0].grosstotal.toString().substr(0, index);
      substringVal = substringVal.toString().replace(',',''); 
      let gstRounded = Math.round(parseFloat(this.billdetails.gst[0].total.toString().replace(',','')));
      this.amountInWord = this.apiService.convertAmountToWord(this.roundedgross);
      this.gstamountinwords = this.apiService.convertAmountToWord(gstRounded);
      this.marginTop = (31-this.totalno)*2.5;
      this.fontSize = 20 + this.marginTop * 0.03;*/
       localStorage.setItem("billdate","");
       localStorage.setItem("billnumber","");
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
      billSave.party = "JIO BILL - " + this.party;
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
     }
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
      var positionx = 10;

      doc.addImage(canvas, 'PNG', positionx, positiony, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        positiony = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, 'PNG', positionx, positiony, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save( 'file.pdf');
      if(this.billno){
        this.router.navigateByUrl('/' + ROUTE_GENERATE_BILL);
      }
    }); 
  }
}
