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
import * as moment from 'moment';
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
  reportto: string;
  nightstart: string;
  nightend: string;
  totalhr: string;
  totalkm: string;
  night: string;
  parking: string;
  outstation: string;
}
export class SaveBill implements iSaveBill {
  billnumber: string;
  billfrom: string;
  billto: string;
  billdate: string;
  party: string;
  mode: string;
  billtype: string;
  reportto: string;
  nightstart: string;
  nightend: string;
  totalhr: string;
  totalkm: string;
  night: string;
  parking: string;
  outstation: string;
}
@Component({
  selector: 'app-mis',
  templateUrl: './mis.component.html',
  styleUrls: ['./mis.component.css']
})
export class RelianceMISComponent implements OnInit {
  @ViewChild('table') table: ElementRef; 
  billno: any;
  billdate: any;
  billdetails: any;
  amountInWord: any;
  roundedgross: any;
  billparty: any;
  billfrom: any;
  billto: any;
  gstamountinwords: any;
  totalno: any;
  marginTop: any;
  fontSize: any;
  billArray: any;
  isConfirmVisible: any = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sl', 'dutydate', 'reportto', 'cartype', 'carno', 'stkm', 'enkm', 'km', 'sthr', 'enhr', 'hour', 'exhr', 'night', 'parking', 'outstation', 'owner'];
  dataSource: MatTableDataSource<BillDet>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.billfrom = localStorage.getItem("billfrom");
    this.billto = localStorage.getItem("billto");
    this.billparty = localStorage.getItem("billparty");
    debugger;
    if(this.billdetails){
      debugger;
      this.billArray = [];
      this.billdetails[0].record.forEach((val: any)=>{
        this.billArray.push(val);
      });
      this.billdetails[0].total.forEach((val: any)=>{
        this.billArray.push(val);
      });
      this.billArray.forEach((val: any)=>{
        val.outstation = val.outstation === "NaN" ? "0": val.outstation;
      })
      /* billArray.push(this.billdetails[0].record);
      billArray.push(this.billdetails[0].total); */
      /* let billTot : BillDet = new BillDet();
      billTot.carno = "Total";
      billTot.sl = "";
      billTot.dutydate = "";
      billTot.hour = this.billdetails.bodytotal[0].hour;
      billTot.km = this.billdetails.bodytotal[0].km;
      billTot.parking = this.billdetails.bodytotal[0].parking;
      this.billdetails.body.push(billTot); */
      this.dataSource = new MatTableDataSource(this.billArray);
      //localStorage.setItem("billdata", "");
      this.totalno = this.billArray.length;
      /* this.roundedgross = Math.round(parseFloat(this.billdetails.tail[0].grosstotal.toString().replace(',','')));
      /* let index = this.billdetails.tail[0].grosstotal.toString().indexOf('.');
      let substringVal = this.billdetails.tail[0].grosstotal;
      if(index > 0)
         substringVal = this.billdetails.tail[0].grosstotal.toString().substr(0, index);
      substringVal = substringVal.toString().replace(',','');
      let gstRounded = Math.round(parseFloat(this.billdetails.gst[0].total.toString().replace(',','')));
      this.amountInWord = this.apiService.convertAmountToWord(this.roundedgross);
      this.gstamountinwords = this.apiService.convertAmountToWord(gstRounded); */
      this.marginTop = (31-this.totalno)*2.5;
      this.fontSize = 20 + this.marginTop * 0.03;
      localStorage.setItem("removeheader", "0");
    }
    
   }
   export()
   {
     const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'MIS');
     
     
     XLSX.writeFile(wb, 'MIS.xlsx');
     this.toastr.success("Excel generation successful");
     
   }
/*    save()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  
  XLSX.writeFile(wb, 'SheetJS.xlsx');
  
} */
   save(){
     this.billno = "MIS";
     this.billdate = moment().format("YYYY-MM-DD");
     if(!(this.billno && this.billdate)){
      alert("Please enter a proper bill number and bill date to proceed");
     }
     else{
      let billSave : SaveBill = new SaveBill();
      billSave.billdate = this.billdate;
      billSave.billnumber = this.billno;
      billSave.billfrom = localStorage.getItem("billfrom");
      billSave.billto = localStorage.getItem("billto");
      billSave.party = localStorage.getItem("billparty");
      billSave.billtype = "D0";
      billSave.reportto = localStorage.getItem("billreportto");
      billSave.mode = "1";
      billSave.nightstart = localStorage.getItem("nightstart");
      billSave.nightend = localStorage.getItem("nightend");
      billSave.totalhr = this.billdetails[0].total[0].hour;
      billSave.totalkm = this.billdetails[0].total[0].km;
      billSave.night = this.billdetails[0].total[0].night;
      billSave.outstation = this.billdetails[0].total[0].outstation;
      billSave.parking = this.billdetails[0].total[0].parking;
      debugger;
      this.apiService.post(BILL_API, billSave).then((res: any)=>{ 
          debugger;
          if(res.status === "success"){
          this.exportAsPDF("container");
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
