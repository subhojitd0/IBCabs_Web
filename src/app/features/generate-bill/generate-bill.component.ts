import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {BILL_API, OWNER_API, PARTY_HEAD_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_OWNER } from 'src/shared/constants/constant';
import { NewBillComponent } from './NewBill/newbill.component';
import { AdvancedBillComponent } from './AdvancedBill/advancedbill.component';

export interface BillRegister {
  billid: string;
  billnumber: string;
  billfrom: string;
  billto: number;
  billdate: string;
  party: string;
  path: string;
  option: string;
}

@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css']
})
export class GenarateBillComponent implements OnInit {

  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['billid', 'billnumber', 'party', 'billfrom', 'billto', 'billdate', 'option'];
  dataSource: MatTableDataSource<BillRegister>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
     debugger;
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(BILL_API, json).then((res: any)=>{ 
      debugger;
      const billReg: BillRegister[] = res.result;
      this.dataSource = new MatTableDataSource(billReg);
    });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  downloadBill(billid: any){

  }
  deleteBill(billid: any){
    
  }
  openDialog(id: any) {
    const dialogRef = this.dialog.open(NewBillComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  openAdvancedDialog(id: any){
    const dialogRef = this.dialog.open(AdvancedBillComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  /* deleteOwner(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "ownerccode": id
      }
      this.apiService.post(OWNER_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  } */
}