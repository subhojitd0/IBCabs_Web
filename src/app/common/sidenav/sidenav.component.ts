import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SideNavComponent implements OnInit {
  loggedin : any;
  pagerefresh : any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    debugger;
    this.loggedin = JSON.parse(localStorage.getItem('loggedin'));
    this.pagerefresh = JSON.parse(localStorage.getItem('pagerefresh'));
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

  onLogout(){
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
