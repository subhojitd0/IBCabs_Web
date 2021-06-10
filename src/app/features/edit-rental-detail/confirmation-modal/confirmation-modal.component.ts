import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {DRIVER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_OFFICE, RENTAL_DETAIL_API_OFFICE_BULKEDIT} from '../../../../shared/services/api.url-helper';
import {MatDialog} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { BOOKING_ID_CONFIRM_MESSAGE_TEMPLATE, CAR_ASSIGNED_MESSAGE_TEMPLATE, DRIVER_MESSAGE_TEMPLATE, MESSAGE_AUTH_SCHEME, MESSAGE_FORMAT, MESSAGE_METHOD, MESSAGE_PWD, MESSAGE_TYPE, MESSAGE_USER, MESSAGE_VERSION, ROUTE_ADD_DDR, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})

export class ConfirmationModalComponent implements OnInit {
  phoneNumber: any;
  selectedType: any;
  rentalDetails: any;
  message: any;
  phoneNumbers: any[] = [];
  selectedid: any;
  constructor(private router: Router,private apiService: ApiService, private toastr: ToastrService) {
    
   }
   ngOnInit() : void {
    this.selectedid = JSON.parse(localStorage.getItem('selectedrentalid'));
   }
 
   approve(){
    var json = 
    {
      "mode":"7",
      "dutyid": this.selectedid,
      "status": "3"
    };
    this.toastr.info("Please wait while we approve the duty",'Information');
    this.apiService.post(RENTAL_DETAIL_API_OFFICE, json).then((res: any)=>{ 
        this.toastr.success("The duty was successfully approved",'Success');
        location.reload();
    });
   }
   edit(){
    localStorage.setItem('selectedduty', this.selectedid);
    this.router.navigateByUrl('/' + ROUTE_ADD_DDR);
   }
}
