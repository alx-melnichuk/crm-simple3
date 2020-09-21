import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { TLMiddleComponent } from './t-l-middle.component';


@NgModule({
  declarations: [TLMiddleComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [TLMiddleComponent]
})
export class TLMiddleModule { }
