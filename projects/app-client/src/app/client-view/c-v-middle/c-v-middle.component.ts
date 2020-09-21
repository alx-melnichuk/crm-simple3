import { Component, OnInit, Input } from '@angular/core';

import { ClientDto } from '../../services/client.interface';

@Component({
  selector: 'app-c-v-middle',
  templateUrl: './c-v-middle.component.html',
  styleUrls: ['./c-v-middle.component.scss']
})
export class CVMiddleComponent implements OnInit {

  @Input()
  public client: ClientDto;

  constructor() {
  }

  ngOnInit(): void {
    this.client = (this.client || ({} as ClientDto));
  }

}
