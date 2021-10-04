import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../shared/services/service';
import {VENDOR_RATE} from '../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddVendorSlabComponent } from './add-new-slab/add-slab-head.component';
import { Router } from '@angular/router';
import { ROUTE_OWNER, ROUTE_PARTY, ROUTE_RATE } from 'src/shared/constants/constant';

export interface RateHead {
  ratecode: string;
  ownercode: string;
  party: string;
  package: string;
  hourrate: string;
  kmrate: string;
  hrkm: string;
  parking: string;
  outstation : string;
}

@Component({
  selector: 'app-vendorrates',
  templateUrl: './vendorrates.component.html',
  styleUrls: ['./vendorrates.component.css']
})
export class VendorRatesComponent implements OnInit {
  partyheadid: string;
  partyheadname: string;
  isPack:boolean=true;
  isSlab:boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['car', 'cartype', 'carnum', 'slab1', 'slab2', 'slabrest', 'datespan','option'];
  dataSource: MatTableDataSource<RateHead>;
  ownerid: any;
  constructor(private router: Router, private apiService: ApiService, public dialog: MatDialog, private toastr: ToastrService) {
    this.partyheadname = localStorage.getItem('selectedvendorname'); 
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
      this.apiService.post(VENDOR_RATE, json).then((res: any)=>{ 
        debugger;
        const rates: RateHead[] = res;
        let i = 0;
        res.forEach((x) => {
          rates[i].parking = x.parking === "1" ? "Yes" : "No";
          rates[i].outstation = x.outstation;
          rates[i].hrkm= x.hrkm === "1" ? "Hr OR KM" : x.hrkm === "2" ? "HR AND KM" : "No";
          i++;
        }) 
        this.dataSource = new MatTableDataSource(rates);
      });
    }
   }
   backtopartyhead(){
    this.router.navigateByUrl('/' + ROUTE_OWNER);
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  deleteRate(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "ratecode": id
      }
      this.apiService.post(VENDOR_RATE, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully deleted",'Success');
        location.reload();
      });
    }
  }
  opendialog(id: any){
    localStorage.setItem('selectedrateid', id );
    localStorage.setItem('selectedownerid', this.ownerid );
    const dialogRef = this.dialog.open(AddVendorSlabComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    });
  }
}
