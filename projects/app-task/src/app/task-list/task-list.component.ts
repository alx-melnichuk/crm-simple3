import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TaskDto } from '../services/task.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  public labelName = 'Task list';
  public taskList: TaskDto[];

  private unsubTaskList: Subscription;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.unsubTaskList = this.route.data
      .subscribe((data: { taskList: TaskDto[] }) => {
        this.taskList = (data.taskList || []);
      });
  }

  ngOnDestroy(): void {
    this.unsubTaskList.unsubscribe();
  }

}
