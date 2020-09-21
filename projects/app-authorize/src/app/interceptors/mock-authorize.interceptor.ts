import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthorizeDto } from '../services/authorize.interface';
import { DEMO_USER1_LOGIN, DEMO_USER1_PASSWD, DEMO_USER2_LOGIN, DEMO_USER2_PASSWD } from '../../../../lib-core/src/lib/constants/core.constants';
import { API_AUTHORISE_LOGIN } from '../services/authorize-api.service';


@Injectable({
  providedIn: 'root'
})
export class MockAuthorizeInterceptor implements HttpInterceptor {

  private authorizeProvider: AuthorizeProvider = new AuthorizeProvider();

  constructor() {
    console.log('app-authorize: MockAuthorizeInterceptor();');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url !== API_AUTHORISE_LOGIN) {
      return next.handle(req);
    }
    let response = {};
    const delayTime = 100;
    switch (req.method) {
      case 'POST':
        const login = '';
        const password = '';
        response = this.authorizeProvider.get({ login, password });
        break;
      default:
        break;
    }
    return of(new HttpResponse({ status: 200, body: response })).pipe(delay(delayTime));
  }
}


class AuthorizeProvider {
  private authorizeList: AuthorizeDto[] = this.createList();

  constructor() {
  }

  // ** Public API **

  public get(data: { login: string, password: string }): AuthorizeDto[] {
    const result: AuthorizeDto[] = this.authorizeList.slice();
    if (!!data.login && !!data.password) {
      const authorizeDto: AuthorizeDto = result.find(item => data.login === item.login && data.password === item.password);
      if (authorizeDto != null) {
        result.push(authorizeDto);
      }
    }
    return result;
  }

  public delete(data: { ids: number[] }): string {
    if (Array.isArray(data.ids)) {
      for (const id of data.ids) {
        const index = this.authorizeList.findIndex(item => item.id === id);
        if (index > -1) {
          this.authorizeList.splice(index, 1);
        }
      }
    }
    return null;
  }

  // ** Privat API **

  private createList(): AuthorizeDto[] {
    const result: AuthorizeDto[] = [];
    result.push(this.createAuthorize(1, DEMO_USER1_LOGIN, DEMO_USER1_PASSWD, 1));
    result.push(this.createAuthorize(2, DEMO_USER2_LOGIN, DEMO_USER2_PASSWD, 2));
    return result;
  }

  private createAuthorize(id: number, login: string, password: string, profileId: number): AuthorizeDto {
    return {
      id,
      login,
      password,
      profileId
    };
  }

}
