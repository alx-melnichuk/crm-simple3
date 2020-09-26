import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LibCoreComponent } from './lib-core.component';
import { PermissionsGuard } from './guards/permissions.guard';
import { ProfileApiService } from './services/profile-api.service';
import { ProfileService } from './services/profile.service';
import { Tracing } from './lib-core.const';


@NgModule({
  declarations: [LibCoreComponent],
  imports: [ ],
  exports: [LibCoreComponent],
  providers: [
    ProfileApiService,
    ProfileService,
    PermissionsGuard
  ]
})
export class LibCoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: LibCoreModule) {
    Tracing.log('LibCoreModule();');
    if (parentModule) {
      throw new Error('LibCoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
