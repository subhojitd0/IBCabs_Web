import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import { RATE_SLAB_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';

export interface ISlabDetails {
  mode: number;
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
}
export class SlabDetails implements ISlabDetails {
  mode: number;
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
}

@Component({
  selector: 'app-add-slab-head',
  templateUrl: './add-slab-head.component.html',
  styleUrls: ['./add-slab-head.component.css']
})
export class AddSlabComponent implements OnInit {
  partyheadid : any;
  slabdetails: SlabDetails;
  constructor(private apiService: ApiService, private toastr: ToastrService) {
    this.slabdetails = new SlabDetails();
   }
   ngOnInit() : void {
    
   }
  savepartyhead(){
    debugger;
    this.slabdetails.mode = 1;
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(RATE_SLAB_API, this.slabdetails).then((res: any)=>{ 
      this.toastr.success("Youe data was successfully saved",'Success');
      location.reload();
    });
  }
}
