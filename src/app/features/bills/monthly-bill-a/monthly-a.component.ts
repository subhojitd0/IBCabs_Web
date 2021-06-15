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

export interface iBillDet {
  sl: string;
  dutydate: string;
  carno: string;
  hour: string;
  km: number;
  parking: string;
  outstation: string;
}

export class BillDet implements iBillDet {
  sl: string;
  dutydate: string;
  carno: string;
  hour: string;
  km: number;
  parking: string;
  outstation: string;
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
  formData: any;
  totalhr: any;
  totalkm: any;
  outstation: any;
  amount: any;
  reportto: any;
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
  formData: any;
  totalhr: any;
  totalkm: any;
  outstation: any;
  amount: any;
  reportto: any;
}
@Component({
  selector: 'app-monthly-a',
  templateUrl: './monthly-a.component.html',
  styleUrls: ['./monthly-a.component.css']
})
export class MonthlyBillAComponent implements OnInit {
  billno: any;
  billdate: any;
  billdetails: any;
  billfrom: any;
  billto: any;
  amountInWord: any;
  roundedgross: any;
  isConfirmVisible: any = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sl', 'dutydate', 'carno', 'hour', 'km', 'parking', 'out'];
  dataSource: MatTableDataSource<BillDet>;
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
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.billfrom = localStorage.getItem("billfrom");
    this.billto = localStorage.getItem("billto");
    debugger;
    if(this.billdetails){
      let billTot : BillDet = new BillDet();
      billTot.carno = "Total";
      billTot.sl = "";
      billTot.dutydate = "";
      billTot.hour = this.billdetails.bodytotal[0].hour;
      billTot.km = this.billdetails.bodytotal[0].km;
      billTot.parking = this.billdetails.bodytotal[0].parking;
      billTot.outstation = this.billdetails.bodytotal[0].outstation;
      this.billdetails.body.push(billTot);
      this.dataSource = new MatTableDataSource(this.billdetails.body);
      //localStorage.setItem("billdata", "");
      this.roundedgross = Math.round(parseFloat(this.billdetails.tail[0].grosstotal.toString().replace(',','')));
      /* let index = this.billdetails.tail[0].grosstotal.toString().indexOf('.');
      let substringVal = this.billdetails.tail[0].grosstotal;
      if(index > 0)
         substringVal = this.billdetails.tail[0].grosstotal.toString().substr(0, index);
      substringVal = substringVal.toString().replace(',',''); */
      this.amountInWord = this.apiService.convertAmountToWord(this.roundedgross);
      localStorage.removeItem("billnumber");
      localStorage.removeItem("billdate");
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
      billSave.party = localStorage.getItem("billparty");
      billSave.mode = "1";
      billSave.gsttype = localStorage.getItem("billgst");
      billSave.parkingtype = localStorage.getItem("billparking");
      billSave.billtype = "A";
      billSave.amount = this.roundedgross;
      billSave.totalhr = this.billdetails.bodytotal[0].hour;
      billSave.totalkm = this.billdetails.bodytotal[0].km;
      billSave.outstation = this.billdetails.bodytotal[0].outstation;
      billSave.mode = "1";

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
      /* if(this.billno){
        this.router.navigateByUrl('/' + ROUTE_GENERATE_BILL);
      } */
    }); 
  }
}
