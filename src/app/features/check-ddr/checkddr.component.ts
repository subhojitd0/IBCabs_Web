import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {BILL_API, OWNER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_CAR, ROUTE_GENERATE_BILL, ROUTE_OWNER } from 'src/shared/constants/constant';
import * as moment from 'moment-timezone';
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
  selector: 'app-check-ddr',
  templateUrl: './checkddr.component.html',
  styleUrls: ['./checkddr.component.css']
})
export class CheckDdrComponent implements OnInit {
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
  displayedColumns: string[] = [ 'dutydate', 'carno', 'hour', 'km', 'parking', 'tothr', 'totkm', 'totpar', 'out'];
  dataSource: MatTableDataSource<BillDet>;
  year: any;
  month: string;
  filterby: string;
  filtervalue: string;
  dataset: any;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.year = JSON.parse(localStorage.getItem("checkyear"));
    this.month = localStorage.getItem("checkmonth");
    this.filterby = localStorage.getItem("checkfilter");
    this.filtervalue = localStorage.getItem("checkfilterby");
    debugger;
    var json = 
    {
      "mode": 5,
      "month": this.month,
      "year": this.year,
      "filterby": this.filterby,
      "property": this.filtervalue
    };
    this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
      debugger;
      this.dataset = res.result;
      this.dataset.forEach(element => { 
        debugger;
        let date1 =  moment.tz(element.gintime, "HH:mm:ss").local();
        let date2 =  moment.tz(element.gouttime, "HH:mm:ss").local();
        var x = moment.duration(date1.diff(date2)).asHours();
        /* element.tothr = moment.duration(moment(element.gintime, "HH:mm:ss").diff(moment(element.gouttime, "HH:mm:ss"))).asMinutes() / 60;
        element.totkm  = parseInt(parseInt(element.ginkm) === NaN ? 0 : element.ginkm) - parseInt(parseInt(element.goutkm) === NaN ? 0 : element.goutkm); */
        element.tothr = element.hourdiff;
        element.totkm  = element.kmdiff;
        element.outs = isNaN(parseInt(element.outstation)) ? 0 : parseInt(element.outstation);
      });
      this.dataSource = new MatTableDataSource(res.result);
    });
    
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
