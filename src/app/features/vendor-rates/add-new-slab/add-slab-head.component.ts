import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import { RATE_SLAB_API, VENDOR_RATE} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { ROUTE_RATE } from 'src/shared/constants/constant';
import { Router } from '@angular/router';

export interface ISlabDetails {
  mode: number;
  ownercode: string;
  party: string;  
  package: string;
  hourrate: string;
  kmrate: string;
  hrkm: string;
  parking: string;
  outstation: string;
  ownername: string;
  cartype: string;
  fromdate: string;
  todate: string;
  grg: string;
}
export class SlabDetails implements ISlabDetails {
  mode: number;
  ownercode: string;
  party: string;  
  package: string;
  hourrate: string;
  kmrate: string;
  hrkm: string;
  parking: string;
  outstation: string = "0";
  ownername: string;
  cartype: string;
  fromdate: string;
  todate: string;
  carnum: string;
  grg: string;
}

@Component({
  selector: 'app-add-slab-head',
  templateUrl: './add-slab-head.component.html',
  styleUrls: ['./add-slab-head.component.css']
})
export class AddVendorSlabComponent implements OnInit {
  partyheadid : any;
  slabdetails: SlabDetails;
  cartypes: any;
  allcartype: any;
  allcars: any;
  allcarno: any;
  allparties: any;
  partynames: any;
  ratecode: string;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    let vedorname = localStorage.getItem('selectedvendorname'); 
    this.ratecode = localStorage.getItem('selectedrateid');
    let vendorcode = localStorage.getItem('selectedownerid');
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.partynames = this.allparties.map(x=>x.name);
    this.slabdetails = new SlabDetails();
    this.slabdetails.ownername = vedorname;
    this.slabdetails.ownercode = vendorcode;
    this.slabdetails.fromdate=  "2020-01-01";
    this.slabdetails.todate  ="2099-01-01";
    if(this.ratecode !== "0"){
      var json = {
        mode: "4",
        ratecode: this.ratecode
      }
      this.apiService.post(VENDOR_RATE, json).then((res: any)=>{ 
        this.slabdetails = res[0];
      });
    }
   }
   ngOnInit() : void {
    this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
    this.allcars = JSON.parse(localStorage.getItem('allcars'));
    this.allcartype = this.cartypes.map(x=>x.car);
    this.allcarno = this.allcars.map(x=>x.carno);
     }
     filterParty(val: any){
      debugger;
      this.partynames = this.allparties.filter(x=>x.name.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.name);;
    }
    filterCarType(val: any){
      debugger;
      this.allcartype = this.cartypes.filter(x=>x.car.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.car);;
    }
    filterCar(val: any){
      debugger;
      this.allcarno = this.allcars.filter(x=>x.carno.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.carno);;
    }
  savepartyrate(){
    debugger;
    this.slabdetails.parking = this.slabdetails.parking ? "1" : "0";
    this.slabdetails.outstation = this.slabdetails.outstation ? this.slabdetails.outstation : "0";
    //this.slabdetails.hrkm = this.slabdetails.hrkm ? "1" : "0";
    this.slabdetails.mode = 1;
    if(this.ratecode !== "0") this.slabdetails.mode = 2;
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(VENDOR_RATE, this.slabdetails).then((res: any)=>{ 
      this.toastr.success("Youe data was successfully saved",'Success');
      location.reload();
    });
  }
}
