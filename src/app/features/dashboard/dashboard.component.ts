import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ROUTE_DASHBOARD } from 'src/shared/constants/constant';
import { CAR_API, DRIVER_API, EXTRA_API, OWNER_API, PARTY_HEAD_API, RENTAL_DETAIL_API_DASHBOARD, REPORT_TO_API } from 'src/shared/services/api.url-helper';
import { ApiService } from 'src/shared/services/service';

export interface RentalDetail {
  dutydate: string;
  dutyid: string;
  party: number;
  reportto: string;
  carnumber: string;
  status: string;
  dutytype: string;
  options: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pagerefrsh: any;
  rentalDetails: any;
  editRentalDetails: any;
  month: any;
  filterby: any;
  filtervalue: any;
  isBulkEdit: boolean;
  year: any;
  allcars: any;
  alldrivers: any;
  loading: boolean = false;
  masterrentaldetails: any;
  mastereditrentaldetails: any;
  selecteditem: any;
  cartypes: any;
  allparties: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['dutydt', 'carno', 'driver', 'reportto', 'goutkm', 'gouttime', 'ginkm', 'gintime', 'statusval', 'accept'];
  dataSource: MatTableDataSource<RentalDetail>;
  filteredOptionsCar: Observable<any[]>;
  filteredOptionsCarType: Observable<any[]>;
  filteredOptionsDriver: Observable<any[]>;
  filteredOptionsReport: Observable<string[]>;
  reporttos: any;
  carFormControl: FormControl;
  carTypeFormControl: FormControl;
  driverFormControl: FormControl;
  alldrivernames: any;
  allcarno: any;
  allcartype: any;
  carselect: FormControl;
  driverselect: FormControl;
  partyselect: FormControl;
  reportselect: FormControl;
  partylist: Observable<string[]>;
  partynames: any;
  carlist: Observable<string[]>;
  driverlist: Observable<string[]>;
  ownerlist: Observable<string[]>;
  reportlist: Observable<string[]>;
  allcartypefilter: any;
  ddrrole: string;
  approverole: string;
  delete: string;
  allreportto: any;
  allreport: any;
  tkm: number;
  thr: any;
  ownerselect: FormControl;
  allowners: any;
  allownername: any;
  selectallval: boolean = false;
  date: any;
  dates: any[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  aindia: boolean;
  
  constructor(private router: Router, private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.init(); //Initialize the app with localstorage and sessionstorage values
    this.aindia = localStorage.getItem("dashboardair") === "1" ? true : false;
    let timervariale = 60000;
    if(this.aindia){
      this.dashboarddutyshow();
    }
    setInterval(() => {
      if(this.aindia){
        this.dashboarddutyshow();
      }
    }, timervariale);
    
  }

  init(){
    var json = 
    {
      "mode": 0
    };
    localStorage.setItem('selectedduty', "0");
    this.pagerefrsh = JSON.parse(localStorage.getItem('pagerefresh'));
    this.apiService.post(PARTY_HEAD_API, json).then((res: any)=>{ 
      localStorage.setItem("allparties", JSON.stringify(res.result));
    });
    this.apiService.post(REPORT_TO_API, json).then((res: any)=>{ 
      localStorage.setItem("allreportto", JSON.stringify(res.result));
    });
    this.apiService.post(EXTRA_API, json).then((res: any)=>{ 
      localStorage.setItem("allcartypes", JSON.stringify(res.result));
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
    this.apiService.post(OWNER_API, json).then((res: any)=>{ 
      localStorage.setItem("allowners", JSON.stringify(res.result));
    });
    var jsonooked = 
    {
      "mode": 3
    };
    this.apiService.post(EXTRA_API, jsonooked).then((res: any)=>{ 
      localStorage.setItem("allbookedby", JSON.stringify(res.result));
    });
    if(this.pagerefrsh == "0"){
      localStorage.setItem('pagerefresh', "1");
      location.reload();
    }
  }

  dashboarddutyshow(){
    this.date = "1";
    localStorage.setItem('selectedduty', "0");
    this.ddrrole = localStorage.getItem("enterddr");
    this.approverole = localStorage.getItem("approve");
    this.delete = localStorage.getItem("delete");
    this.partyselect = new FormControl();
    this.driverselect = new FormControl();
    this.carselect = new FormControl();
    this.reportselect = new FormControl();
    this.ownerselect = new FormControl();
    this.carFormControl = new FormControl();
    this.carTypeFormControl = new FormControl();
    this.driverFormControl = new FormControl();
    //this.assignAutoComplete();
     this.cartypes = JSON.parse(localStorage.getItem('allcartypes'));
     var yr = localStorage.getItem('rentalyr');
     var month = localStorage.getItem('rentalmonth');
     var dt = localStorage.getItem('rentaldate');
     var filterby = localStorage.getItem('rentalfilterby');
     var filterval = localStorage.getItem('rentalfilterval');
     this.allparties = JSON.parse(localStorage.getItem('allparties'));
     this.alldrivers = JSON.parse(localStorage.getItem('alldrivers'));
     this.driverlogic();
     this.allowners = JSON.parse(localStorage.getItem('allowners'));
     this.allcars = JSON.parse(localStorage.getItem('allcars'));
     //this.carlogic();
     this.alldrivernames = this.alldrivers.map(x=>x.drivername);
     this.allcarno = this.allcars.map(x=>x.carno);
     this.allcartype = this.cartypes.map(x=>x.car);
     this.allownername = this.allowners.map(x=>x.ownername);
     this.allreportto = JSON.parse(localStorage.getItem('allreportto'));
     this.allreport = this.allreportto.map(x=>x.report);
     this.partynames = this.allparties.map(x=>x.name);
     if(filterby)
        this.filterby = filterby;
     else 
        this.filterby = "party";

     if(filterval)
        this.filtervalue = filterval;
     else 
        this.filtervalue = this.allparties[0].name;

     if(yr && month){
      this.month = month;
      this.year = yr;
      this.date = dt;
     }
     else{
      this.month = new Date().getMonth() + 1;
      this.year = new Date().getFullYear();
      localStorage.setItem("rentalmonth", this.month);
      localStorage.setItem('rentaldate', this.date);
      localStorage.setItem("rentalyr", this.year);
      localStorage.setItem("rentalfilterby", this.filterby);
      localStorage.setItem("rentalfilterval", this.filtervalue);
     }
     this.isBulkEdit = false;
     this.selecteditem = "ALL";
    
    var json = 
    {
      "mode": 0,
      "month": this.month,
      "year": this.year,
      "filterby": this.filterby,
      "property": this.filtervalue,
      "username": localStorage.getItem('loggedinuser'),
      "date": this.date
    };
    this.apiService.post(RENTAL_DETAIL_API_DASHBOARD, json).then((res: any)=>{ 
      debugger;
      this.rentalDetails = res.result;
      this.masterrentaldetails = res.result;
      this.dataSource = new MatTableDataSource(this.rentalDetails);
      this.dataSource.paginator = this.paginator;
      localStorage.setItem("rentaldetails", JSON.stringify(res.result));
      this.assignAutoComplete();
    });
   
  }
  assignAutoComplete(){
   
    //party
    this.partylist = this.partyselect.valueChanges.pipe(startWith(''),map(value => this._filterParty(value)));
    //carno
    //this.filteredOptionsCar = this.carFormControl.valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    this.carlist = this.carselect.valueChanges.pipe(startWith(''),map(value => this._filterCar(value)));
    //cartype
    this.reportlist = this.reportselect.valueChanges.pipe(startWith(''),map(value => this._filterReport(value)));
    //this.filteredOptionsCarType = this.carTypeFormControl.valueChanges.pipe(startWith(''),map(value => this._filterCarType(value)));
    //driver
    //this.filteredOptionsDriver = this.driverFormControl.valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
    this.driverlist = this.driverselect.valueChanges.pipe(startWith(''),map(value => this._filterDriver(value)));
    this.ownerlist = this.ownerselect.valueChanges.pipe(startWith(''),map(value => this._filterOwner(value)));
   }
   public _filterOwner(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allownername.filter(client => client.toLowerCase().includes(filterValue));
  }
   public _filterParty(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.partynames.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCar(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcarno.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterReport(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allreport.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterCarType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allcartype.filter(client => client.toLowerCase().includes(filterValue));
  }
  public _filterDriver(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.alldrivernames.filter(client => client.toString().toLowerCase().includes(filterValue)); 
  } 
  filterCarType(val: any){
    debugger;
    this.allcartype = this.cartypes.filter(x=>x.car.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.car);;
  }
  filterCar(val: any){
    debugger;
    this.allcarno = this.allcars.filter(x=>x.carno.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.carno);;
  }
  filterDriver(val: any){
    debugger;
    this.alldrivernames = this.alldrivers.filter(x=>x.drivername.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.drivername);;
  }
  filterReport(val: any){
    debugger;
    this.allreport = this.allreportto.filter(x=>x.report.toString().toLowerCase().includes(val.toString().toLowerCase())).map(y=>y.report);;
  }
  onChangeMonth(val){
    this.loading = true;
    this.month = val;
    this.setJson();
   }
   onChangeYear(val){
    this.loading = true;
    this.year = val;
    this.setJson();
   }
   onChangeDay(val){
    this.loading = true;
    this.date = val;
    this.setJson();
   }
   onChangeFilter(val){
    this.loading = true;
    this.filterby = val;
    if(val === "party"){
      this.filtervalue = this.allparties[0].name;
    }
    else if(val === "driver"){
      this.filtervalue = this.alldrivers[0].drivercode;
    }
    else if(val === "report"){
      this.filtervalue = this.allreportto[0].drivercode;
    }
    else if(val === "owner"){
      this.filtervalue = this.allownername[0].ownercode;
    }
    else{
      this.filtervalue = this.allcars[0].carcode;
    }
    this.loading = true;
    this.setJson();
   }
   onChangeFilterVal(val){
    this.loading = true;
    this.filtervalue = val.option.value;
    this.setJson();
   }
   selectallduty(){
     this.selectallval = !this.selectallval;
     this.editRentalDetails.forEach(element => {
       if(element.status !== '3' && element.status !== '4')
          element.isSelected = this.selectallval;
     });
   }
   setJson(){
    localStorage.setItem("rentalmonth", this.month);
    localStorage.setItem("rentaldate", this.date);
    localStorage.setItem("rentalyr", this.year);
    localStorage.setItem("rentalfilterby", this.filterby);
    localStorage.setItem("rentalfilterval", this.filtervalue);
    var json = 
    {
      "mode": 0,
      "month": this.month,
      "year": this.year,
      "filterby": this.filterby,
      "property": this.filtervalue,
      "username": localStorage.getItem('loggedinuser'),
      "date": this.date
    };
    this.loadOnChange(json);
   }
   loadOnChange(json: any){
      this.apiService.post(RENTAL_DETAIL_API_DASHBOARD, json).then((res: any)=>{ 
        debugger;
        this.rentalDetails = res.result;
        if(this.date !== "ALL"){
          this.rentalDetails = this.rentalDetails.filter(x=>new Date(x.dutydate).getDate().toString() === this.date.toString());
        }
        this.masterrentaldetails = res.result;
        this.dataSource = new MatTableDataSource(this.rentalDetails);
        localStorage.setItem("rentaldetails", JSON.stringify(res.result));
        this.loading = false;
      });
   }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  carlogic(){
    debugger;
    let validcars = [];
    this.allcars.forEach(element => {
      if(new Date() < new Date(element.puc) && new Date() < new Date(element.tax) && new Date() < new Date(element.ins)){
        validcars.push(element);
      }
    });
    this.allcars = [];
    this.allcars = validcars;
  }
  driverlogic(){
    debugger;
    let validdrivers = [];
    this.alldrivers.forEach(element => {
      if(element.licenseExpiry != "0000-00-00" && new Date() < new Date(element.licenseExpiry)){
        validdrivers.push(element);
      }
    });
    this.alldrivers = [];
    this.alldrivers = validdrivers;
  }
  newduty(){
    //this.router.navigateByUrl('/' + ROUTE_ADD_DDR);
  }
  deleteduty(id: any){
    var r = confirm("Are you sure that you want to delete this record ?");
    if (r == true) {
      debugger;
      var json = 
      {
        "mode":3,
        "dutyid": id
      }
      this.apiService.post(RENTAL_DETAIL_API_DASHBOARD, json).then((res: any)=>{ 
        this.toastr.success("Your data was successfully saved",'Success');
        location.reload();
      });
    }
  }
  sendMessage(id: any, party: any){
    /* localStorage.setItem('selectedrentalid', id );
    localStorage.setItem('selectedrentalparty', party );
    const dialogRef = this.dialog.open(MessageModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed`);
    }); */
  }

}
