import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {DRIVER_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_DASHBOARD } from 'src/shared/constants/constant';
import { GenerateOTComponent } from './generateot/generateot.component';

export interface Driver {
  drivercode: string;
  drivername: string;
  license: string;
  licenseExpiry: string;
  option: string;
}

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['drivercode', 'drivername', 'license', 'licenseExpiry', 'option'];
  dataSource: MatTableDataSource<Driver>;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    /* const party: PartyHead[] =[
      {position: 1, name: 'Hydrogen', rate: "Package", option: 'H'},
      {position: 2, name: 'Helium', rate: "Package", option: 'He'},
      {position: 3, name: 'Lithium', rate: "Package", option: 'Li'},
      {position: 4, name: 'Beryllium', rate: "-", option: 'Be'},
      {position: 5, name: 'Boron', rate: "Package", option: 'B'},
      {position: 6, name: 'Carbon', rate: "-", option: 'C'},
      {position: 7, name: 'Nitrogen', rate: "Package", option: 'N'},
      {position: 8, name: 'Oxygen', rate: "Slab", option: 'O'},
      {position: 9, name: 'Fluorine', rate: "Slab", option: 'F'},
      {position: 10, name: 'Neon', rate: "Package", option: 'Ne'},
    ];
    this.dataSource = new MatTableDataSource(party); */
   }
   ngOnInit() : void {
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
      debugger;
      const party: Driver[] = res.result;
      this.dataSource = new MatTableDataSource(party);
    });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  openOTDialog(id: any) {
    const dialogRef = this.dialog.open(GenerateOTComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  openDialog(id: any) {
    localStorage.setItem('selecteddriverid', id);
    const dialogRef = this.dialog.open(AddDriverComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  deleteDriver(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "drivercode": id
      }
      this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
}
