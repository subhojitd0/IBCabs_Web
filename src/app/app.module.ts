import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
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
    MonthlyBillAComponent
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
    ToastrModule.forRoot() 
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
