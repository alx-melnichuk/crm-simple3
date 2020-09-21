import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { RP_TASK_ID } from '../../app.consts';
import { TaskApiService } from '../../services/task-api.service';
import { TaskDto } from '../../services/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskResolverService implements Resolve<TaskDto[]> {

  constructor(
    private taskApiService: TaskApiService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TaskDto[] | Observable<TaskDto[]> | Promise<TaskDto[]> {
    const ids = [];
    if (route.paramMap.has(RP_TASK_ID)) {
      const taskIdText = route.paramMap.get(RP_TASK_ID);
      if (!!taskIdText) {
        ids.push(Number(taskIdText));
      }
    }
    return this.taskApiService.getData({ ids })
      .pipe(
        take(1) // https://v9.angular.io/guide/router#resolve-pre-fetching-component-data (crisis-detail-resolver.service.ts)
      );
  }
}
