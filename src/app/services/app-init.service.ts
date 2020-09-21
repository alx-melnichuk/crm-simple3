import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProfileService, ProfileDto, AutoUnsubscribe } from '../../../projects/lib-core/src/public-api';

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
    console.log('main: AppInitService();');
  }

  // ** Public API **

  public initProfile(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const profileId = 1;
      if (profileId == null) {
        this.router.navigate(['/app-task/list']); // TODO Implement the transition to the authorization route.
        resolve();
      } else {
        if (this.unsubLoadProfile != null) {
          this.unsubLoadProfile.unsubscribe();
        }
        this.unsubLoadProfile = this.profileService.loadProfile(profileId)
          .subscribe((profiles: ProfileDto[]) => {
            resolve();
          });
      }
    });
  }
}
