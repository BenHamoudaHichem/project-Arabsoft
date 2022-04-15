import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, Inject, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponentPage } from './components/public/home/home.component';
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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardAdminComponent } from './components/public/dashboard-admin/dashboard-admin.component';
import { CookieService } from 'ngx-cookie-service';
import { HomeCustomerComponent } from './components/customer/home-customer/home-customer.component';
import { GuardAuthenticateGuard } from './services/guard-authenticate.guard';
import { DetailMaterialComponent } from './components/manager/detail-material/detail-material.component';
import { DetailTeamComponent } from './components/manager/detail-team/detail-team.component';
import { FiltreComponent } from './components/public/filtre/filtre.component';
import { SubscribeMembreComponent } from './components/manager/subscribe-membre/subscribe-membre.component';
import { NotFoundComponent } from './components/public/not-found/not-found.component';
import { CustomerProfilComponent } from './components/customer/customer-profil/customer-profil.component';
import { EditProfilComponent } from './components/customer/edit-profil/edit-profil.component';
import { HomeManagerComponent } from './components/manager/home-manager/home-manager.component';
import { UpdateMaterialComponent } from './components/manager/update-material/update-material.component';
import { ExpiredSessionComponent } from './components/public/expired-session/expired-session.component';
import { ShowReclamationComponent } from './components/customer/show-reclamation/show-reclamation.component';
import { CategoryComponent } from './components/manager/category/category.component';
import { MembersListComponent } from './components/manager/members-list/members-list.component';
import { CustomerListComponent } from './components/manager/customer-list/customer-list.component';
import { DetailsCustomerComponent } from './components/manager/details-customer/details-customer.component';
import { DetailCategoryComponent } from './components/manager/detail-category/detail-category.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';


export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
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
   }),
   TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: httpTranslateLoaderFactory,
      deps: [HttpClient]
    }
  })
  ],
  declarations: [
    AppComponent,
HomeComponentPage,
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
    DashboardAdminComponent,
    HomeCustomerComponent,
    DetailMaterialComponent,
    DetailTeamComponent,
    FiltreComponent,
    SubscribeMembreComponent,
    NotFoundComponent,
    CustomerProfilComponent,
    EditProfilComponent,
    HomeManagerComponent,
    UpdateMaterialComponent,
    ExpiredSessionComponent,
    ShowReclamationComponent,
    CategoryComponent,
    MembersListComponent,
    CustomerListComponent,
    DetailsCustomerComponent,
    DetailCategoryComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [CookieService,GuardAuthenticateGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
 }

