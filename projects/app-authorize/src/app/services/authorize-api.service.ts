import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tracing } from '../../../../app-task/src/app/app.consts';

import { AuthorizeDto } from './authorize.interface';


export const API_AUTHORISE_SIGNIN = '/api/authorize/signin';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeApiService {

  constructor(private http: HttpClient) {
    Tracing.log('AuthorizeApiService();');
  }

  public signin(data: { login: string, password: string }): Observable<AuthorizeDto[]> {
    return this.http.post<AuthorizeDto[]>(API_AUTHORISE_SIGNIN, data);
  }
}
