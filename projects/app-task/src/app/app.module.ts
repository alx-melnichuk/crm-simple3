import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListModule } from './task-list/task-list.module';
import { TaskViewModule } from './task-view/task-view.module';
import { TaskApiService } from './services/task-api.service';
import { MockTaskInterceptor } from './interceptors/mock-task.interceptor';

const provideMock = [
  { provide: HTTP_INTERCEPTORS, useClass: MockTaskInterceptor, multi: true }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    TaskListModule,
    TaskViewModule
  ],
  providers: [
    TaskApiService,
    ...(!environment.production ? provideMock : [])
  ]
})
export class AppModule {
  constructor() {
    console.log('app-task: AppModule();');
  }
}
