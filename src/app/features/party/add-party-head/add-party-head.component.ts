import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_PARTY, ROUTE_RATE } from 'src/shared/constants/constant';

export interface PartyHeadDDetails {
    mode: number,
    name: string,                               
    billto: string,                                  
    billsubject: string,                           
    billaddress: string,
    gst: string,                           
    pan: string,
    dutyhr: number,                           
    ot: number,                          
    starttime: string,                                   
    endtime: string,                                  
    nightcharge: number,                
    garagein:  number,                           
    garageout: number,
    
    ratetype:  number,
    fixhour: number,
    fixkm:number,
    package:number,
    extrahour:number,
    extrakm:number,
    durationhour:number,
    partyheadid: number,
    contact:string,
    master:string,
    kmin:string,
    kmout:string,
    outstation:string,
    reportto: string
  }

export class partyhead implements PartyHeadDDetails{
  mode: number;
    name: string;                               
    billto: string;                                  
    billsubject: string;                           
    billaddress: string;
    gst: string;                  
    pan: string;
    dutyhr: number;                           
    ot: number;                          
    starttime: string;                                   
    endtime: string;                                  
    nightcharge: number;                
    garagein:  number;                           
    garageout: number;
    ratetype:  number;
    fixhour: number;
    fixkm:number;
    package:number;
    extrahour:number;
    extrakm:number;
    durationhour:number;
    partyheadid:number;
    contact:string;
    master:string;
    kmin:string;
    kmout:string;
    outstation:string;
    reportto: string;
}
@Component({
  selector: 'app-add-party-head',
  templateUrl: './add-party-head.component.html',
  styleUrls: ['./add-party-head.component.css']
})
export class AddPartyHeadComponent implements OnInit {
  partyheadid : any;
  isPack:boolean=false;
  isSlab:boolean=false;
  partyheaddetails: partyhead;
  masterlist: any[] = [];
  allparties: any;
  allreportto: any;
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.partyheaddetails = new partyhead();
    this.allparties = JSON.parse(localStorage.getItem('allparties'));
    this.allreportto = JSON.parse(localStorage.getItem('allreportto'));
    this.allparties.forEach(element => {
      if(!this.masterlist.includes(element.master)){
        this.masterlist.push(element.master);
      }
    });
    debugger;
    this.partyheadid = JSON.parse(localStorage.getItem('selectedpartyheadid'));
    if(this.partyheadid.toString() != "0"){
      var json = 
      {
        "mode":4,
        "partyheadcode": this.partyheadid
      } 
      this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
        if(res.hasOwnProperty('error')){
          this.toastr.error("You cannot edit the selected party", "Error");
          location.reload();
        }
        else{
          this.partyheaddetails = res;
          this.partyheaddetails.mode = 2;
          this.partyheaddetails.starttime = this.partyheaddetails.starttime.substr(0,5);
          this.partyheaddetails.endtime = this.partyheaddetails.endtime.substr(0,5);
          this.partyheaddetails.partyheadid = this.partyheadid;
          if(this.partyheaddetails.ratetype == 0){
            this.isPack = true;
            this.isSlab = false;
          } 
          else{
            this.isSlab = true;
            this.isPack = false;
          } 
        }
      });
    }
    else{
      localStorage.setItem('selectedpartyheadid', "0");
      this.partyheaddetails.ratetype = 0;
      this.isPack = true;
    }
   }
   ngOnInit() : void {
    
   }
   openpartyrates(){
     debugger;
    localStorage.setItem('selectedpartyheadname', this.partyheaddetails.name);
    this.router.navigateByUrl('/' + ROUTE_RATE);
   }
  savepartyhead(){
    debugger;
    if(this.partyheaddetails.mode != 2)
    {
      this.partyheaddetails.mode = 1;
      if(this.isPack){
        this.partyheaddetails.ratetype = 0;
      }
      else{
        this.partyheaddetails.ratetype = 1;
      }
    }
    this.partyheaddetails.garagein = this.partyheaddetails.garageout;
    this.partyheaddetails.kmin = this.partyheaddetails.kmout;
    this.toastr.info("Please wait while we are saving your data",'Information');
    this.apiService.post(PARTY_HEAD_API, this.partyheaddetails).then((res: any)=>{ 
      this.toastr.success("Youe data was successfully saved",'Success');
      location.reload();
    });
  }
  selectPack(){
    this.isPack=true
    this.isSlab=false
  }

  selectSlab(){
    this.isSlab=true
    this.isPack=false
  }

}
