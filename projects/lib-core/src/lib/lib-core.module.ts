import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { LibCoreComponent } from './lib-core.component';
import { PermissionsGuard } from './guards/permissions.guard';
import { ProfileApiService } from './services/profile-api.service';
import { ProfileService } from './services/profile.service';
import { Tracing } from './lib-core.const';


@NgModule({
  declarations: [LibCoreComponent],
  imports: [
    HttpClientModule
  ],
  exports: [LibCoreComponent],
  providers: [
    ProfileApiService,
    ProfileService,
    PermissionsGuard
  ]
})
export class LibCoreModule {
  constructor() {
    Tracing.log('LibCoreModule();');
  }
}
