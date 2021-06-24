import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {BILL_API, DRIVER_API, OWNER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_CAR, ROUTE_GENERATE_BILL, ROUTE_OWNER } from 'src/shared/constants/constant';
import * as moment from 'moment-timezone';
import * as XLSX from 'xlsx';
//const moment = require('moment-timezone');
export interface iBillDet {
  sl: string;
  dutydate: string;
  carno: string;
  hour: string;
  km: number;
  parking: string;
}

export class BillDet implements iBillDet {
  sl: string;
  dutydate: string;
  carno: string;
  hour: string;
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
}
export class SaveBill implements iSaveBill {
  billnumber: string;
  billfrom: string;
  billto: string;
  billdate: string;
  party: string;
  mode: string;
}
@Component({
  selector: 'app-driver-ot',
  templateUrl: './driverot.component.html',
  styleUrls: ['./driverot.component.css']
})
export class DriverOTComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
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
  displayedColumns: string[] = [ 'slno', 'dutydate', 'carno', 'party', 'gout', 'gin', 'hour', 'parking', 'ot', 'km', 'out'];
  dataSource: MatTableDataSource<BillDet>;
  year: any;
  month: string;
  filterby: string;
  filtervalue: string;
  dataset: any;
  driver: any;
  from: string;
  to: string;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.driver = localStorage.getItem("driver");
    this.from = localStorage.getItem("driverfrom");
    this.to = localStorage.getItem("driverto");
    debugger;
    var json = 
    {
      "mode": 6,
      "driver": this.driver,
      "from": this.from,
      "to": this.to
    };
    this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
      debugger;
      this.dataset = res.body;
      let slno = 1;
      this.dataset.forEach(element => {
        element.slno = slno;
        slno = slno + 1;
      });
      this.dataset.push({
        slno: "Total",
        dutydate: "",
        carnum: "",
        party: "",
        gout: "",
        gin: "",
        totalhr: res.total.totalhour,
        parking: res.total.totalparking,
        ot: res.total.totalot,
        km: res.total.totalkm,
        out: res.total.totalout
      }) 
      this.dataSource = new MatTableDataSource(this.dataset);
    });
    
   }

   export(){
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OT_Data');
    
    
    XLSX.writeFile(wb, 'OT_' + this.driver + '.xlsx');
    this.toastr.success("Excel generation successful");
   }
/*    save(){
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
      this.apiService.post(BILL_API, billSave).then((res: any)=>{ 
          debugger;
          if(res.status === "success"){
          this.exportAsPDF("container");
          this.isConfirmVisible = false;
          this.toastr.success("Your bill was successfully created",'Success');
          
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
  } */
}
