import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInterventionComponent } from './components/manager/create-intervention/create-intervention.component';
import { DetailInterventionComponent } from './components/manager/detail-intervention/detail-intervention.component';
import { DetailReclamationComponent } from './components/manager/detail-reclamation/detail-reclamation.component';
import { InterventionListComponent } from './components/manager/intervention-list/intervention-list.component';
import { MaterialListComponent } from './components/manager/material-list/material-list.component';
import { ReclamationListComponent } from './components/manager/reclamation-list/reclamation-list.component';
import { SelectTeamManagerComponent } from './components/manager/select-team-manager/select-team-manager.component';
import { TeamListComponent } from './components/manager/team-list/team-list.component';
import { AboutUsComponent } from './components/public/about-us/about-us.component';
import { ContactUSComponent } from './components/public/contact-us/contact-us.component';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { RegisterComponent } from './components/public/register/register.component';

const routes: Routes = [
{path:"",component:HomeComponent},
{path:"login",component:LoginComponent},
{path:"register",component:RegisterComponent},
{path:"propos",component:AboutUsComponent},
{path:"contact",component:ContactUSComponent},
{path:"reclamationList",component:ReclamationListComponent},
{path:"interventionList",component:InterventionListComponent},

{path:"materialList",component:MaterialListComponent},
{path:"detailIntervention",component:DetailInterventionComponent},
{path:"detailReclamation",component:DetailReclamationComponent},

{path:"createIntervention",component:CreateInterventionComponent},
{path:"selectTeamManager",component:SelectTeamManagerComponent},

{path:"teamList",component:TeamListComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
