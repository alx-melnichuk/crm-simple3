import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientListComponent } from './client-list.component';
import { CLHeaderModule } from './c-l-header/c-l-header.module';
import { CLMiddleModule } from './c-l-middle/c-l-middle.module';


@NgModule({
  declarations: [ClientListComponent],
  imports: [
    CommonModule,
    CLHeaderModule,
    CLMiddleModule,
  ],
  exports: [ClientListComponent]
})
export class ClientListModule { }
