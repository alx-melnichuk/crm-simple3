import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TaskDto } from '../../services/task.interface';
import { RT_APP_TASK_VIEW_TASK_ID, RP_TASK_ID } from '../../app.consts';

@Component({
  selector: 'app-t-l-middle',
  templateUrl: './t-l-middle.component.html',
  styleUrls: ['./t-l-middle.component.scss']
})
export class TLMiddleComponent implements OnInit {

  @Input()
  public taskList: TaskDto[];

  public displayedColumns: string[] = [
    'id',
    'subject',
    // 'description',
    'message',
    'status',
    'startDate',
    'endDate',
    // 'warning',
    // 'error'
  ];

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  // ** Public API **

  public clickRow(task: TaskDto): void {
    if (task != null && task.id != null) {
      const url = RT_APP_TASK_VIEW_TASK_ID.replace(':' + RP_TASK_ID, '');
      this.router.navigate([url, task.id]);
    }
  }

}
