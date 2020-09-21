import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { CLMiddleComponent } from './c-l-middle.component';


@NgModule({
  declarations: [CLMiddleComponent],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [CLMiddleComponent]
})
export class CLMiddleModule { }
