import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './modules/register/register.component';
import { DetailComponent } from './modules/detail/detail.component';
import { UpdateComponent } from './modules/update/update.component';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'home/register', component: RegisterComponent},
  { path: 'home/detail/:leaderNo',component: DetailComponent },
  { path: 'home/update/:leaderNo', component: UpdateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
