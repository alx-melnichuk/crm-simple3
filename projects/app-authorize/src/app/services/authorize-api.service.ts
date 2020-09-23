import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tracing } from '../app.consts';

import { AuthorizeDto } from './authorize.interface';

export const API_AUTHORIZE = '/api/authorize';
export const API_AUTHORIZE_SIGNIN = API_AUTHORIZE + '/signin';
export const API_AUTHORIZE_SIGNOUT = API_AUTHORIZE + '/signout';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeApiService {

  constructor(private http: HttpClient) {
    Tracing.log('AuthorizeApiService();');
  }

  public signin(data: { login: string, password: string }): Observable<AuthorizeDto> {
    return this.http.post<AuthorizeDto>(API_AUTHORIZE_SIGNIN, data);
  }

  public signout(): Observable<boolean> {
    return this.http.get<boolean>(API_AUTHORIZE_SIGNOUT);
  }
}
