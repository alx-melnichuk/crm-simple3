import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { ClientDto } from '../services/client.interface';
import { RP_CLIENT_ID } from '../app.consts';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss']
})
export class ClientViewComponent implements OnInit, OnDestroy {

  public labelName = 'List of clients';
  public clientId: number;
  public client: ClientDto;

  private unsubClient: Subscription;
  private unsubClientId: Subscription;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.unsubClient = this.route.data
      .subscribe((data: { client: ClientDto[] }) => {
        const clientList: ClientDto[] = (data.client || []);
        this.client = (clientList.length > 0 ? clientList[0] : null);
      });

    this.unsubClientId = this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params.has(RP_CLIENT_ID)) {
          const clientIdText = params.get(RP_CLIENT_ID);
          this.clientId = (!!clientIdText ? Number(clientIdText) : null);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubClient.unsubscribe();
    this.unsubClientId.unsubscribe();
  }
}
