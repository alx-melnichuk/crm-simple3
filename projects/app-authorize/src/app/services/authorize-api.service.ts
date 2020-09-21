import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthorizeDto } from './authorize.interface';


export const API_AUTHORISE_LOGIN = '/api/authorize/login';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeApiService {

  constructor(private http: HttpClient) {
    console.log('app-authorize: AuthorizeApiService();');
  }

  public checkLogin(data: { login: string, password: string }): Observable<AuthorizeDto[]> {
    return this.http.post<AuthorizeDto[]>(API_AUTHORISE_LOGIN, data);
  }
}
