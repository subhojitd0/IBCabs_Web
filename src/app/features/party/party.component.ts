import { Component, OnInit } from '@angular/core';



export interface PartyHead {
  name: string;
  position: number;
  rate: string;
  option: string;
}


const PARTY_HEAD: PartyHead[] = [
  {position: 1, name: 'Hydrogen', rate: "Package", option: 'H'},
  {position: 2, name: 'Helium', rate: "Package", option: 'He'},
  {position: 3, name: 'Lithium', rate: "Package", option: 'Li'},
  {position: 4, name: 'Beryllium', rate: "-", option: 'Be'},
  {position: 5, name: 'Boron', rate: "Package", option: 'B'},
  {position: 6, name: 'Carbon', rate: "-", option: 'C'},
  {position: 7, name: 'Nitrogen', rate: "Package", option: 'N'},
  {position: 8, name: 'Oxygen', rate: "Slab", option: 'O'},
  {position: 9, name: 'Fluorine', rate: "Slab", option: 'F'},
  {position: 10, name: 'Neon', rate: "Package", option: 'Ne'},
];

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {

  isPack:boolean=true
  isSlab:boolean=false
  constructor() { }

  selectPack(){
    this.isPack=true
    this.isSlab=false
  }

  selectSlab(){
    this.isSlab=true
    this.isPack=false
  }

  ngOnInit(): void {
  }


  displayedColumns: string[] = ['position', 'name', 'rate', 'option'];
  dataSource = PARTY_HEAD;

}
