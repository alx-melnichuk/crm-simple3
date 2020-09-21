import { Component, OnInit, Input } from '@angular/core';

import { RT_APP_CLIENT_LIST } from '../../app.consts';

@Component({
  selector: 'app-c-v-header',
  templateUrl: './c-v-header.component.html',
  styleUrls: ['./c-v-header.component.scss']
})
export class CVHeaderComponent implements OnInit {

  @Input()
  public labelName: string;

  public routerLink: string;

  constructor() { }

  ngOnInit(): void {
    this.routerLink = RT_APP_CLIENT_LIST;
  }

}
