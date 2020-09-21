import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { LibCoreComponent } from './lib-core.component';
import { PermissionsGuard } from './guards/permissions.guard';
import { ProfileApiService } from './services/profile-api.service';
import { ProfileService } from './services/profile.service';


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
    console.log('lib-core: LibCoreModule();');
  }
}
