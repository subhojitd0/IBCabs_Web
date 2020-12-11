import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarComponent } from './features/car/car.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DriverComponent } from './features/driver/driver.component';
import { LoginComponent } from './features/login/login.component';
import { OwnerComponent } from './features/owner/owner.component';
import { PartyRatesComponent } from './features/party-rates/partyrates.component';
import { PartyComponent } from './features/party/party.component';

const routes: Routes = [
  {
    path: '',
    component:LoginComponent
  },
  {
    path: 'dashboard',
    component:DashboardComponent
  },
  {
    path: 'party',
    component:PartyComponent
  },
  {
    path: 'rate',
    component:PartyRatesComponent
  },
  {
    path: 'owner',
    component:OwnerComponent
  },
  {
    path: 'car',
    component:CarComponent
  },
  {
    path: 'driver',
    component:DriverComponent
  }
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents= [LoginComponent]