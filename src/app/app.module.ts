import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SideNavComponent } from './common/sidenav/sidenav.component';
import { HeaderComponent } from './common/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {MatTableModule} from '@angular/material/table';
import { PartyComponent } from './features/party/party.component'; 
import { PartyRatesComponent } from './features/party-rates/partyrates.component'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddPartyHeadComponent } from './features/party/add-party-head/add-party-head.component'; 
import { AddSlabComponent } from './features/party-rates/add-new-slab/add-slab-head.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { OwnerComponent } from '../app/features/owner/owner.component';
import { AddOwnerComponent } from '../app/features/owner/add-owner/add-owner.component';
import { CarComponent } from '../app/features/car/car.component';
import { AddCarComponent } from '../app/features/car/add-new-car/add-car.component';
import { DriverComponent } from '../app/features/driver/driver.component';
import { AddDriverComponent } from '../app/features/driver/add-driver/add-driver.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material/stepper';
import {RentalDetailComponent} from '../app/features/rental-detail/rental-detail.component';
import {RentalDetailWalkinComponent} from '../app/features/rental-detail-walkin/rental-detail-walkin.component';
import { EditRentalDetailComponent } from './features/edit-rental-detail/edit-rental-detail.component';
import {MessageModalComponent} from './features/edit-rental-detail/message-modal/message-modal.component';
import {GenarateBillComponent} from './features/generate-bill/generate-bill.component';
import {NewBillComponent} from './features/generate-bill/NewBill/newbill.component';
import {MonthlyBillAComponent} from './features/bills/monthly-bill-a/monthly-a.component';
import {MonthlyContractAComponent} from './features/bills/mothly-contract-a/monthly-contract-a.component';
import {AdvancedBillComponent} from './features/generate-bill/AdvancedBill/advancedbill.component';
import { ConfirmationModalComponent } from './features/edit-rental-detail/confirmation-modal/confirmation-modal.component';
import { OnCallBillAComponent } from './features/bills/oncall-bill-a/oncall-a.component';
import { ReportToComponent } from './features/reportto/reportto.component';
import { CoalIndiaComponent } from './features/bills/coalindia/coalindia.component';
import { RelianceMISComponent } from './features/bills/reliance/mis/mis.component';
import { RelianceJMSComponent } from './features/bills/reliance/jms/jms.component';
import { RelinceSummaryComponent } from './features/bills/reliance/summary/summary.component';
import { CoalIndiaModalComponent } from './features/bills/coalindia/coalindia.modal';
import { UserComponent } from './features/create-user/user.component';
import { UserRightComponent } from './features/user-rights/user-right.component';
import { BillUploadComponent } from './features/bills/bill-upload/bill-upload.component';
import { MatadorComponent } from './features/matador/matador.component';
import { CheckDdrComponent } from './features/check-ddr/checkddr.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DriverOTComponent } from './features/driverot/driverot.component';
import { GenerateOTComponent } from './features/driver/generateot/generateot.component';
import { CoalIndexComponent } from './features/bills/coal-index/coalindex.component';
import { AbpComponent } from './features/bills/abp/abp.component';
import { DDRExportComponent } from './features/ddr-export/ddrexport.component';
import { DailyOTComponent } from './features/bills/daily-ot/dailyot.component';
import { TimesBillComponent } from './features/bills/times/times.component';
import { BillhComponent } from './features/bills/billh/billh.component';
import { WalkinBillComponent } from './features/bills/walkin/walkin-bill.component';
import { NewVendorBillComponent } from './features/vendor-bill/new-bill/newbill.component';
import { GenarateVendorBillComponent } from './features/vendor-bill/generate-bill.component';
import { VendorBillComponent } from './features/vendor-bill/bills/vendorbill.component';
import { VendorRatesComponent } from './features/vendor-rates/vendorrates.component';
import { AddVendorSlabComponent } from './features/vendor-rates/add-new-slab/add-slab-head.component';
import { OriginalVendorBillComponent } from './features/vendor-bill/original-bill/vendorbill.component';
import { BillJComponent } from './features/bills/bill-j/billj.component';
import { AirIndiaComponent } from './features/bills/air-india/airindia.component';
import { MessageComponent } from './features/message/message.component';
import { LogoutComponent } from './features/logout/logout.component';
import { BillLComponent } from './features/bills/bill-L/billL.component';
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DashboardComponent,
    SideNavComponent,
    HeaderComponent,
    PartyComponent,
    AddPartyHeadComponent,
    PartyRatesComponent,
    AddSlabComponent,
    OwnerComponent,
    AddOwnerComponent,
    CarComponent,
    AddCarComponent,
    DriverComponent,
    AddDriverComponent,
    RentalDetailComponent,
    EditRentalDetailComponent,
    RentalDetailWalkinComponent,
    MessageModalComponent,
    GenarateBillComponent,
    NewBillComponent,
    MonthlyBillAComponent,
    AdvancedBillComponent,
    MonthlyContractAComponent,
    ConfirmationModalComponent,
    OnCallBillAComponent,
    ReportToComponent,
    CoalIndiaComponent,
    RelianceMISComponent,
    RelianceJMSComponent,
    RelinceSummaryComponent,
    CoalIndiaModalComponent,
    UserComponent,
    UserRightComponent,
    BillUploadComponent,
    MatadorComponent,
    CheckDdrComponent,
    DriverOTComponent,
    GenerateOTComponent,
    CoalIndexComponent,
    AbpComponent,
    DDRExportComponent,
    DailyOTComponent,
    TimesBillComponent,
    BillhComponent,
    WalkinBillComponent,
    NewVendorBillComponent,
    GenarateVendorBillComponent,
    VendorBillComponent,
    VendorRatesComponent,
    AddVendorSlabComponent,
    OriginalVendorBillComponent,
    BillJComponent,
    AirIndiaComponent,
    MessageComponent,
    LogoutComponent,
    BillLComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatGridListModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatTableExporterModule,
    ToastrModule.forRoot() 
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
