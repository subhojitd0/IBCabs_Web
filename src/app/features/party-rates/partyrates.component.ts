import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {RATE_SLAB_API} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddSlabComponent } from './add-new-slab/add-slab-head.component';

export interface RateHead {
  slabcode: string;
  ratetype: string;
  option: string;
  slab1: string;
  slab2: string;
  slab3: string;
  slabrest: string;
  car: string;
}

@Component({
  selector: 'app-partyrates',
  templateUrl: './partyrates.component.html',
  styleUrls: ['./partyrates.component.css']
})
export class PartyRatesComponent implements OnInit {
  partyheadid: string;
  partyheadname: string;
  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['car', 'slab1', 'slab2', 'slab3', 'slabrest', 'option'];
  dataSource: MatTableDataSource<RateHead>;
  constructor(private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    this.partyheadname = localStorage.getItem('selectedpartyheadname'); 
  }
   ngOnInit() : void {
     debugger;
    this.partyheadid = JSON.parse(localStorage.getItem('selectedpartyheadid'));
    if(this.partyheadid && this.partyheadid != "0"){
      var json = 
      {
        "mode": 0,
        "partyheadcode": this.partyheadid 
      };
      this.apiService.post(RATE_SLAB_API, json).then((res: any)=>{ 
        debugger;
        const rates: RateHead[] = res;
        let i = 0;
        res.forEach((x) => {
          rates[i].slab1 = x.onekm + "/" + x.onekmrate + " - " + x.onehr + "/" + x.onehrrate;
          rates[i].slab2 = x.twokm + "/" + x.twokmrate + " - " + x.twohr + "/" + x.twohrrate;
          rates[i].slab3 = x.threekm + "/" + x.threekmrate + " - " + x.threehr + "/" + x.threehrrate;
          rates[i].slabrest = x.restkmrate + " - " + x.resthrrate;
          i++;
        })
        this.dataSource = new MatTableDataSource(rates);
      });
    }
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  deleteRate(id: any){
    debugger;
    var json = 
    {
      "mode":3,
      "slabcode": id
    }
    this.apiService.post(RATE_SLAB_API, json).then((res: any)=>{ 
      this.toastr.success("Youe data was successfully deleted",'Success');
      location.reload();
    });
  }
  opendialog(){
    localStorage.setItem('selectedpartyheadid', this.partyheadid );
    const dialogRef = this.dialog.open(AddSlabComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
  }
}
