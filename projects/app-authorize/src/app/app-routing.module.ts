import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RB_SIGNIN } from './app.consts';
import { SigninComponent } from './signin/signin.component';

const itemRoutes: Routes = [
  {
    path: RB_SIGNIN,
    component: SigninComponent
  },
  {
    path: '**',
    redirectTo: RB_SIGNIN
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
