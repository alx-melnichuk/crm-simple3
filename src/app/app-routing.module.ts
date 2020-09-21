import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '../../projects/lib-core/src/lib/guards/permissions.guard';
import { LoadPermission } from './app.consts';
import { RB_APP_AUTHORISE } from '../../projects/lib-core/src/lib/constants/core.constants';
import { RB_APP_CLIENT } from '../../projects/lib-core/src/lib/constants/core.constants';
import { RT_APP_CLIENT_LIST } from '../../projects/app-client/src/app/app.consts';
import { RB_APP_TASK } from '../../projects/lib-core/src/lib/constants/core.constants';

const routes: Routes = [
  {
    path: RB_APP_AUTHORISE,
    loadChildren: () => import('../../projects/app-authorize/src/app/app.module').then(mod => mod.AppModule),
  },
  {
    path: RB_APP_CLIENT,
    loadChildren: () => import('../../projects/app-client/src/app/app.module').then(mod => mod.AppModule),
    data: {
      permissions: [LoadPermission.appClient]
    },
    canLoad: [PermissionsGuard],
  },
  {
    path: RB_APP_TASK,
    loadChildren: () => import('../../projects/app-task/src/app/app.module').then(mod => mod.AppModule),
    data: {
      permissions: [LoadPermission.appTask]
    },
    canLoad: [PermissionsGuard],
  },
  {
    path: '**',
    redirectTo: RT_APP_CLIENT_LIST
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
