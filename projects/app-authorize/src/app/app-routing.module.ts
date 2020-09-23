import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RB_SIGNIN, RB_SIGNOUT } from './app.consts';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';

const itemRoutes: Routes = [
  {
    path: RB_SIGNIN,
    component: SigninComponent
  },
  {
    path: RB_SIGNOUT,
    component: SignoutComponent
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
