import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { API_TASK, QP_TASK_IDS } from '../../../../app-task/src/app/services/task-api.service';
import { TaskDto } from '../../../../app-task/src/app/services/task.interface';


@Injectable()
export class MockTaskInterceptor implements HttpInterceptor {

  private taskProvider: TaskProvider = new TaskProvider();

  constructor() {
    console.log('app-task: MockTaskInterceptor();');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url !== API_TASK) {
      return next.handle(req);
    }
    let response = {};
    const delayTime = 100;
    switch (req.method) {
      case 'GET':
        const idsText = req.params.get(QP_TASK_IDS);
        const ids = (!!idsText ? idsText.split(',').map(item => Number(item)) : null);
        response = this.taskProvider.get({ ids });
        break;
      default:
        break;
    }
    return of(new HttpResponse({ status: 200, body: response })).pipe(delay(delayTime));
  }
}


class TaskProvider {
  private taskList: TaskDto[] = this.createList();

  constructor() {}

  // ** Public API **

  public get(data: { ids: number[] }): TaskDto[] {
    let result: TaskDto[] = this.taskList.slice();
    if (Array.isArray(data.ids) && data.ids.length > 0) {
      result = result.filter(item => data.ids.includes(item.id));
    }
    return result;
  }

  // ** Privat API **

  private createList(): TaskDto[] {
    const result: TaskDto[] = [];
    result.push(this.create(1, 'PepsiCo'));
    result.push(this.create(2, 'Humana'));
    result.push(this.create(3, 'AbbVie Inc'));
    result.push(this.create(4, 'Archer Daniels'));
    result.push(this.create(5, 'Albertsons'));
    result.push(this.create(6, 'Lockheed'));
    result.push(this.create(7, 'Energy Transfer'));
    result.push(this.create(8, 'Goldman Sachs'));
    result.push(this.create(9, 'Caterpillar'));
    result.push(this.create(10, 'Pfizer'));

    result.push(this.create(11, 'Healthcare'));
    result.push(this.create(12, 'American Express'));
    result.push(this.create(13, 'Delta Air Lines'));
    result.push(this.create(14, 'Merck & Co'));
    result.push(this.create(15, 'Allstate'));
    result.push(this.create(16, 'New York Life'));
    result.push(this.create(17, 'Bestbuy	Retail'));
    result.push(this.create(18, 'United Airlines'));
    result.push(this.create(19, 'Liberty Mutual'));
    result.push(this.create(20, 'Chemical Company'));

    result.push(this.create(21, 'Tyson Foods'));
    result.push(this.create(22, 'General Dynamics'));
    result.push(this.create(23, 'John Deere'));
    result.push(this.create(24, 'Publix'));
    result.push(this.create(25, 'Tech Data'));
    result.push(this.create(26, 'World Fuel'));
    result.push(this.create(27, 'Honeywell'));
    result.push(this.create(28, 'Exelon'));
    result.push(this.create(29, 'Capital One'));
    result.push(this.create(30, 'Plains GP'));
    return result;
  }

  private multiplicityByTwo(id: number, value1: string, value2: string): string {
    return (id % 2 === 0 ? value1 : value2);
  }

  private multiplicityByThree(id: number, value1: string, value2: string, value3: string): string {
    return (id % 3 === 0 ? value1 : this.multiplicityByTwo(id, value2, value3));
  }

  private create(id: number, name: string): TaskDto {
    const id2 = id + 1;
    const msg1 = 'Clarify the contract for the company';
    const msg2 = 'Offer a contract for the company';
    const msg3 = 'Extend the contract for the company';
    const k = id % 4;
    const n = id % 10;
    const d2 = new Date('2020.' + (6 + (id % 2 === 0 ? -k : k)) + '.' + (15 + (id % 2 === 0 ? -n : n)));
    return {
      id,
      subject: this.multiplicityByThree(id2, 'Clarify the contract', 'Offer a contract', 'Extend the contract') + ' "' + name + '"',
      description: this.multiplicityByThree(id2, msg1, msg2, msg3) + ' "' + name + '"',
      message: this.multiplicityByTwo(id2, '', 'Message for "' + name + '".'),
      status: this.multiplicityByTwo(id2, 'not active', 'active'),
      startDate: d2.toISOString(),
      endDate: '',
      warning: this.multiplicityByThree(id2, '', 'Warning for "' + name + '" !', ''),
      error: this.multiplicityByThree(id2, 'Warning for "' + name + '" !!!', '', '')
    };
  }

}
