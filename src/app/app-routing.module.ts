import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCustomerComponent } from './components/customer/home-customer/home-customer.component';
import { AddCustomersComponent } from './components/manager/add-customers/add-customers.component';
import { CreateInterventionComponent } from './components/manager/create-intervention/create-intervention.component';
import { DetailInterventionComponent } from './components/manager/detail-intervention/detail-intervention.component';
import { DetailReclamationComponent } from './components/manager/detail-reclamation/detail-reclamation.component';
import { InterventionListComponent } from './components/manager/intervention-list/intervention-list.component';
import { MaterialListComponent } from './components/manager/material-list/material-list.component';
import { ReclamationListComponent } from './components/manager/reclamation-list/reclamation-list.component';
import { SelectManagerComponent } from './components/manager/select-manager/select-manager.component';
import { TeamListComponent } from './components/manager/team-list/team-list.component';
import { UpdateInterventionComponent } from './components/manager/update-intervention/update-intervention.component';
import { AboutUsComponent } from './components/public/about-us/about-us.component';
import { ContactUSComponent } from './components/public/contact-us/contact-us.component';
import { DashboardAdminComponent } from './components/public/dashboard-admin/dashboard-admin.component';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { RegisterComponent } from './components/public/register/register.component';
import { GuardAuthenticateGuard } from './services/guard-authenticate.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: DashboardAdminComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  //{ path: '**', redirectTo: '/home' },
  { path: 'home', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'propos', component: AboutUsComponent },

  { path: 'contact', component: ContactUSComponent },

  {
    path: 'customer/reclamationList',
    component: ReclamationListComponent,
    canActivate: [GuardAuthenticateGuard],
    data: {
      role: 'ROLE_USER',
    },
  },

  {
    path: 'manager/subscribeEmployee',
    component: AddCustomersComponent,
   /* canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' },*/
  },

  {
    path: 'manager/interventionList',
    component: InterventionListComponent,
  /*  canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' },*/
  },

  {
    path: 'customer/home',
    component: HomeCustomerComponent,
   /* canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_USER' ,},*/
  },

  {
    path: 'manager/materialList',
    component: MaterialListComponent,
   /* canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' ,},*/
  },

  {
    path: 'manager/detailIntervention',
    component: DetailInterventionComponent,
    /*canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' },*/
  },
  {
    path: 'customer/detailReclamation',
    component: DetailReclamationComponent,
 /*   canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_USER' },*/
  },
  {
    path: 'manager/createIntervention',
    component: CreateInterventionComponent,
    /*canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' },*/
  },
  {
    path: 'manager/updateIntervention',
    component: UpdateInterventionComponent,
    /*canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' },*/
  },
  {
    path: 'manager/selectTeamManager',
    component: SelectManagerComponent,
   /* canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' },*/
  },

  {
    path: 'manager/teamList',
    component: TeamListComponent,
  /*canActivate: [GuardAuthenticateGuard],
    data: { role: 'ROLE_MANAGER' },*/
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
