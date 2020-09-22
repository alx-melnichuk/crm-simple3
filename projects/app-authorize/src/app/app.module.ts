import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';

import { Tracing } from './app.consts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninModule } from './signin/signin.module';
import { AuthorizeApiService } from './services/authorize-api.service';
import { MockAuthorizeInterceptor } from './interceptors/mock-authorize.interceptor';

const provideMock = [
  { provide: HTTP_INTERCEPTORS, useClass: MockAuthorizeInterceptor, multi: true }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    SigninModule
  ],
  providers: [
    AuthorizeApiService,
    ...(!environment.production ? provideMock : [])
  ]
})
export class AppModule {
  constructor() {
    Tracing.log('AppModule');
  }
}
