import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ROUTE_ABP, ROUTE_ADD_DDR, ROUTE_ADD_DDR_WALKIN, ROUTE_BASIC, ROUTE_CAR, ROUTE_CHECK_DDR, ROUTE_COAL_INDEX, ROUTE_DASHBOARD, ROUTE_DRIVER, ROUTE_DRIVER_OT, ROUTE_EXPORT_DDR, ROUTE_GENERATE_BILL, ROUTE_MATADOR, ROUTE_NEW_USER, ROUTE_OWNER, ROUTE_PARTY, ROUTE_RATE, ROUTE_REPORTO, ROUTE_USER_RIGHTS, ROUTE_VIEW_BILL_CNN, ROUTE_VIEW_BILL_CNN_CONTRACT, ROUTE_VIEW_BILL_COAL_INDIA, ROUTE_VIEW_BILL_ONCALL_EXTRA, ROUTE_VIEW_BILL_RELIANCE_JMS, ROUTE_VIEW_BILL_RELIANCE_MIS, ROUTE_VIEW_BILL_RELIANCE_SUMMARY, ROUTE_VIEW_DDR } from 'src/shared/constants/constant';
import { AbpComponent } from './features/bills/abp/abp.component';
import { CoalIndexComponent } from './features/bills/coal-index/coalindex.component';
import { CoalIndiaComponent } from './features/bills/coalindia/coalindia.component';
import { MonthlyBillAComponent } from './features/bills/monthly-bill-a/monthly-a.component';
import { MonthlyContractAComponent } from './features/bills/mothly-contract-a/monthly-contract-a.component';
import { OnCallBillAComponent } from './features/bills/oncall-bill-a/oncall-a.component';
import { RelianceJMSComponent } from './features/bills/reliance/jms/jms.component';
import { RelianceMISComponent } from './features/bills/reliance/mis/mis.component';
import { RelinceSummaryComponent } from './features/bills/reliance/summary/summary.component';
import { CarComponent } from './features/car/car.component';
import { CheckDdrComponent } from './features/check-ddr/checkddr.component';
import { UserComponent } from './features/create-user/user.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DDRExportComponent } from './features/ddr-export/ddrexport.component';
import { DriverComponent } from './features/driver/driver.component';
import { DriverOTComponent } from './features/driverot/driverot.component';
import { EditRentalDetailComponent } from './features/edit-rental-detail/edit-rental-detail.component';
import { GenarateBillComponent } from './features/generate-bill/generate-bill.component';
import { LoginComponent } from './features/login/login.component';
import { MatadorComponent } from './features/matador/matador.component';
import { OwnerComponent } from './features/owner/owner.component';
import { PartyRatesComponent } from './features/party-rates/partyrates.component';
import { PartyComponent } from './features/party/party.component';
import { RentalDetailWalkinComponent } from './features/rental-detail-walkin/rental-detail-walkin.component';
import { RentalDetailComponent } from './features/rental-detail/rental-detail.component';
import { ReportToComponent } from './features/reportto/reportto.component';
import { UserRightComponent } from './features/user-rights/user-right.component';

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
  },
  {
    path: ROUTE_ADD_DDR_WALKIN,
    component:RentalDetailWalkinComponent
  },
  {
    path: ROUTE_GENERATE_BILL,
    component:GenarateBillComponent
  },
  {
    path: ROUTE_VIEW_BILL_CNN,
    component:MonthlyBillAComponent
  },
  {
    path: ROUTE_VIEW_BILL_CNN_CONTRACT,
    component:MonthlyContractAComponent
  },
  {
    path: ROUTE_VIEW_BILL_ONCALL_EXTRA,
    component:OnCallBillAComponent
  },
  {
    path: ROUTE_REPORTO,
    component:ReportToComponent
  },
  {
    path: ROUTE_VIEW_BILL_COAL_INDIA,
    component:CoalIndiaComponent
  },
  {
    path: ROUTE_VIEW_BILL_RELIANCE_MIS,
    component:RelianceMISComponent
  },
  {
    path: ROUTE_VIEW_BILL_RELIANCE_JMS,
    component:RelianceJMSComponent
  },
  {
    path: ROUTE_VIEW_BILL_RELIANCE_SUMMARY,
    component:RelinceSummaryComponent
  },
  {
    path: ROUTE_NEW_USER,
    component:UserComponent
  },
  {
    path: ROUTE_USER_RIGHTS,
    component:UserRightComponent
  },
  {
    path: ROUTE_MATADOR,
    component:MatadorComponent
  },
  {
    path: ROUTE_CHECK_DDR,
    component:CheckDdrComponent
  },
  {
    path: ROUTE_DRIVER_OT,
    component:DriverOTComponent
  },
  {
    path: ROUTE_COAL_INDEX,
    component:CoalIndexComponent
  },
  {
    path: ROUTE_ABP,
    component:AbpComponent
  },
  {
    path: ROUTE_EXPORT_DDR,
    component:DDRExportComponent
  }
  
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents= [LoginComponent]