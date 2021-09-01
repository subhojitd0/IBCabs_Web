import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_CAR, ROUTE_GENERATE_BILL, ROUTE_OWNER } from 'src/shared/constants/constant';
import { BillUploadComponent } from '../bill-upload/bill-upload.component';

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
  totalhr: string;
  totalkm: string;
  amount: string;
  fa: string;
  favalue: string;
  billCalType: any;
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
  totalhr: string;
  totalkm: string;
  amount: string;
  fa: string;
  favalue: string;
  billCalType: any;
}
@Component({
  selector: 'app-billj',
  templateUrl: './billj.component.html',
  styleUrls: ['./billj.component.css']
})
export class BillJComponent implements OnInit {
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
  count: number;
  month: string;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.billgst = localStorage.getItem("billgst");
    let billdate = localStorage.getItem("billdate");
    let billno = localStorage.getItem("billnumber");
    let billcalltype = localStorage.getItem("billcaltype");
    if(billdate){
      this.isConfirmVisible = false;
      this.billdate = billdate;
    }
    if(billno){
      this.isConfirmVisible = false;
      this.billno = billno;
    }
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.billfrom = localStorage.getItem("billfrom");
    this.billto = localStorage.getItem("billto");
    this.month = localStorage.getItem("billmonth");
    this.billfrom = new Date(new Date().getFullYear(), parseInt(this.month)-1, 1,10,0);
    this.billto = new Date(new Date().getFullYear(), parseInt(this.month), 0,10,0); 
    debugger;
    if(this.billdetails){
      this.count=0;
      this.billdetails.body.forEach(element =>{
        this.count = this.count + 1;
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
      //this.totalno = this.billdetails.body.length;
      //this.roundedgross = Math.round(parseFloat(this.billdetails.tail[0].grosstotal.toString().replace(',','')));
      /* let index = this.billdetails.tail[0].grosstotal.toString().indexOf('.');
      let substringVal = this.billdetails.tail[0].grosstotal;
      if(index > 0)
         substringVal = this.billdetails.tail[0].grosstotal.toString().substr(0, index);
      substringVal = substringVal.toString().replace(',',''); */
      let gstRounded = Math.round(parseFloat(this.billdetails.gst.total.toString().replace(',','')));
      this.amountInWord = this.apiService.convertAmountToWord(this.billdetails.tail.grosstotal);
      this.gstamountinwords = this.apiService.convertAmountToWord(gstRounded);
      this.marginTop = (31-this.totalno)*2.5;
      this.fontSize = 20 + this.marginTop * 0.03;
      localStorage.removeItem("billnumber");
      localStorage.removeItem("billdate");
      localStorage.setItem("removeheader", "0");
    }
    
   }
   save(){
    let billcalltype = localStorage.getItem("billcaltype");
     if(!(this.billno && this.billdate)){
      alert("Please enter a proper bill number and bill date to proceed");
     }
     else{
      let billSave : SaveBill = new SaveBill();
      billSave.billdate = this.billdate;
      billSave.billnumber = this.billno;
      billSave.billfrom = this.billfrom;
      billSave.billto = this.billto;
      billSave.party = localStorage.getItem("billpartymaster");
      //billSave.subject =  localStorage.getItem("billsubject");
      billSave.gsttype = localStorage.getItem("billgst");
      billSave.parkingtype = localStorage.getItem("billparking");
      billSave.billtype = "J";
      billSave.totalhr = this.billdetails.bodytotal.actualhour;
      billSave.totalkm = this.billdetails.bodytotal.actualkm;
      billSave.fa= this.billdetails.tail.customfa;
      billSave.favalue=this.billdetails.tail.customfavalue;
      billSave.amount = this.billdetails.tail.grosstotal;
      billSave.mode = "1";
      billSave.billCalType = billcalltype;
      this.apiService.post(BILL_API, billSave).then((res: any)=>{ 
          debugger;
          if(res.status === "success"){
            localStorage.setItem('selectedbillregid', res.id);
            //this.exportAsPDF("printdiv");
            this.isConfirmVisible = false;
            this.toastr.success("Your bill was successfully created. Total " + res.count + " duty slips were updated" ,'Success');
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
