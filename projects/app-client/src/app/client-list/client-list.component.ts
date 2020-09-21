import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AutoUnsubscribe } from '../../../../../projects/lib-core/src/public-api';

import { ClientDto } from '../services/client.interface';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
@AutoUnsubscribe()
export class ClientListComponent implements OnInit {

  public labelName = 'List of clients';
  public clientList: ClientDto[];

  private unsubClientList: Subscription;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.unsubClientList = this.route.data
      .subscribe((data: { clientList: ClientDto[] }) => {
        this.clientList = (data.clientList || []);
      });
  }

}
