import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import { RATE_SLAB_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { ROUTE_RATE } from 'src/shared/constants/constant';
import { Router } from '@angular/router';

export interface ISlabDetails {
  mode: number;
  headname: string;
  partyheadcode: string;  
  onekm: string;
  onekmrate: string;
  onehr: string;
  onehrrate: string;
  twokm: string;
  twokmrate: string;
  twohr: string;
  twohrrate: string;
  threekm: string;
  threekmrate: string;
  threehr: string;
  threehrrate: string;
  restkmrate: string;
  resthrrate: string;
  car: string;
  fromdate: string;
  todate:string;
}
export class SlabDetails implements ISlabDetails {
  mode: number;
  partyheadcode: string;
  headname: string;  
  onekm: string;
  onekmrate: string;
  onehr: string;
  onehrrate: string;
  twokm: string;
  twokmrate: string;
  twohr: string;
  twohrrate: string;
  threekm: string;
  threekmrate: string;
  threehr: string;
  threehrrate: string;
  restkmrate: string;
  resthrrate: string;
  car: string;
  fromdate:string;
  todate: string;
}

@Component({
  selector: 'app-add-slab-head',
  templateUrl: './add-slab-head.component.html',
  styleUrls: ['./add-slab-head.component.css']
})
export class AddSlabComponent implements OnInit {
  partyheadid : any;
  slabdetails: SlabDetails;
  cartypes: any;
  allcartype: any;
  allcars: any;
  allcarno: any;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    let partyheadname = localStorage.getItem('selectedpartyheadname'); 
    let partycode = localStorage.getItem('selectedpartyheadid');
    this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
    this.allcars = JSON.parse(localStorage.getItem('allcars'));
    this.slabdetails = new SlabDetails();
    this.slabdetails.headname = partyheadname;
    this.slabdetails.partyheadcode = partycode;
   }
   ngOnInit() : void {
    this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
    this.allcartype = this.cartypes.map(x=>x.car);
    this.allcarno = this.allcars.map(x=>x.carno);
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
    this.slabdetails.mode = 1;
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(RATE_SLAB_API, this.slabdetails).then((res: any)=>{ 
      this.toastr.success("Youe data was successfully saved",'Success');
      location.reload();
    });
  }
}
