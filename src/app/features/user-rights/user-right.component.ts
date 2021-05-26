import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {ALL_USER_API, OWNER_API, PARTY_HEAD_API, UPDATE_USER_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_CAR, ROUTE_NEW_USER, ROUTE_OWNER } from 'src/shared/constants/constant';
import {startWith, map} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

export interface IUserRight {
  userid: string;
  username: string;
  approve: number;
  delete: number;
  createbill: number;
  enterddr: number;
  enterowner: number;
  enterparty: number;
  ownerpay: number;
}

export class UserRight implements IUserRight {
  userid: string;
  username: string;
  approve: number;
  delete: number;
  createbill: number;
  enterddr: number;
  enterowner: number;
  enterparty: number;
  ownerpay: number; 
}

@Component({
  selector: 'app-user-right',
  templateUrl: './user-right.component.html',
  styleUrls: ['./user-right.component.css']
})
export class UserRightComponent implements OnInit {

  userRole: string;
  users: string[];
  showRights: boolean = false;
  selectedUser: any;
  userList: UserRight[];
  updateUser: any;
  userselect: FormControl;
  userddr: any;
  constructor(private router: Router,private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    this.userselect = new FormControl();
    this.userRole = localStorage.getItem("userrole");
    var json = 
    {
      
    };
    this.apiService.post(ALL_USER_API, json).then((res: any)=>{ 
      debugger;
      this.userList = res.result;
      /* if(this.userRole === '2'){
        owner = owner.filter(x=>x.isApproved === '1');
      } */
      this.users = this.userList.filter(y=>y.username !== "ibcabs").map(x=>x.username);
      this.userddr = this.userselect.valueChanges.pipe(startWith(''),map(value => this._filterUser(value)));
    });
   }
   public _filterUser(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(client => client.toLowerCase().includes(filterValue));
  }
   selectUser(){
     if(this.selectedUser){
       this.showRights = true;
       this.updateUser = this.userList.filter(x=>x.username === this.selectedUser)[0];
       this.updateUser.ownerpay = this.updateUser.payowner;
     }
   }
   createUser(){
    this.router.navigateByUrl('/' + ROUTE_NEW_USER);
   }
   changeApprove(val: any){
    this.updateUser.approve = val;
   }
   changeDelete(val: any){
    this.updateUser.delete = val;
   }
   changeCreateBill(val: any){
    this.updateUser.createbill = val;
   }
   changeEnterDdr(val: any){
    this.updateUser.enterddr = val;
   }
   changeEnterOwner(val: any){
    this.updateUser.enterowner = val;
   }
   changeEnterParty(val: any){
    this.updateUser.enterparty = val;
   }
   changePayOwner(val: any){
    this.updateUser.ownerpay = val;
   }
  updateUserInfo(){
    debugger;
    this.apiService.post(UPDATE_USER_API, this.updateUser).then((res: any)=>{ 
      this.toastr.success("Your data was successfully updated",'Success');
      location.reload();
    });
  }
}
