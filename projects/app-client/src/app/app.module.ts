import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from '../environments/environment';

import { Tracing } from './app.consts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientListModule } from './client-list/client-list.module';
import { ClientViewModule } from './client-view/client-view.module';
import { ClientApiService } from './services/client-api.service';
import { MockClientInterceptor } from './interceptors/mock-client.interceptor';

const provideMock = [
  { provide: HTTP_INTERCEPTORS, useClass: MockClientInterceptor, multi: true }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ClientListModule,
    ClientViewModule
  ],
  providers: [
    ClientApiService,
    ...(!environment.production ? provideMock : [])
  ]
})
export class AppModule {
  constructor() {
    Tracing.log('AppModule();');
  }
}
