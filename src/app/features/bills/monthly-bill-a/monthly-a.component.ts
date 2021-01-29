import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_OWNER } from 'src/shared/constants/constant';

export interface Owner {
  ownercode: string;
  ownername: number;
  assignedcar: string;
  option: string;
}

@Component({
  selector: 'app-monthly-a',
  templateUrl: './monthly-a.component.html',
  styleUrls: ['./monthly-a.component.css']
})
export class MonthlyBillAComponent implements OnInit {

  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ownercode', 'ownername', 'assignedcar'];
  dataSource: MatTableDataSource<Owner>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(OWNER_API, json).then((res: any)=>{ 
      debugger;
      const owner: Owner[] = res.result;
      this.dataSource = new MatTableDataSource(owner);
    });
   }
 
}
