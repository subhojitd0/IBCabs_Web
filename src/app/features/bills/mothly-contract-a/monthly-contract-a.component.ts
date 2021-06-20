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
  selector: 'app-monthly-contract-a',
  templateUrl: './monthly-contract-a.component.html',
  styleUrls: ['./monthly-contract-a.component.css']
})
export class MonthlyContractAComponent implements OnInit {
  billno: any;
  billdate: any;
  billdetails: any;
  amountInWord: any;
  gsttype: any;
  billfrom: any;
  billto: any;
  contractAmount: any;
  isConfirmVisible: any = true;
  igstAmount: any;
  cgstAmount: any;
  sgstAmount: any;
  totalwithgst: any;
  allParties: any;
  party: any;
  igstpercentage: any;
  cgstpercentage: any;
  sgstpercentage: any;
  partydetails: any;
  billt: Date;
  billf: Date;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    //this.billdetails = JSON.parse(localStorage.getItem("billdata"));
    this.allParties = JSON.parse(localStorage.getItem("allparties"));
    this.party = localStorage.getItem("billparty");
    this.billfrom = localStorage.getItem("billfrom");
    this.billto = localStorage.getItem("billto");
    this.gsttype = localStorage.getItem("billgst");
    debugger;
    this.billf=new Date(this.billfrom);
    this.billt=new Date(this.billto);


    let det = this.allParties.filter(x=>x.name === this.party)[0];
    if(det){
      var json =
      {
        "mode": 4,
        "partyheadcode": det.headcode
      }
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        this.partydetails = res;
        this.contractAmount = res.package;
        if(this.gsttype === "0"){
          this.igstpercentage = "0";
          this.cgstpercentage = "2.5";
          this.sgstpercentage = "2.5";
          this.igstAmount = "0";
          let gst = ( 2.5 * parseFloat(this.contractAmount)) / 100;
          this.cgstAmount = gst.toString();
          this.sgstAmount = gst.toString();
          this.totalwithgst = parseFloat(this.contractAmount) + gst + gst;
        }
        else{
          this.igstpercentage = "5";
          this.cgstpercentage = "0";
          this.sgstpercentage = "0";
          this.cgstAmount = "0";
          this.sgstAmount = "0";
          let gst = ( 5 * parseFloat(this.contractAmount)) / 100;
          this.igstAmount = gst.toString();
          this.totalwithgst = parseFloat(this.contractAmount) + gst;
        }
        let index = this.contractAmount.toString().indexOf('.');
        let substringVal = this.contractAmount;
        if(index > 0)
            substringVal = this.contractAmount.toString().substr(0, index);
        substringVal = substringVal.toString().replace(',','');
        this.amountInWord = this.apiService.convertAmountToWord(substringVal);
      });
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
      if(this.billno){
        this.router.navigateByUrl('/' + ROUTE_GENERATE_BILL);
      }
    }); 
  }
}
