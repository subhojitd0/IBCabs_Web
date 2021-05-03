import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {ApiService} from '../../../../shared/services/service';
import {FILEUPLOAD_API, OWNER_API, PARTY_HEAD_API} from '../../../../shared/services/api.url-helper';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ROUTE_GENERATE_BILL, ROUTE_OWNER } from 'src/shared/constants/constant';

export interface iBillUpload {
  billregid: string,
  file: any
}

export class BillUpload implements iBillUpload{
  billregid: string;
  file: any;
}
@Component({
  selector: 'app-bill-upload',
  templateUrl: './bill-upload.component.html',
  styleUrls: ['./bill-upload.component.css']
})
export class BillUploadComponent implements OnInit {
  billupload: BillUpload;
  files: any[] = [];
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) {
    this.billupload = new BillUpload();
    this.billupload.billregid = JSON.parse(localStorage.getItem('selectedbillregid'));
   }
   ngOnInit() : void {
    
   }
   onFileChange(event)  {
    for  (var i =  0; i <  event.target.files.length; i++)  {  
        this.files.push(event.target.files[i]);
    }
  }
  uploadFile(){
    debugger;
    const formData =  new  FormData();
    formData.append("sendimage",  this.files[0]);
    this.toastr.info("Please wait while we are uploading the bill");
    this.apiService.post(FILEUPLOAD_API, formData).then((data: any)=>{
      debugger;
      this.router.navigateByUrl('/' + ROUTE_GENERATE_BILL);
    });
  }

}
