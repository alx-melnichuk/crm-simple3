import { Component, OnInit, Input } from '@angular/core';

import { RT_APP_TASK_LIST } from '../../app.consts';

@Component({
  selector: 'app-t-v-header',
  templateUrl: './t-v-header.component.html',
  styleUrls: ['./t-v-header.component.scss']
})
export class TVHeaderComponent implements OnInit {

  @Input()
  public labelName: string;

  public routerLink: string;

  constructor() { }

  ngOnInit(): void {
    this.routerLink = RT_APP_TASK_LIST;
  }

}
