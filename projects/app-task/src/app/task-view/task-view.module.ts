import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskViewComponent } from './task-view.component';
import { TVHeaderModule } from './t-v-header/t-v-header.module';
import { TVMiddleModule } from './t-v-middle/t-v-middle.module';


@NgModule({
  declarations: [TaskViewComponent],
  imports: [
    CommonModule,
    TVHeaderModule,
    TVMiddleModule
  ],
  exports: [TaskViewComponent]
})
export class TaskViewModule { }
