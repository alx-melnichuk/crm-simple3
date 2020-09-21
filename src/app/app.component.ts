import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../../projects/lib-core/src/lib/services/profile.service';
import { ProfileDto } from './../../projects/lib-core/src/lib/services/profile.interface';
import { ClientPermission, RT_APP_CLIENT_LIST } from '../../projects/app-client/src/app/app.consts';
import { TaskPermission, RT_APP_TASK_LIST } from '../../projects/app-task/src/app/app.consts';

import { Nav } from './nav/nav.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'CRM-simple';
  public navList: Nav[];
  public hasProfile: boolean;
  public userName: string;

  private profileDto: ProfileDto;

  constructor(private profileService: ProfileService) {
  }

  ngOnInit(): void {
    this.profileDto = this.profileService.profileDto;
    this.hasProfile = (this.profileDto != null);
    if (this.hasProfile) {
      this.navList = this.createNavList(this.profileDto.permissions);
      this.userName = this.profileService.userName();
    }
  }

  // ** Private API **

  private createNavList(permissions: string[]): Nav[] {
    const result: Nav[] = [];
    result.push({
      name: 'Clients',
      routerLink: RT_APP_CLIENT_LIST,
      permission: ClientPermission.clientList
    });
    result.push({
      name: 'Tasks',
      routerLink: RT_APP_TASK_LIST,
      permission: TaskPermission.taskList
    });
    const innPermissions = (permissions || []);
    return result.filter((item) => innPermissions.includes(item.permission));
  }
}