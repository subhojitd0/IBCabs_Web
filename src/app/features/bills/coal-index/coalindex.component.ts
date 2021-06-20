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
  selector: 'app-coalindex',
  templateUrl: './coalindex.component.html',
  styleUrls: ['./coalindex.component.css']
})
export class CoalIndexComponent implements OnInit {
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
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.party = localStorage.getItem("billparty");
    this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.month = this.monthNames[localStorage.getItem("billmonth")];
    this.year = localStorage.getItem("billyear");
    debugger;
    if(this.billdetails){
      let slno = 0;
      this.data = this.billdetails.result.body;
      this.data.forEach(element => {
        element.slno = slno + 1;
        slno = slno + 1;
      });
      // this.data.push({
      //   slno: "Total",
      //   billnum: "",
      //   reportto: "",
      //   amount: this.billdetails.result.tail
      // })
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
