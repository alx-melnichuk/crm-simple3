import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignoutComponent } from './signout.component';


@NgModule({
  declarations: [SignoutComponent],
  imports: [
    CommonModule
  ],
  exports: [SignoutComponent]
})
export class SignoutModule { }
