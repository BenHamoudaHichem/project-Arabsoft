import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/public/home/home.component';
import { AboutUsComponent } from './components/public/about-us/about-us.component';
import { RegisterComponent } from './components/public/register/register.component';
import { LoginComponent } from './components/public/login/login.component';
import { NavBarComponent } from './components/public/additional/nav-bar/nav-bar.component';
import { FooterComponent } from './components/public/additional/footer/footer.component';
import { ContactUSComponent } from './components/public/contact-us/contact-us.component';
import { InterventionListComponent } from './components/manager/intervention-list/intervention-list.component';
import { AddMaterialsComponent } from './components/manager/add-materials/add-materials.component';
import { CreateReclamationComponent } from './components/customer/create-reclamation/create-reclamation.component';
import { AddTeamComponent } from './components/manager/add-team/add-team.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddFileMembersComponent } from './components/manager/add-file-members/add-file-members.component';
import { AddFileMaterialsComponent } from './components/manager/add-file-materials/add-file-materials.component';
import { AgmCoreModule } from '@agm/core';
import { CreateInterventionComponent } from './components/manager/create-intervention/create-intervention.component';
import { DetailReclamationComponent } from './components/manager/detail-reclamation/detail-reclamation.component';
import { DetailInterventionComponent } from './components/manager/detail-intervention/detail-intervention.component';
import { TeamListComponent } from './components/manager/team-list/team-list.component';
import { MaterialListComponent } from './components/manager/material-list/material-list.component';
import { ReclamationListComponent } from './components/manager/reclamation-list/reclamation-list.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SelectManagerComponent } from './components/manager/select-manager/select-manager.component';
import { DashboardAdminComponent } from './components/public/dashboard-admin/dashboard-admin.component';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    RegisterComponent,
    LoginComponent,
    NavBarComponent,
    FooterComponent,
    ContactUSComponent,
    InterventionListComponent,
    AddMaterialsComponent,
    CreateReclamationComponent,
    AddTeamComponent,
    AddFileMembersComponent,
    AddFileMaterialsComponent,
    CreateInterventionComponent,
    DetailReclamationComponent,
    DetailInterventionComponent,
    TeamListComponent,
    MaterialListComponent,
    ReclamationListComponent,
    SelectManagerComponent,
    DashboardAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgMultiSelectDropDownModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCYYC0LjtQyFdL2PfLbUymRPuBjKlMtvcs',
      libraries: ['places']
   })
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
