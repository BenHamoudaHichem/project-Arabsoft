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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    RegisterComponent,
    LoginComponent,
    NavBarComponent,
    FooterComponent,
    ContactUSComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
