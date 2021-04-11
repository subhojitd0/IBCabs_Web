import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {ALL_USER_API, CAR_API, DELETE_USER_API, NEW_USER_API, RATE_SLAB_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_NEW_USER, ROUTE_OWNER } from 'src/shared/constants/constant';

export interface User {
  username: string;
  name: string;
  role: string;
  option: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  ownerid: string;
  ownername: string;
  carid: string = "0";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['name', 'username', 'role', 'option'];
  dataSource: MatTableDataSource<User>;
  username: any;
  password: any;
  role: any;
  name: any;
  userrole: string;
  constructor(private router: Router, private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    /* this.ownername = localStorage.getItem('selectedownername');  */
  }
   ngOnInit() : void {
     this.userrole = sessionStorage.getItem("userrole");
     debugger;
     this.role = "2";
     let json ={
       "user": "ALL"
     };
     this.apiService.post(ALL_USER_API, json).then((res: any)=>{ 
      debugger;
      const users: User[] = res.result;
      let i = 0;
      users.forEach((data: any)=>{
        data.role = data.role === "1" ? "Admin User" : data.role === "2" ? "Edit User" : data.role === "3" ? "Edit / Delete User" : "";
      })
      this.dataSource = new MatTableDataSource(users);
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
   deleteUser(name: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "username": name
      }
      this.apiService.post(DELETE_USER_API, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully deleted",'Success');
        this.router.navigateByUrl('/' + ROUTE_NEW_USER);
      });
    }
   }
   addUser(){
     if(this.username && this.password && this.name && this.role){
     let json= {
       "username": this.username,
       "password": this.password,
       "name": this.name,
       "role": this.role
     }
     this.apiService.post(NEW_USER_API, json).then((res: any)=>{ 
      debugger;
      if(res.status === "success"){
        this.toastr.success("User creation was successful");
        this.username = "";
        this.password = "";
        this.name = "";
        this.router.navigateByUrl('/' + ROUTE_NEW_USER);
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
