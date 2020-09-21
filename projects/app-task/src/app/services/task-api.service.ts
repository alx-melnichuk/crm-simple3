import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TaskDto } from './task.interface';

export const API_TASK = '/api/task';
export const QP_TASK_IDS = 'ids';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {

  constructor(private http: HttpClient) {
  }

  public getData(data: { ids: number[] }): Observable<TaskDto[]> {
    let params: HttpParams = new HttpParams();
    params = params.append(QP_TASK_IDS, String(data.ids || []));
    return this.http.get<TaskDto[]>(API_TASK, { params });
  }
}
