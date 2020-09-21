import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ProfileDto } from './profile.interface';

export const API_PROFILE = '/api/profile';
export const QP_PROFILE_IDS = 'ids';

const STACKBLITZ = true;

const appClient = 'appClient';
const clientList = 'clientList';
const clientView = 'clientView';
const appTask = 'appTask';
const taskList = 'taskList';
const taskView = 'taskView';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {

  private profileList = (STACKBLITZ ? this.createList() : null);

  constructor(private http: HttpClient) {
    console.log('lib-core: ProfileApiService();');
  }

  public getData(data: { ids: number[] }): Observable<ProfileDto[]> {
    let params: HttpParams = new HttpParams();
    params = params.append(QP_PROFILE_IDS, String(data.ids || []));
    return (STACKBLITZ
      ? of(this.profileList.filter(item => data.ids.includes(item.id)))
      : this.http.get<ProfileDto[]>(API_PROFILE, { params }));
  }

  private createList(): ProfileDto[] {
    const result: ProfileDto[] = [];
    result.push(this.create(1, 'Petrenko', 'Alexey', 'Ivanovich', 'user1',
      [appClient, clientList, clientView, appTask, taskList, taskView]));
    result.push(this.create(2, 'Quinn', 'Harley', '', 'user2',
      [appClient, clientList, clientView, appTask, taskList, taskView]));
    return result;
  }

  private create(
    id: number, surname: string, name: string, patronymic: string, login: string, permissions: string[]
  ): ProfileDto {
    return { id, surname, name, patronymic, email: surname + '@crm-simple.ua', login, permissions };
  }

}
