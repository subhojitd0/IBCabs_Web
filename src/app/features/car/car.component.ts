import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {CAR_API, RATE_SLAB_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddCarComponent } from './add-new-car/add-car.component';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_OWNER } from 'src/shared/constants/constant';

export interface Car {
  carcode: string;
  carno: string;
  option: string;
  cartype: string;
}

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  ownerid: string;
  ownername: string;
  carid: string = "0";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['carno', 'cartype', 'option'];
  dataSource: MatTableDataSource<Car>;
  constructor(private router: Router, private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    this.ownername = localStorage.getItem('selectedownername'); 
  }
   ngOnInit() : void {
     debugger;
    this.ownerid = JSON.parse(localStorage.getItem('selectedownerid'));
    if(this.ownerid && this.ownerid != "0"){
      var json = 
      {
        "mode": 0,
        "ownercode": this.ownerid 
      };
      this.apiService.post(CAR_API, json).then((res: any)=>{ 
        debugger;
        const cars: Car[] = res.result;
        let i = 0;
        this.dataSource = new MatTableDataSource(cars);
      });
    }
   }
   backtoowner(){
    this.router.navigateByUrl('/' + ROUTE_OWNER);
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  deleteCar(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "carcode": id
      }
      this.apiService.post(CAR_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully deleted",'Success');
        this.router.navigateByUrl('/' + ROUTE_CAR);
      });
    }
  }
  opendialog(id: any){
    localStorage.setItem('selectedcarid', id );
    const dialogRef = this.dialog.open(AddCarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
  }
}
