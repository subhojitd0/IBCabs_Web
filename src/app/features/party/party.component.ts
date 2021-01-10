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
    this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
      debugger;
      const party: PartyHead[] = res.result;
      this.dataSource = new MatTableDataSource(party);
      localStorage.setItem("allparties", JSON.stringify(res.result));
    });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
        this.toastr.success("Your data was successfully saved",'Success');
        this.router.navigateByUrl('/' + ROUTE_PARTY);
      });
    }
  }
}
