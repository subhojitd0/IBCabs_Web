import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';

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
    durationhour:number
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
}
@Component({
  selector: 'app-add-party-head',
  templateUrl: './add-party-head.component.html',
  styleUrls: ['./add-party-head.component.css']
})
export class AddPartyHeadComponent implements OnInit {
  partyheadid : any;
  isPack:boolean=true;
  isSlab:boolean=false;
  partyheaddetails: partyhead;
  constructor(private apiService: ApiService) {
    this.partyheaddetails = new partyhead();
   }
   ngOnInit() : void {
    this.partyheadid = JSON.parse(localStorage.getItem('selectedpartyheadid'));
    
   
      /* const party: PartyHead[] = res.result;
      this.dataSource = new MatTableDataSource(party); */
   
   }
  savepartyhead(){
    debugger;
    this.partyheaddetails.mode = 1;
    this.partyheaddetails.ratetype = 0;
    this.apiService.post(PARTY_HEAD_API, this.partyheaddetails).then((res: any)=>{ 
      debugger;
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
