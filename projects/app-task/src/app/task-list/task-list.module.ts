import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListComponent } from './task-list.component';
import { TLHeaderModule } from './t-l-header/t-l-header.module';
import { TLMiddleModule } from './t-l-middle/t-l-middle.module';


@NgModule({
  declarations: [TaskListComponent],
  imports: [
    CommonModule,
    TLHeaderModule,
    TLMiddleModule
  ],
  exports: [TaskListComponent]
})
export class TaskListModule { }
