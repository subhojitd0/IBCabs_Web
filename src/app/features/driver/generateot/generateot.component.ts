import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {BILL_CNN_API, BILL_ONCALL_COAL_INDIA_API, BILL_ONCALL_EXTRA_API, BILL_RELIANCE_API, EXTRA_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_DRIVER_OT, ROUTE_OWNER, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS } from 'src/shared/constants/constant';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface inewbill {
  party: string,
  from: string,
  to: string,
  nightstart: string,
  nightend: string,
  gsttype: string,
  parkinggst: string,
  format: string,
  reportto: string,
  subject: string,
  mode: string,
  driver: string
}

export class newbill implements inewbill{
  party: string;
  from: string;
  to: string;
  nightstart: string;
  nightend: string;
  gsttype: string;
  parkinggst: string;
  format: string;
  reportto: string;
  subject: string;
  mode: string;
  driver: string;
}
@Component({
  selector: 'app-generateot',
  templateUrl: './generateot.component.html',
  styleUrls: ['./generateot.component.css']
})
export class GenerateOTComponent implements OnInit {
  newbillDet : any;
  allparties: any;
  billDetails: newbill;
  partyselect: FormControl;
  reportselect: FormControl;
  partylist: Observable<string[]>;
  filteredOptionsDriver: Observable<any[]>;
  reportlist: Observable<string[]>;
  partynames: any;
  reportnames: any;
  allreports: any;
  loading: boolean;
  alldrivers: any;
  DriverControl: FormControl;
  alldrivernames: any;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.billDetails = new newbill();
    debugger;
    //this.ownerid = JSON.parse(localStorage.getItem('selectedownerid'));
    /* if(this.ownerid.toString() != "0"){
      var json = 
      {
        "mode":4,
        "ownercode": this.ownerid
      } 
      this.apiService.post(OWNER_API, json).then((res: any)=>{ 
        if(res.hasOwnProperty('error')){
          this.toastr.error("You cannot edit the selected owner", "Error");
          location.reload();
        }
        else{
          this.ownerDetails = res;
          this.ownerDetails.mode = 2;
        }
      });
    }
    else{
      localStorage.setItem('selectedownerid', "0");
    } */
   }
   ngOnInit() : void {
    this.DriverControl = new FormControl();
    this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
    this.alldrivernames = this.alldrivers.map(x=>x.drivername);
    this.filteredOptionsDriver = this.DriverControl.valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
   }
  
  public _filterDriver(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alldrivernames.filter(client => client.toString().toLowerCase().includes(filterValue));
  }
  generateBill(){
    debugger;
    let redirectApi = ROUTE_DRIVER_OT;
    this.toastr.info("Please wait while we are generating your bill",'Information');
    localStorage.setItem("driver", this.billDetails.driver);
    localStorage.setItem("driverfrom", this.billDetails.from);
    localStorage.setItem("driverto", this.billDetails.to);
    this.toastr.success("Your bill was successfully created",'Success');
    debugger;
    this.router.navigate([]).then(result => {  window.open('/' + redirectApi, '_blank'); });
  }

}
