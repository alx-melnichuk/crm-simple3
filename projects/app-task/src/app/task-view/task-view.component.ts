import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { TaskDto } from '../services/task.interface';
import { RP_TASK_ID } from '../app.consts';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit, OnDestroy {

  public labelName = 'Task list';
  public taskId: number;
  public task: TaskDto;

  private unsubTask: Subscription;
  private unsubTaskId: Subscription;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.unsubTask = this.route.data
      .subscribe((data: { task: TaskDto[] }) => {
        const taskList: TaskDto[] = (data.task || []);
        this.task = (taskList.length > 0 ? taskList[0] : null);
      });

    this.unsubTaskId = this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has(RP_TASK_ID)) {
          const taskIdText = params.get(RP_TASK_ID);
          this.taskId = (!!taskIdText ? Number(taskIdText) : null);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubTask.unsubscribe();
    this.unsubTaskId.unsubscribe();
  }

}
