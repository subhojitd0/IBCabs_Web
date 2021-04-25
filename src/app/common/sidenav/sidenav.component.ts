import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {Router} from '@angular/router';
import { ROUTE_ADD_DDR, ROUTE_ADD_DDR_WALKIN, ROUTE_BASIC, ROUTE_DASHBOARD, ROUTE_DRIVER, ROUTE_GENERATE_BILL, ROUTE_NEW_USER, ROUTE_OWNER, ROUTE_PARTY, ROUTE_REPORTO, ROUTE_USER_RIGHTS, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SideNavComponent implements OnInit {
  dashboardurl = "";
  partyurl = "";
  ownerurl = "";
  driverurl = "";
  addddrurl = "";
  viewddrurl = "";
  addwalkingurl = "";
  generatebillurl = "";
  loggedin : any;
  pagerefresh : any;
  reportto: string;
  userrole: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    debugger;
    this.loggedin = JSON.parse(localStorage.getItem('loggedin'));
    this.pagerefresh = JSON.parse(localStorage.getItem('pagerefresh'));
    this.dashboardurl = "/" + ROUTE_DASHBOARD;
    this.partyurl = "/" + ROUTE_PARTY;
    this.ownerurl = "/" + ROUTE_OWNER;
    this.driverurl = "/" + ROUTE_DRIVER;
    this.addddrurl = "/" + ROUTE_ADD_DDR;
    this.viewddrurl = "/" + ROUTE_VIEW_DDR;
    this.addwalkingurl = "/" + ROUTE_ADD_DDR_WALKIN;
    this.generatebillurl = "/" + ROUTE_GENERATE_BILL;
    this.reportto = "/" + ROUTE_REPORTO;
    this.userrole = localStorage.getItem("loggedinuser");
  }
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = false;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  createuser(){
    this.router.navigateByUrl('/' + ROUTE_NEW_USER);
  }
  userrights(){
    this.router.navigateByUrl('/' + ROUTE_USER_RIGHTS);
  }
  onLogout(){
    localStorage.clear();
    this.router.navigateByUrl('/' + ROUTE_BASIC);
  }
}
