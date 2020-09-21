import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TLHeaderComponent } from './t-l-header.component';



@NgModule({
  declarations: [TLHeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [TLHeaderComponent]
})
export class TLHeaderModule { }
