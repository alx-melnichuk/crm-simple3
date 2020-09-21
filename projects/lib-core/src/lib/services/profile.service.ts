import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { ProfileApiService } from './profile-api.service';
import { ProfileDto } from './profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public get profileDto(): ProfileDto {
    return (this.innProfileDto == null ? null : (Object.assign({}, this.innProfileDto)) as ProfileDto);
  }
  public set profileDto(value: ProfileDto) {}

  private innProfileDto: ProfileDto;

  constructor(private profileApiService: ProfileApiService) {
    console.log('lib-core: ProfileService();');
  }

  // ** Public API **

  public loadProfile(profileId: number): Observable<ProfileDto[]> {
    this.innProfileDto = null;
    return this.profileApiService.getData({ ids: [profileId] })
      .pipe(
        take(1),
        tap((profiles: ProfileDto[]) => {
          if (profiles != null && profiles.length > 0) {
            this.innProfileDto = profiles[0];
          }
          return profiles;
        })
      );
  }

  public userName(): string {
    let result = '';
    if (this.innProfileDto != null) {
      const surname = (this.innProfileDto.surname || '');
      const name = (this.innProfileDto.name || '');
      result = surname + ' ' + name;
    }
    return result;
  }

  public availablePermissions(): string[] {
    return (this.innProfileDto != null ? this.innProfileDto.permissions : null);
  }

  // ** Private API **

}
