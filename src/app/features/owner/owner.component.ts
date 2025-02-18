import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {OWNER_API, PARTY_HEAD_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { AddOwnerComponent } from './add-owner/add-owner.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_OWNER } from 'src/shared/constants/constant';

export interface Owner {
  ownercode: string;
  ownername: number;
  assignedcar: string;
  option: string;
  isApproved: string;
}

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['ownercode', 'ownername', 'assignedcar', 'option'];
  dataSource: MatTableDataSource<Owner>;
  userRole: string;
  ownerrole: string;
  approve: string;
  delete: string;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    this.ownerrole = localStorage.getItem("enterowner");
    this.approve = localStorage.getItem("approve");
    this.delete = localStorage.getItem("delete");
    this.userRole = localStorage.getItem("userrole");
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(OWNER_API, json).then((res: any)=>{ 
      debugger;
      let owner: Owner[] = res.result;
      /* if(this.userRole === '2'){
        owner = owner.filter(x=>x.isApproved === '1');
      } */
      this.dataSource = new MatTableDataSource(owner);
    });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  openCar(id: any){
    localStorage.setItem('selectedownerid', id);
    localStorage.setItem('selectedownername', id);
    this.router.navigateByUrl('/' + ROUTE_CAR);
  }
  openDialog(id: any) {
    localStorage.setItem('selectedownerid', id);
    const dialogRef = this.dialog.open(AddOwnerComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  approveOwner(id: any){
    var r = confirm("Are you sure that you want to approve this owner ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":5,
        "ownercode": id,
        "isApproved": 1
      }
      this.apiService.post(OWNER_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully approved",'Success');
        location.reload();
      });
    }
  }
  deleteOwner(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "ownercode": id
      }
      this.apiService.post(OWNER_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
}
