import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {PARTY_HEAD_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { AddPartyHeadComponent } from './add-party-head/add-party-head.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_PARTY } from 'src/shared/constants/constant';

export interface PartyHead {
  name: string;
  headcode: number;
  ratetype: string;
  option: string;
  master: string;
  isApproved: string;
}

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {

  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['headcode', 'name', 'ratetype', 'option'];
  dataSource: MatTableDataSource<PartyHead>;
  userRole: string;
  partyrole: string;
  approve: string;
  delete: string;
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
    localStorage.setItem('partycopy', '0');
    this.partyrole = localStorage.getItem("enterparty");
    this.approve = localStorage.getItem("approve");
    this.delete = localStorage.getItem("delete");
    this.userRole = localStorage.getItem("userrole");
    var json = 
    {
      "mode": 0
    };
    this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
      debugger;
      let party: PartyHead[] = res.result;
      /* if(this.userRole === '2'){
        party = party.filter(x=>x.isApproved === '1');
      } */
      this.dataSource = new MatTableDataSource(party);
      localStorage.setItem("allparties", JSON.stringify(res.result));
    });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  approveParty(id: any){
    var r = confirm("Are you sure that you want to approve this party ?");
    if (r == true) {
    var json = 
      {
        "mode":5,
        "partyheadcode": id,
        "isApproved": 1
      }
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        if(res.isApproved === '1'){
          this.toastr.success("Your data was successfully approved",'Success');
          location.reload();
        }
      });
    }
  }
  selectPack(){
    this.isPack=true
    this.isSlab=false
  }

  selectSlab(){
    this.isSlab=true
    this.isPack=false
  }
  openDialog(id: any) {
    localStorage.setItem('selectedpartyheadid', id);
    const dialogRef = this.dialog.open(AddPartyHeadComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  copyParty(id: any, type: any){
    var r = confirm("Are you sure that you want to copy this party to create a new party ? This will make the current party end date to today");
    if (r == true) {
      if(type === "Package"){
        this.editPackageWise(id);
      }
      else{
        this.editSlabWise(id);
      }
    }
  }
  editSlabWise(id: any){
    var json = 
      {
        "mode":4,
        "partyheadcode": id
      } 
      localStorage.setItem('selectedpartyheadid', id);
      localStorage.setItem('partycopy', '1');
      const dialogRef = this.dialog.open(AddPartyHeadComponent);

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog closed`);
      });
      this.router.events.subscribe(() => {
        dialogRef.close();
      });

  }
  editPackageWise(id: any){
    var json = 
    {
      "mode":4,
      "partyheadcode": id
    } 
    this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
      if(res.hasOwnProperty('error')){
        this.toastr.error("You cannot edit the selected party", "Error");
        location.reload();
      }
      else{
        let partyheaddetails = res;
        partyheaddetails.mode = 2;
        partyheaddetails.starttime = partyheaddetails.starttime.substr(0,5);
        partyheaddetails.endtime = partyheaddetails.endtime.substr(0,5);
        partyheaddetails.partyheadid = id;
        let dateT = new Date();
        let newDate = new Date(dateT.setDate(dateT.getDate()-1)).toLocaleDateString();
        partyheaddetails.todate = newDate.split('/')[2] + "-" + newDate.split('/')[1] + "-" + newDate.split('/')[0];
        this.toastr.info("Please wait while we are saving your data",'Information');
        this.apiService.post(PARTY_HEAD_API, partyheaddetails).then((res: any)=>{ 
          this.toastr.success("Your data was successfully edited",'Success');
          localStorage.setItem('selectedpartyheadid', id);
          localStorage.setItem('partycopy', '1');
          const dialogRef = this.dialog.open(AddPartyHeadComponent);

          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog closed`);
          });
          this.router.events.subscribe(() => {
            dialogRef.close();
          });
        });
      }
    });
  }
  deleteParty(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "partyheadcode": id
      }
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        if(res.status === "Deleted"){
        this.toastr.success("Your data was successfully deleted",'Success');
        location.reload();
        }
        else{
          this.toastr.error(res.status);
        }
      });
    }
  }
}
