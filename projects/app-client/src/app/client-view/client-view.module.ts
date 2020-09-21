import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientViewComponent } from './client-view.component';
import { CVHeaderModule } from './c-v-header/c-v-header.module';
import { CVMiddleModule } from './c-v-middle/c-v-middle.module';


@NgModule({
  declarations: [ClientViewComponent],
  imports: [
    CommonModule,
    CVHeaderModule,
    CVMiddleModule
  ],
  exports: [ClientViewComponent]
})
export class ClientViewModule { }
