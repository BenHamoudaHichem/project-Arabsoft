import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
