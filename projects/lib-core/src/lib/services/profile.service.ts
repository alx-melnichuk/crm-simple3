import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Tracing } from '../lib-core.const';

import { ProfileApiService } from './profile-api.service';
import { ProfileDto } from './profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public get profileDto(): ProfileDto {
    return this.cloneProfileDto(this.innProfileDto);
  }
  public set profileDto(value: ProfileDto) {}
  public profileDto$: Subject<ProfileDto> = new BehaviorSubject<ProfileDto>(null);

  private innProfileDto: ProfileDto;

  constructor(private profileApiService: ProfileApiService) {
    Tracing.log('ProfileService();');
  }

  // ** Public API **

  public loadProfile(profileId: number): Observable<ProfileDto> {
    this.innProfileDto = null;
    return this.profileApiService.getData({ ids: [profileId] })
      .pipe(
        take(1),
        map((profiles: ProfileDto[]) => {
          if (profiles != null && profiles.length > 0) {
            this.innProfileDto = this.cloneProfileDto(profiles[0]);
            this.profileDto$.next(this.cloneProfileDto(profiles[0]));
          }
          return this.innProfileDto;
        })
      );
  }

  public userName(profileDto: ProfileDto): string {
    let result = '';
    if (profileDto != null) {
      const surname = (profileDto.surname || '');
      const name = (profileDto.name || '');
      result = surname + ' ' + name;
    }
    return result;
  }

  public availablePermissions(): string[] {
    return (this.innProfileDto != null ? this.innProfileDto.permissions : null);
  }

  public clearProfile(): void {
    this.innProfileDto = null;
    this.profileDto$.next(null);
  }

  // ** Private API **

  private cloneProfileDto(profileDto: ProfileDto): ProfileDto {
    return (profileDto == null ? null : Object.assign({}, profileDto));
  }
}
