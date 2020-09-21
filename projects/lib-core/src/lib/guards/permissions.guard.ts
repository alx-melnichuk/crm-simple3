import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../../../../src/environments/environment';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate, CanLoad {

  constructor(private profileService: ProfileService) {
  }

  // ** Public API **

  public canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkPermissions('canActivate', route.data.permissions, this.profileService.availablePermissions());
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const result = this.checkPermissions('canLoad', route.data.permissions, this.profileService.availablePermissions());
    return result;
  }

  // ** Private API **

  private checkPermissions(info: string, requiredPermissions: string[], availablePermissions: string[]): boolean {
    const innRequiredPermissions = (requiredPermissions || []);
    const innAvailablePermissions = (availablePermissions || []);
    let result = true;
    for (let i = 0, len = innRequiredPermissions.length; i < len && result; i++) {
      result = (innAvailablePermissions.indexOf(innRequiredPermissions[i]) > -1);
      if (!result && !environment.production) {
        console.error('PermissionsGuard.' + (!!info ? info : 'checkPermissions') + '("' + innRequiredPermissions[i] + '") - false');
      }
    }
    return result;
  }

}
