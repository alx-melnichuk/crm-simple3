import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from '../environments/environment';
import { LibCoreModule } from '../../projects/lib-core/src/lib/lib-core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AppInitService } from './services/app-init.service';
import { Tracing } from './app.consts';
import { MockClientInterceptor } from './interceptors/mock-client.interceptor';
import { MockTaskInterceptor } from './interceptors/mock-task.interceptor';
import { MockAuthorizeInterceptor } from './interceptors/mock-authorize.interceptor';

const provideMock = [
  { provide: HTTP_INTERCEPTORS, useClass: MockClientInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: MockTaskInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: MockAuthorizeInterceptor, multi: true }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule, // ** Must be loaded first **
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LibCoreModule
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitService: AppInitService) => () => appInitService.initProfile(),
      deps: [AppInitService],
      multi: true
    },
    ...(!environment.production ? provideMock : [])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    Tracing.log('AppModule();');
  }
}
