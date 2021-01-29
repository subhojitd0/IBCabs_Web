import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ROUTE_CAR, ROUTE_OWNER } from 'src/shared/constants/constant';

export interface Owner {
  sl: string;
  dutydate: number;
  carno: string;
  hour: string;
  km: number;
  parking: string;
}

@Component({
  selector: 'app-monthly-a',
  templateUrl: './monthly-a.component.html',
  styleUrls: ['./monthly-a.component.css']
})
export class MonthlyBillAComponent implements OnInit {
  billdetails: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sl', 'dutydate', 'carno', 'hour', 'km', 'parking'];
  dataSource: MatTableDataSource<Owner>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit(){
    this.billdetails = JSON.parse(localStorage  .getItem("billdata"));
    debugger;
    if(this.billdetails){
      this.dataSource = new MatTableDataSource(this.billdetails.body);
    }
    
   }
   exportAsPDF(div_id)
  {
    let data = document.getElementById(div_id);  
    html2canvas(data).then(canvas => {
      var margin = 15;
      var imgWidth = 210 - 2*margin; 
      var pageHeight = 295 + 2*margin;  
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
    }); 
  }
}
