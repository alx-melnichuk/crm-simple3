import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TVHeaderComponent } from './t-v-header.component';



@NgModule({
  declarations: [TVHeaderComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [TVHeaderComponent]
})
export class TVHeaderModule { }
