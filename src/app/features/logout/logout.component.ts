import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from '../../../shared/services/service';
import { ToastrService } from 'ngx-toastr';
import {CAR_API, DRIVER_API, EXTRA_API, LOGIN_API} from '../../../shared/services/api.url-helper';
import { ROUTE_BASIC, ROUTE_DASHBOARD, ROUTE_MESSAGE } from 'src/shared/constants/constant';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  username: any;
  password: any;
  constructor(private router: Router,private apiService: ApiService, private toastr: ToastrService) {
    
  }

  ngOnInit(): void {
    debugger;
    //localStorage.setItem('pagerefresh', "0");
    localStorage.clear();
    this.router.navigateByUrl('/' + ROUTE_BASIC);
  }
}
