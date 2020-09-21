import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CVHeaderComponent } from './c-v-header.component';


@NgModule({
  declarations: [CVHeaderComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [CVHeaderComponent]
})
export class CVHeaderModule { }
