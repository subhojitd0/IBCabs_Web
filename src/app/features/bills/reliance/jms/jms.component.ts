import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  mode: string;
  billtype: string;
  amount: string;
}
export class SaveBill implements iSaveBill {
  billnumber: string;
  billfrom: string;
  billto: string;
  billdate: string;
  party: string;
  mode: string;
  billtype: string;
  amount: string;
}
@Component({
  selector: 'app-jms',
  templateUrl: './jms.component.html',
  styleUrls: ['./jms.component.css']
})
export class RelianceJMSComponent implements OnInit {
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
  jmsno: any;
  jmsdate: any;
  isConfirmVisible: any = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sl', 'city', 'username', 'carno', 'sitetype', 'costcentre', 'realestate', 'pkgqty', 'pkgamount', 'kmqty', 'kmamount', 'hrqty', 'hramount', 'nightqty', 'nightamount', 'outstationqty', 'outstationamount', 'parkingqty', 'parkingamount'];
  dataSource: MatTableDataSource<BillDet>;
  month: string;
  year: number;
  billparty: string;
  cardesc: string;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    let jmsdate = localStorage.getItem("billdate");
    let jmsno = localStorage.getItem("billnumber");
    if(jmsdate){
      this.isConfirmVisible = false;
      this.jmsdate = jmsdate;
    }
    if(jmsno){
      this.isConfirmVisible = false;
      this.jmsno = jmsno;
    }
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.billfrom = localStorage.getItem("billfrom");
    this.billto = localStorage.getItem("billto");
    this.billparty = localStorage.getItem("billparty");
    debugger;
    let newDate = new Date(this.billfrom);
    this.month = newDate.toLocaleString('default', { month: 'long' });
    
    if(this.billparty.includes("DZIRE")){
      this.cardesc = "COMPSCT SEDAN - INDIGO OR EQUIVALENT";
    }
    else if(this.billparty.includes("SUV")){
      this.cardesc = "SUV - XYLO OR EQUIVALENT";
    }
    else{
      this.cardesc = "PREMIUM SUV - INNOVA OR EQUIVALENT";
    }
    this.year = newDate.getFullYear();
    if(this.billdetails){
      let i=0;
      this.billdetails[0].body.forEach(element => {
        element.slno = i + 1;
        i = i + 1;
      });
      /* let billTot : BillDet = new BillDet();
      billTot.carno = "Total";
      billTot.sl = "";
      billTot.dutydate = "";
      billTot.hour = this.billdetails.bodytotal[0].hour;
      billTot.km = this.billdetails.bodytotal[0].km;
      billTot.parking = this.billdetails.bodytotal[0].parking;
      this.billdetails.body.push(billTot); */
      //this.dataSource = new MatTableDataSource(this.billdetails.body);
      //localStorage.setItem("billdata", "");
      /* this.totalno = this.billdetails.body.length;
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
      this.fontSize = 20 + this.marginTop * 0.03; */
      localStorage.removeItem("billnumber");
      localStorage.removeItem("billdate");
    }
    
   }
   export()
   {
     const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'JMSData');
     
     
     XLSX.writeFile(wb, 'JMS.xlsx');
     this.toastr.success("Excel generation successful");
     
   }
   save(){
     if(!(this.jmsno && this.jmsdate)){
      alert("Please enter a proper bill number and bill date");
     }
     else{
      let billSave : SaveBill = new SaveBill();
      billSave.billdate = this.jmsdate;
      billSave.billnumber = this.jmsno;
      billSave.billfrom = localStorage.getItem("billfrom");
      billSave.billto = localStorage.getItem("billto");
      billSave.party = localStorage.getItem("billparty");
      billSave.billtype = "D1";
      billSave.mode = "1";
      billSave.amount = this.billdetails[0].total;
      this.apiService.post(BILL_API, billSave).then((res: any)=>{ 
          debugger;
          if(res.status === "success"){
          this.exportAsPDF("container");
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
    html2canvas(data, {scrollX: -window.scrollX}).then(canvas => {
      var margin = 0;
      var imgWidth = 120 - 2*margin; 
      var pageHeight = 300 + 2*margin;  
      var imgHeight = canvas.height * 300 / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jspdf('l', 'mm','a4');
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
