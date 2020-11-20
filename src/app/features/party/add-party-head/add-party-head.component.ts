import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';

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
    partyheadid: number
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
  constructor(private apiService: ApiService, private toastr: ToastrService) {
    this.partyheaddetails = new partyhead();
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
    }
   }
   ngOnInit() : void {
    
   }
  savepartyhead(){
    debugger;
    if(this.partyheaddetails.mode != 2)
    {
      this.partyheaddetails.mode = 1;
      this.partyheaddetails.ratetype = 0;
    }
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
