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
  outstation: string;
  ownername: string;
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
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    let vedorname = localStorage.getItem('selectedvendorname'); 
    let vendorcode = localStorage.getItem('selectedownerid');
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.partynames = this.allparties.map(x=>x.name);
    this.slabdetails = new SlabDetails();
    this.slabdetails.ownername = vedorname;
    this.slabdetails.ownercode = vendorcode;
   }
   ngOnInit() : void {
    this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
    this.allcartype = this.cartypes.map(x=>x.car);
    this.allcarno = this.allcars.map(x=>x.carno);
     }
     filterParty(val: any){
      debugger;
      this.partynames = this.allparties.filter(x=>x.name.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.name);;
    }
    filterCar(val: any){
      debugger;
      this.allcarno = this.allcars.filter(x=>x.carno.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.carno);;
    }
  savepartyrate(){
    debugger;
    this.slabdetails.parking = this.slabdetails.parking ? "1" : "0";
    this.slabdetails.outstation = this.slabdetails.outstation ? "1" : "0";
    this.slabdetails.hrkm = this.slabdetails.hrkm ? "1" : "0";
    this.slabdetails.mode = 1;
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(VENDOR_RATE, this.slabdetails).then((res: any)=>{ 
      this.toastr.success("Youe data was successfully saved",'Success');
      location.reload();
    });
  }
}
