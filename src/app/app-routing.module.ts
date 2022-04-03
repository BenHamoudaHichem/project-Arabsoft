import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerProfilComponent } from './components/customer/customer-profil/customer-profil.component';
import { EditProfilComponent } from './components/customer/edit-profil/edit-profil.component';
import { HomeCustomerComponent } from './components/customer/home-customer/home-customer.component';
import { AddFileMaterialsComponent } from './components/manager/add-file-materials/add-file-materials.component';
import { AddFileMembersComponent } from './components/manager/add-file-members/add-file-members.component';
import { AddMaterialsComponent } from './components/manager/add-materials/add-materials.component';
import { AddTeamComponent } from './components/manager/add-team/add-team.component';
import { CreateInterventionComponent } from './components/manager/create-intervention/create-intervention.component';
import { DetailInterventionComponent } from './components/manager/detail-intervention/detail-intervention.component';
import { DetailMaterialComponent } from './components/manager/detail-material/detail-material.component';
import { DetailReclamationComponent } from './components/manager/detail-reclamation/detail-reclamation.component';
import { DetailTeamComponent } from './components/manager/detail-team/detail-team.component';
import { InterventionListComponent } from './components/manager/intervention-list/intervention-list.component';
import { MaterialListComponent } from './components/manager/material-list/material-list.component';
import { ReclamationListComponent } from './components/manager/reclamation-list/reclamation-list.component';
import { SubscribeMembreComponent } from './components/manager/subscribe-membre/subscribe-membre.component';
import { TeamListComponent } from './components/manager/team-list/team-list.component';
import { AboutUsComponent } from './components/public/about-us/about-us.component';
import { ContactUSComponent } from './components/public/contact-us/contact-us.component';
import { DashboardAdminComponent } from './components/public/dashboard-admin/dashboard-admin.component';
import { HomeComponentPage } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { NotFoundComponent } from './components/public/not-found/not-found.component';
import { RegisterComponent } from './components/public/register/register.component';
import { GuardAuthenticateGuard } from './services/guard-authenticate.guard';
import { CreateReclamationComponent } from './components/customer/create-reclamation/create-reclamation.component';
import { HomeManagerComponent } from './components/manager/home-manager/home-manager.component';
import { UpdateMaterialComponent } from './components/manager/update-material/update-material.component';
const roles={"customer":"ROLE_USER",
"manager":"ROLE_MANAGER"}
const routes: Routes = [

  { path: 'home', component: HomeComponentPage },
  { path: 'admin', component: DashboardAdminComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'propos', component: AboutUsComponent },
  { path: 'contact', component: ContactUSComponent },


  { path: 'dashboard', component: DashboardAdminComponent,children:[
/**
 * Role customer
 */

        {
          path: 'customer/home',
          component: HomeCustomerComponent,
         canActivate: [GuardAuthenticateGuard],
          data: { role: roles.customer },
        },

        {
          path: 'customer/createReclamation',
          component: CreateReclamationComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.customer },
        },
        {
          path: 'customer/customerProfil',
          component: CustomerProfilComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.customer },
        },
        {
          path: 'customer/editProfil',
          component: EditProfilComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.customer },
        },
        {
          path: 'customer/home',
          component: HomeCustomerComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.customer },
        },

        {
          path: 'customer/customerProfil',
          component: CustomerProfilComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.customer },
        },
        {
          path: 'customer/editProfil',
          component: EditProfilComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.customer },
        },
        {
          path: 'customer',
          redirectTo: '/dashboard/customer/home', pathMatch: 'full' ,
    
        },
        /**
         * End customer
         */
        /**
         * ROLE Manager
         */
        {
          path: 'manager/home',
          component: HomeManagerComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.manager },
        },
            {
              path: 'manager/reclamationList',
              component: ReclamationListComponent,
              canActivate: [GuardAuthenticateGuard],
              data: { role: roles.manager },

            },
            {
              path: 'manager/subscribeMembre',
              component: SubscribeMembreComponent,
              canActivate: [GuardAuthenticateGuard],
              data: { role: roles.manager },
            },
            {
              path: 'manager/addTeam',
              component: AddTeamComponent,
              canActivate: [GuardAuthenticateGuard],
              data: { role: roles.manager },
            },
            {
              path: 'manager/interventionList',
              component: InterventionListComponent,
              canActivate: [GuardAuthenticateGuard],
              data: { role: roles.manager },
            },

        {
          path: 'manager/materialList',
          component: MaterialListComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.manager },
        },
        {
          path: 'manager/addMaterial',
          component: AddMaterialsComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.manager },
        }, {
          path: 'manager/detailReclamation',
          component: DetailReclamationComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.manager },
        },

        {
          path: 'manager/detailIntervention',
          component: DetailInterventionComponent,
          canActivate: [GuardAuthenticateGuard],
          data: { role: roles.manager },
        },
  {
    path: 'manager/createIntervention',
    component: CreateInterventionComponent,
    canActivate: [GuardAuthenticateGuard],
    data: { role: roles.manager },
  },
  {
    path: 'manager/detailMaterial',
    component: DetailMaterialComponent,
    canActivate: [GuardAuthenticateGuard],
    data: { role: roles.manager },
  },



  {
    path: 'manager/updateMaterial',
    component: UpdateMaterialComponent,
    canActivate: [GuardAuthenticateGuard],
    data: { role: roles.manager },
  },
  {
    path: 'manager/detailTeam',
    component: DetailTeamComponent,
    canActivate: [GuardAuthenticateGuard],
    data: { role: roles.manager },
  },
  {
    path: 'manager/teamList',
    component: TeamListComponent,
    canActivate: [GuardAuthenticateGuard],
    data: { role: roles.manager },
  },
  {
    path: 'manager/demandList',
    component: ReclamationListComponent,
    canActivate: [GuardAuthenticateGuard],
          data: { role: roles.manager },
  },
  {
    path: 'manager/fileMembersUpload',
    component: AddFileMembersComponent,
    canActivate: [GuardAuthenticateGuard],
    data: { role: roles.manager },
  },

  {
    path: 'manager/fileMaterialsUpload',
    component: AddFileMaterialsComponent,
    canActivate: [GuardAuthenticateGuard],
    data: { role: roles.manager },
  },
  /**
   * End manager
   */


  { path: 'not-found', component: NotFoundComponent },

  { path: '**', redirectTo: '/dashboard/not-found', pathMatch: 'full' },
  { path: '', redirectTo: '/dashboard/not-found', pathMatch: 'full' },

      ]
    },


    { path: '', redirectTo: '/home', pathMatch: 'full' },


{ path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
