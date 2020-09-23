import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Tracing } from '../app.consts';
import { AuthorizeDto } from '../services/authorize.interface';
import {
  DEMO_LOGIN1, DEMO_PASSWD1, DEMO_PROFILE_ID1, DEMO_LOGIN2, DEMO_PASSWD2, DEMO_PROFILE_ID2, USER_AUTHORIZE
} from '../../../../lib-core/src/lib/lib-core.const';
import { API_AUTHORIZE, API_AUTHORIZE_SIGNIN, API_AUTHORIZE_SIGNOUT } from '../services/authorize-api.service';


@Injectable({
  providedIn: 'root'
})
export class MockAuthorizeInterceptor implements HttpInterceptor {

  private authorizeProvider: AuthorizeProvider = new AuthorizeProvider();

  constructor(private router: Router) {
    Tracing.log('MockAuthorizeInterceptor();');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(API_AUTHORIZE)) {
      return next.handle(req);
    }
    let response: Partial<{}> = {};
    const delayTime = 100;
    let status = 500;
    if (req.url === API_AUTHORIZE_SIGNIN) {
      response = this.handleSignin(req);
      status = 200;
    } else if (req.url === API_AUTHORIZE_SIGNOUT) {
      response = this.handleSignout(req);
      status = 200;
    }
    return of(new HttpResponse({ status, body: response })).pipe(delay(delayTime));
  }

  private handleSignin(req: HttpRequest<any>): Partial<{}> {
    let result: Partial<{}> = {};
    const method = (req != null ? req.method : null);
    switch (method) {
      case 'POST':
        sessionStorage.removeItem(USER_AUTHORIZE);
        result = this.authorizeProvider.get({ login: req.body.login, password: req.body.password });
        if (result != null) {
          const authorizeJson = JSON.stringify(result);
          sessionStorage.setItem(USER_AUTHORIZE, String(authorizeJson));
        }
        break;
      default:
        break;
    }
    return result;
  }

  private handleSignout(req: HttpRequest<any>): Partial<{}> {
    let result: Partial<{}> = {};
    const method = (req != null ? req.method : null);
    switch (method) {
      case 'GET':
        sessionStorage.removeItem(USER_AUTHORIZE);
        result = {};
        break;
      default:
        break;
    }
    return result;
  }
}


class AuthorizeProvider {
  private authorizeList: AuthorizeDto[] = this.createList();

  constructor() {
  }

  // ** Public API **

  public get(data: { login: string, password: string }): AuthorizeDto {
    let result: AuthorizeDto = null;
    const list: AuthorizeDto[] = this.authorizeList.slice();
    if (!!data.login) {
      const authorizeDto: AuthorizeDto = list.find(item => data.login === item.login && data.password === item.password);
      if (authorizeDto != null) {
        const authorizeData = Object.assign({}, authorizeDto, { password: null });
        result = authorizeData;
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
    result.push(this.createAuthorize(1, DEMO_LOGIN1, DEMO_PASSWD1, DEMO_PROFILE_ID1));
    result.push(this.createAuthorize(2, DEMO_LOGIN2, DEMO_PASSWD2, DEMO_PROFILE_ID2));
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
