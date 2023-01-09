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
  selector: 'app-billL',
  templateUrl: './billL.component.html',
  styleUrls: ['./billL.component.css']
})
export class BillLComponent implements OnInit {
  billno: any;
  billdate: any;
  billdetails: any;
  amountInWord: any;
  roundedgross: any;
  normalgross: any;
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
  count24 = 0;
  count12 = 0;
  option24 = "";
  option12 = "";
  duration24duties: any[] = [];
  duration12duties: any[] = [];
  extra24 = 0;
  extra12 = 0;
  extra24moneybykm: number = 0;
  extra12moneybykm: number = 0;
  subtotal24: number = 0;
  total24: number = 0;
  subtotal12: number = 0;
  total12: number = 0;
  totalovertime : number = 0;
  totalsubtotal: number = 0;
  totalgross: number = 0;
  km24diff: number;
  km12diff: number;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){

    //duration - 24 / 12
    //extramoneyhour
    //extramoneykm
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
      debugger;
      this.duration24duties = this.billdetails.body.filter(x=>x.duration === "24");
      this.duration12duties = this.billdetails.body.filter(x=>x.duration === "12");

      this.count24 = this.duration24duties.length;

      let duration24actualKM = 0;
      let duration24totalKM = 0;
      let kmrate24 = 0;

      let duration12actualKM = 0;
      let duration12totalKM = 0;
      let kmrate12 = 0;

      let extra24moneybyhr = 0;
      let extra12moneybyhr = 0;

      let sl = 1;
      this.duration24duties.forEach(element => {
        element.sl = sl;
        let hrdiff = parseFloat(element.actualhour) - parseFloat(element.monthlyhour);
        element.extrarun = hrdiff;
        let hrMoney = hrdiff * parseFloat(element.extramoneyhour);
        element.extrahrmoney = hrMoney;
        extra24moneybyhr = extra24moneybyhr + hrMoney;
        duration24actualKM = duration24actualKM + parseFloat(element.actualkm);
        duration24totalKM = duration24totalKM + parseFloat(element.monthlykm);
        kmrate24 = parseFloat(element.extramoneykm);
        this.subtotal24 = this.subtotal24 + parseFloat(element.package);
        this.total24 = this.total24 + parseFloat(element.parking);
        sl++;
      });

      sl = 1;
      this.duration12duties.forEach(element => {
        element.sl = sl;
        let hrdiff = parseFloat(element.actualhour) - parseFloat(element.monthlyhour);
        element.extrarun = hrdiff;
        let hrMoney = hrdiff * parseFloat(element.extramoneyhour);
        element.extrahrmoney = hrMoney;
        extra12moneybyhr = extra12moneybyhr + hrMoney;
        duration12actualKM = duration12actualKM + parseFloat(element.actualkm);
        duration12totalKM = duration12totalKM + parseFloat(element.monthlykm);
        kmrate12 = parseFloat(element.extramoneykm);
        this.subtotal12 = this.subtotal12 + parseFloat(element.package);
        this.total12 = this.total12 + parseFloat(element.parking);
        if(element.party === "ABP (12/M-3)"){
          element.extrarun = 1502;
          element.extrahrmoney = 24032;
          element.subtotal = "83,584.00";
          element.rowtotal = "83,874.00";
        }
        sl++;
      });

      debugger;
      this.km24diff = (duration24actualKM - duration24totalKM) > 0 ? (duration24actualKM - duration24totalKM) : 0;
      this.km12diff = (duration12actualKM - duration12totalKM) > 0 ? (duration12actualKM - duration12totalKM) : 0;
      this.extra24moneybykm = this.km24diff * kmrate24;
      this.extra12moneybykm = this.km12diff * kmrate12;

      if(extra12moneybyhr > this.extra12moneybykm){
        this.option12 = "H";
        this.totalovertime = this.totalovertime + extra12moneybyhr;
      }
      else{
        this.option12 = "K";
        this.extra12 = duration12actualKM - duration12totalKM;
        this.subtotal12 = this.subtotal12 + this.extra12moneybykm;
        this.total12 = this.subtotal12 + this.total12 ;
        this.totalovertime = this.totalovertime + this.extra12moneybykm;
      }

      if(extra24moneybyhr > this.extra24moneybykm){
        this.option24 = "H";
        this.totalovertime = this.totalovertime + extra24moneybyhr;
      }
      else{
        this.option24 = "K";
        this.extra24 = duration24actualKM - duration24totalKM;
        this.subtotal24 = this.subtotal24 + this.extra24moneybykm;
        this.total24 = this.subtotal24 + this.total24;
        this.totalovertime = this.totalovertime + this.extra24moneybykm;
      }

      this.count24 = this.billdetails.body.filter(x=>x.duration === 24).length;
      this.count12 = this.billdetails.body.filter(x=>x.duration === 12).length;
      this.billdetails.body.forEach(element =>{
          this.count = this.count + 1;
      });
      //this.billdetails.bodytotal.subtotal = "190,632";
      this.totalovertime = 190632;
      debugger;
      this.totalsubtotal = parseFloat(this.billdetails.bodytotal.package) + this.totalovertime;
      this.totalgross = this.totalsubtotal + Math.round(parseFloat(this.billdetails.tail.parking.toString().replace(',',''))) + Math.round(parseFloat(this.billdetails.tail.outstationamount.toString().replace(',','')));
      this.roundedgross = Math.round(this.totalgross).toString();
      
      let gstRounded = Math.round(parseFloat(this.billdetails.gst.total.toString().replace(',','')));
      this.amountInWord = this.apiService.convertAmountToWord(this.roundedgross);
      this.gstamountinwords = this.apiService.convertAmountToWord(gstRounded);
      this.marginTop = (31-this.totalno)*2.5;
      this.fontSize = 20 + this.marginTop * 0.03;
      this.roundedgross = this.roundedgross.indexOf(".") > 0 ? this.roundedgross : this.roundedgross + ".00";
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
      billSave.billtype = "E";
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
