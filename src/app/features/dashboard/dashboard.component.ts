import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pagerefrsh: any;
  constructor() { }

  ngOnInit(): void {
    this.pagerefrsh = JSON.parse(localStorage.getItem('pagerefresh'));
    if(this.pagerefrsh == "0"){
      localStorage.setItem('pagerefresh', "1");
      window.location.reload();
    }
  }

}
