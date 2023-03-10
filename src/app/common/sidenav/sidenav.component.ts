import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {Router} from '@angular/router';
import { ROUTE_ADD_DDR, ROUTE_ADD_DDR_WALKIN, ROUTE_BASIC, ROUTE_DASHBOARD, ROUTE_DRIVER, ROUTE_GENERATE_BILL, ROUTE_GENERATE_VENDOR_BILL, ROUTE_MATADOR, ROUTE_MESSAGE, ROUTE_NEW_USER, ROUTE_OWNER, ROUTE_PARTY, ROUTE_REPORTO, ROUTE_USER_RIGHTS, ROUTE_VENDOR_BILL, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';

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
  matadorurl: string = "";
  removeheader: string;
  generatevendorbillurl: string;
  createbill: boolean;
  enterddr: boolean;
  enterowner: boolean;
  enterparty: boolean;
  payowner: boolean;
  for: boolean;
  viewbill: boolean;
  enterdriver: boolean;
  enterreportto: boolean;
  entermatadorrate: boolean;
  viewvendorbill: boolean;
  enterddrwalkin: boolean;
  viewddr: boolean;
  message: boolean;
  dashboardair: boolean;
  messageurl: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    debugger;
    this.removeheader = localStorage.getItem("removeheader");
    this.loggedin = JSON.parse(localStorage.getItem('loggedin'));
    this.pagerefresh = JSON.parse(localStorage.getItem('pagerefresh'));

    this.createbill = localStorage.getItem("createbill") === "1" ? true : false;
    this.enterddr = localStorage.getItem("enterddr") === "1" ? true : false;
    this.enterowner = localStorage.getItem("enterowner") === "1" ? true : false;
    this.enterparty = localStorage.getItem("enterparty") === "1" ? true : false;
    this.payowner = localStorage.getItem("payowner") === "1" ? true : false;
    this.for = localStorage.getItem("for") === "1" ? true : false;
    this.viewbill = localStorage.getItem("viewbill") === "1" ? true : false;
    this.enterdriver = localStorage.getItem("enterdriver") === "1" ? true : false;
    this.enterreportto = localStorage.getItem("enterreportto") === "1" ? true : false;
    this.entermatadorrate = localStorage.getItem("entermatadorrate") === "1" ? true : false;
    this.viewvendorbill = localStorage.getItem("viewvendorbill") === "1" ? true : false;
    this.enterddrwalkin = localStorage.getItem("enterddrwalkin") === "1" ? true : false;
    this.viewddr = localStorage.getItem("viewddr") === "1" ? true : false;
    this.message = localStorage.getItem("message") === "1" ? true : false;
    this.dashboardair = localStorage.getItem("dashboardair") === "1" ? true : false;

    this.dashboardurl = "/" + ROUTE_DASHBOARD;
    this.partyurl = "/" + ROUTE_PARTY;
    this.ownerurl = "/" + ROUTE_OWNER;
    this.driverurl = "/" + ROUTE_DRIVER;
    this.addddrurl = "/" + ROUTE_ADD_DDR;
    this.viewddrurl = "/" + ROUTE_VIEW_DDR;
    this.addwalkingurl = "/" + ROUTE_ADD_DDR_WALKIN;
    this.generatebillurl = "/" + ROUTE_GENERATE_BILL;
    this.reportto = "/" + ROUTE_REPORTO;
    this.matadorurl = "/" + ROUTE_MATADOR;
    this.messageurl = "/" + ROUTE_MESSAGE;
    this.generatevendorbillurl = "/" + ROUTE_GENERATE_VENDOR_BILL;
    this.userrole = localStorage.getItem("loggedinuser");
    if(!this.loggedin)
    {
      this.router.navigateByUrl('/' + ROUTE_BASIC);
    }
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
