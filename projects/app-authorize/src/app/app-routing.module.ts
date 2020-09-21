import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RB_LOGIN } from './app.consts';
import { LoginComponent } from './login/login.component';

const itemRoutes: Routes = [
  {
    path: RB_LOGIN,
    component: LoginComponent
  }
];

const routes: Routes = [
  { path: '', component: AppComponent, children: itemRoutes }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
