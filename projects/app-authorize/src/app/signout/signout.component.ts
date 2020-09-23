import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AutoUnsubscribe } from '../../../../lib-core/src/lib/decorators/auto-unsubscribe';
import { VERSION_APP } from '../../../../lib-core/src/lib/lib-core.const';
import { AuthorizeApiService } from '../services/authorize-api.service';
import { ProfileService } from '../../../../lib-core/src/lib/services/profile.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
@AutoUnsubscribe()
export class SignoutComponent implements OnInit {

  public version: string | null = VERSION_APP;

  private unsubSignout: Subscription;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authorizeApiService: AuthorizeApiService
  ) {
  }

  ngOnInit(): void {
    this.profileService.clearProfile();
    this.unsubSignout = this.authorizeApiService.signout()
    .subscribe((response) => {
      console.log('response=', response);
    });

  }

  // ** Public API **

  public clickGoToAuthorization(): void {
    this.router.navigate(['/app-authorize/signin']);
  }
}
