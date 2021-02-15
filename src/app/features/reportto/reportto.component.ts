import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {OWNER_API, PARTY_HEAD_API, REPORT_TO_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_OWNER } from 'src/shared/constants/constant';

export interface iReportTo {
    reportcode: string;
    mode: string;
    report: string;
    contact:string;
    option: string;
}
export class ReportTo implements iReportTo {
    reportcode: string;
    mode: string;
    report: string;
    contact:string;
    option: string;
}
@Component({
  selector: 'app-reportto',
  templateUrl: './reportto.component.html',
  styleUrls: ['./reportto.component.css']
})
export class ReportToComponent implements OnInit {
  reportto: ReportTo = new ReportTo();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['report', 'contact', 'option'];
  dataSource: MatTableDataSource<ReportTo>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(REPORT_TO_API, json).then((res: any)=>{ 
      debugger;
      const result: ReportTo[] = res.result;
      this.dataSource = new MatTableDataSource(result);
    });
   }
   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  addReportto(){
      this.reportto.mode = "1";
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(REPORT_TO_API, this.reportto).then((res: any)=>{ 
      this.toastr.success("Your data was successfully saved",'Success');
      location.reload();
    });
  }
  
  deleteReportto(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "reportcode": id
      }
      this.apiService.post(REPORT_TO_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
}
