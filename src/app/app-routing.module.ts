import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ROUTE_ADD_DDR, ROUTE_BASIC, ROUTE_CAR, ROUTE_DASHBOARD, ROUTE_DRIVER, ROUTE_OWNER, ROUTE_PARTY, ROUTE_RATE, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';
import { CarComponent } from './features/car/car.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DriverComponent } from './features/driver/driver.component';
import { EditRentalDetailComponent } from './features/edit-rental-detail/edit-rental-detail.component';
import { LoginComponent } from './features/login/login.component';
import { OwnerComponent } from './features/owner/owner.component';
import { PartyRatesComponent } from './features/party-rates/partyrates.component';
import { PartyComponent } from './features/party/party.component';
import { RentalDetailComponent } from './features/rental-detail/rental-detail.component';

const routes: Routes = [
  {
    path: ROUTE_BASIC,
    component:LoginComponent
  },
  {
    path: ROUTE_DASHBOARD,
    component:DashboardComponent
  },
  {
    path: ROUTE_PARTY,
    component:PartyComponent
  },
  {
    path: ROUTE_RATE,
    component:PartyRatesComponent
  },
  {
    path: ROUTE_OWNER,
    component:OwnerComponent
  },
  {
    path: ROUTE_CAR,
    component:CarComponent
  },
  {
    path: ROUTE_DRIVER,
    component:DriverComponent
  },
  {
    path: ROUTE_ADD_DDR,
    component:RentalDetailComponent
  },
  {
    path: ROUTE_VIEW_DDR,
    component:EditRentalDetailComponent
  }
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents= [LoginComponent]