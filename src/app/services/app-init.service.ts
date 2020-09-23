import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { Tracing } from '../app.consts';
import { ProfileService, ProfileDto, AutoUnsubscribe } from '../../../projects/lib-core/src/public-api';
import { USER_AUTHORIZE } from '../../../projects/lib-core/src/lib/lib-core.const';

@Injectable({
  providedIn: 'root'
})
@AutoUnsubscribe()
export class AppInitService {

  private unsubLoadProfile: Subscription;

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {
    Tracing.log('AppInitService();');
  }

  // ** Public API **

  public initProfile(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const profileId = this.getPofileId();
      if (profileId == null) {
        this.goToAuthorization();
        resolve();
      } else {
        if (this.unsubLoadProfile != null) {
          this.unsubLoadProfile.unsubscribe();
        }
        this.unsubLoadProfile = this.profileService.loadProfile(profileId)
          .subscribe((profile: ProfileDto) => {
            if (profile == null) {
              this.goToAuthorization();
            }
            resolve();
          });
      }
    });
  }

  // ** Private API **

  private getPofileId(): number {
    const authorizeJson = sessionStorage.getItem(USER_AUTHORIZE);
    const authorize = (authorizeJson != null ? JSON.parse(authorizeJson) : null);
    return (authorize != null ? authorize.profileId : null);
  }

  private goToAuthorization(): void {
    this.router.navigate(['/app-authorize/signin']);
  }
}
