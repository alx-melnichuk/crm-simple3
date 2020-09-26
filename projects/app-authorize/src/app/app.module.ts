import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Tracing } from './app.consts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninModule } from './signin/signin.module';
import { AuthorizeApiService } from './services/authorize-api.service';
import { SignoutModule } from './signout/signout.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SigninModule,
    SignoutModule
  ],
  providers: [
    AuthorizeApiService
  ]
})
export class AppModule {
  constructor() {
    Tracing.log('AppModule');
  }
}
