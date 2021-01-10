import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DASHBOARD } from 'src/shared/constants/constant';
import { CAR_API, DRIVER_API, PARTY_HEAD_API } from 'src/shared/services/api.url-helper';
import { ApiService } from 'src/shared/services/service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pagerefrsh: any;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    var json = 
    {
      "mode": 0
    };
    localStorage.setItem('selectedduty', "0");
    this.pagerefrsh = JSON.parse(localStorage.getItem('pagerefresh'));
    this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
      localStorage.setItem("allparties", JSON.stringify(res.result));
    });
    var jsoncar = 
    {
      "mode": 5
    };
    this.apiService.post(CAR_API, jsoncar).then((res: any)=>{ 
      localStorage.setItem("allcars", JSON.stringify(res.result));
    });
    this.apiService.post(DRIVER_API, json).then((res: any)=>{ 
      localStorage.setItem("alldrivers", JSON.stringify(res.result));
    });
    if(this.pagerefrsh == "0"){
      localStorage.setItem('pagerefresh', "1");
      this.router.navigateByUrl('/' + ROUTE_DASHBOARD);
    }
  }

}
