import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {ALL_USER_API, CAR_API, DELETE_USER_API, MATADOR_API, NEW_USER_API, RATE_SLAB_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_NEW_USER, ROUTE_OWNER } from 'src/shared/constants/constant';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface User {
  packageid: string;
  carno: string;
  dutydate: string;
  rate: string;
}

@Component({
  selector: 'app-matador',
  templateUrl: './matador.component.html',
  styleUrls: ['./matador.component.css']
})
export class MatadorComponent implements OnInit {
  ownerid: string;
  ownername: string;
  carid: string = "0";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['date', 'carno', 'rate', 'option'];
  dataSource: MatTableDataSource<User>;
  username: any;
  password: any;
  role: any;
  name: any;
  userrole: string;
  carselect: FormControl;
  carlist: Observable<string[]>;
  allcarno: any;
  allcars: any;
  constructor(private router: Router, private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    /* this.ownername = localStorage.getItem('selectedownername');  */
    this.carselect = new FormControl();
  }
   ngOnInit() : void {
    this.allcars = JSON.parse(localStorage.getItem('allcars'));
    this.allcarno = this.allcars.map(x=>x.carno);
     this.userrole = localStorage.getItem("loggedinuser");
     debugger;
     this.role = "2";
     let json ={
       "mode": "0"
     };
     
     this.apiService.post(MATADOR_API, json).then((res: any)=>{ 
      debugger;
      const users: User[] = res.result;
      /* let i = 0;
      users.forEach((data: any)=>{
        data.role = data.username === "ibcabs" ? "Admin User" : "Normal User";
      }) */
      this.dataSource = new MatTableDataSource(users);
      this.carlist = this.carselect.valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
     /*  this.name = "";
     this.password = ""; */
    });
    /* this.ownerid = JSON.parse(localStorage.getItem('selectedownerid'));
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
    } */
   }
   public _filterCar(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcarno.filter(client => client.toLowerCase().includes(filterValue));
  }
   onChangeFilterVal(val){
    this.username = val.option.value;
   }
   deleteUser(name: any){
    /* var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "username": name
      }
      this.apiService.post(DELETE_USER_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully deleted",'Success');
        window.location.reload();
      });
    } */
   }
   addUser(){
     if(this.username && this.password && this.name ){
     let json= {
       "dutydate": this.name,
       "carno": this.username,
       "rate": this.password.toString(),
       "mode": "1"
     }
     this.apiService.post(MATADOR_API, json).then((res: any)=>{ 
      debugger;
      if(res.status === "success"){
        /* this.toastr.success("User creation was successful");
        this.username = "";
        this.password = "";
        this.name = ""; */
        debugger;
        window.location.reload();
      }
    });
  }
  else{
    this.toastr.error("Please fill all the fields before saving your data");
  }
   }
   /* backtoowner(){
    this.router.navigateByUrl('/' + ROUTE_OWNER);
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  } */
  /* deleteCar(id: any){
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
  } */
}
