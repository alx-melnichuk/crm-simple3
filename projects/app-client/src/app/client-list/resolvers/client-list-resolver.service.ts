import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ClientApiService } from '../../services/client-api.service';
import { ClientDto } from '../../services/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientListResolverService implements Resolve<ClientDto[]> {

  constructor(
    private clientApiService: ClientApiService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ClientDto[] | Observable<ClientDto[]> | Promise<ClientDto[]> {
    return this.clientApiService.getData({ ids: [] })
      .pipe(
        take(1) // https://v9.angular.io/guide/router#resolve-pre-fetching-component-data (crisis-detail-resolver.service.ts)
      );
  }
}
