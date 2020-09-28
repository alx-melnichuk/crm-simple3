>[Previous article - part 2](https://github.com/alx-melnichuk/crm-simple2/blob/master/README.md)

>Article in Russian [README_ru.md](https://github.com/alx-melnichuk/crm-simple3/blob/master/README_ru.md)

## Combine multiple Angular applications into one complex. (part 3)

### Introduction

In the previous articles, a small _Angular_ application was created that has a main application and two additional applications. Additional applications have their own independent assets. The _Angular Material_ library was also connected. In this article, we will continue to develop this software package.

Let's add the following:
- shared library _Core_;
- additional authorization application;

### Preconditions

The prerequisites are detailed in the previous article.
Let us indicate briefly:

- _Node.js_ version 10.9.0 or later;
- Package manager _npm_ version 6.14.8 or later;
- _Angular_ version 10 or later;

Create a directory for the project go to it:

```bash
$ mkdir /home/alexey/ws_ts3/crm-simple3/
$ cd /home/alexey/ws_ts3/crm-simple3/
```

Copy the project files from the previous article into it [github-crm-simple2](https://github.com/alx-melnichuk/crm-simple2). However, you can delete the files `img-*.png`.

Start installation of all required packages:

```bash
$ npm install
```

### Creating a shared kernel library.

This software package contains entities that are used in all additional applications. These can be: common decorators, the current user, checking the permissions of the current user, and so on.

Consider a user profile that stores a list of permissions. Suppose the user has chosen a route and after that the corresponding additional application is loaded. For each route in the add-on application, an access permission check is performed. In this way, the user profile object and access permission check functions can be moved into the public _core_ library.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Create a shared library _core_:
```bash
$ npx ng generate library lib-core
```
All entities that will be exported in this library will be specified in the file: `./projects/lib-core/src/public-api.ts`.  This will shorten the description of the source file in the import line.

### Creating the _auto-unsubscribe_ decorator.

A very part of it is the need to unsubscribe for the `Subscription` entity from the` rxjs` library. An example is described below.
```ts
  ngOnInit(): void {
    this.unsubClientList = this.route.data
      .subscribe((data: { clientList: ClientDto[] }) => {
        this.clientList = (data.clientList || []);
      });
  }
  ngOnDestroy(): void {
    this.unsubClientList.unsubscribe();
  }
```
Let's create a decorator that will automatically unsubscribe all subscriptions in the class. The idea is very simple: go through all the properties of an object and check if the property is an object with the _unsubscribe_ function. And if so, then call this function.

Go to the directory of our library:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/projects/lib-core/src/lib/
```
We create a directory _decorators_, which will store all the decorators for this library.
```bash
$ mkdir decorators && cd ./decorators
```
Create file _auto-unsubscribe.ts_
```ts
const doUnsubscribe = subscription => {
  if (subscription != null && typeof subscription.unsubscribe === 'function') {
    subscription.unsubscribe();
  }
};

const doUnsubscribeIfArray = subscriptionsArray => {
  if (Array.isArray(subscriptionsArray)) {
    subscriptionsArray.forEach(doUnsubscribe);
  }
};

export function AutoUnsubscribe(config: { exclude?: any[]; includeArrays?: any[]; } = { exclude: [], includeArrays: [] }): any {
  return (constructor: any): any => {
    const originalOnDestroy = constructor.prototype.ngOnDestroy;
    const excludeProperties = (config.exclude || []);
    const includePropertiesAsArrays = Array.from(new Set(config.includeArrays || []));

    constructor.prototype.ngOnDestroy = function(...args): void {
      for (const propertyName of Object.keys(this)) {
        if (excludeProperties.includes(propertyName)) {
          continue;
        }
        const property = this[propertyName];
        if (includePropertiesAsArrays.includes(propertyName)) {
          doUnsubscribeIfArray(property);
        } else {
          doUnsubscribe(property);
        }
      }
      if (originalOnDestroy && typeof originalOnDestroy === 'function') {
        originalOnDestroy.apply(this, args);
      }
    };
  };
}
```
Usage example:
```ts
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
@AutoUnsubscribe()
export class ClientListComponent implements OnInit {
  public clientList: ClientDto[];
  private unsubClientList: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.unsubClientList = this.route.data
      .subscribe((data: { clientList: ClientDto[] }) => {
        this.clientList = (data.clientList || []);
      });
  }
}
```
Destruction of an object of this class will automatically unsubscribe for all variables of the `Subscription` type.

You can also add a list of properties that are `Subscription` arrays.
```ts
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
@AutoUnsubscribe({ includeArrays: ['unsubList'] })
export class ClientListComponent implements OnInit {
  public clientList: ClientDto[];
  private unsubList: Subscription[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.unsubList.push(this.route.data
      .subscribe((data: { clientList: ClientDto[] }) => {
        this.clientList = (data.clientList || []);
      }) );
  }
}
```
Now this decorator can be used to automatically unsubscribe all variables of the `Subscription` type, as well as a list of arrays with the `Subscription` type.

### Create service _profile-api_.

To work with user profile data, a service is required that will access the server API.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Let's create a service for obtaining user profile data in the `lib-core` library:
```bash
$ npx ng generate service services/profile-api --project=lib-core
```
The `services/profile-api` parameter defines the name of the new service _profile-api_, and also indicates the _services_ subdirectory in which this new service should be created.

We implement a service for obtaining a user profile.

This service uses an object of the `HttpClient` class and therefore it is required to add the `HttpClientModule` module to the main module of the _lib-core.module.ts_ library. This will result in a separate instance of the `HttpClient` class being used within the framework of this library. And when you need to add an authorization token to the request header, you will have to create a separate interceptor for the _lib-core_ library. It will be necessary to create a hotel interceptor for all additional applications, since the `HttpClientModule` module was also added to them. For simplicity, let's transfer the import of the `HttpClientModule` module from additional applications to the main one. This will allow you to have a common `http`-request interceptor.

>Output:
>
>the module `HttpClientModule` is described in the import list only for the main application, but not for additional applications - no (at the time of loading the additional application, this module will already be loaded into memory);

### Create service _profile_.

When user profile data is retrieved from the server, you need to share that data. For this, we will use the _profile_ service in the public kernel library. You also want to display the user's last name and first name in the header component of the main application.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Let's create a service for working with user profile data in the `lib-core` library:
```bash
$ npx ng generate service services/profile --project=lib-core
```
Let's implement the method for obtaining the user profile in this service:
```ts
  public loadProfile(profileId: number): Observable<ProfileDto[]> {
    this.innProfileDto = null;
    return this.profileApiService.getData({ ids: [profileId] })
      .pipe(
        take(1),
        tap((profiles: ProfileDto[]) => {
          if (profiles != null && profiles.length > 0) {
            this.innProfileDto = profiles[0];
          }
          return profiles;
        })
      );
  }
```
This method should be called when the main application starts. And in the case when the user profile is not defined, go to the authorization page.

The _profile_ service must be specified in the list of providers only in the _lib-core.module_ module of the _lib-core_ library. In all other additional applications, the _profile_ service cannot be specified in the list of providers. Because this will lead to the creation of a new instance of this service. And we need this service to be the only one.

### Create service _app-init.service_.

When the main application starts, you need to check the user profile data. For this purpose, let's create the _AppInitService_ service, which will contain a method with this check. And this method must be called when the application starts.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/src/app/
```
Let's create a service in the main application to store the user profile:
```bash
$ npx ng generate service services/app-init
```
Let's add the _initProfile () _ method, in which the request to get the user profile is executed (_profileService.loadProfile () _). If the server returns user profile data, then we continue loading the main application. If the server does not return profile data, then this user needs to go to the authorization route.

Let's use the _APP_INITIALIZER_ token to define the function when starting the main application. Let's open the file _/ src/app/app.module.ts_ and add a call to the _AppInitService.initProfile()_ method to the providers section.
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LibCoreModule } from '../../projects/lib-core/src/lib/lib-core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AppInitService } from './services/app-init.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule, // ** Must be loaded first **
    BrowserAnimationsModule,
    AppRoutingModule,
    LibCoreModule
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitService: AppInitService) => () => appInitService.initProfile(),
      deps: [AppInitService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('main: AppModule();');
  }
}
```
This module uses the _AppInitService_ service and therefore it is specified in the _providers_ section. In this case, this service depends on another service _ProfileService_, which (with its dependencies) is described in the _LibCoreModule_ module. Since this place requires the creation of the _ProfileService_ service, add the _LibCoreModule_ module to the import section. As a result, the _LibCoreModule_ module, with its providers, gets into memory when the _AppModule_ module of the main application is loaded. Therefore, after lazy loading of the additional application module `app-client`, there is no need to load the _LibCoreModule_ module again. And if you still specify it in the import section of the additional application module `app-client`, then new instances of the providers of the _LibCoreModule_ module will be created. All this can be verified by performing a small experiment.

_Angular_ will create new instances for any of the `InjectionToken` or `Injectable` in use cases:
1. Lazy loading of modules;
2. Injections in descendant modules;

This is because _Angular_ creates a new `Injector` module for any lazy loaded module, this behavior is well described in the [documentation](https://angular.io/guide/ngmodule-faq#why-is-a-service-provided-in-a-lazy-loaded-module-visible-only-to-that-module) and in [this](https://medium.com/angular-in-depth/angular-dependency-injection-and-tree-shakeable-tokens-4588a8f70d5d) article.

When the _Angular_ router lazily loads a module, it creates a new execution context. This context has its own injector, which is a direct descendant of the application injector.

>Conclusions:
>
>the service is indicated in the list of providers only in the module where it is created, otherwise a second instance of the service will be created;
>
>the _LibCoreModule_ module is described in the import list only for the main application, but not for additional applications (at the time of loading the additional application, this module will already be loaded into memory);

### Creating interceptors for server responses.

For our application to work, we need to receive responses from the API server. But since we do not have a server, we will formulate responses to server requests using interceptors. These interceptors will be located in the _interceptors_ directory of the main application. And will only be added in development mode.

Let's implement a simple authorization interceptor _mock-authorize.interceptor.ts_:
```ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthorizeDto } from '../../../projects/app-authorize/src/app/services/authorize.interface';
import {
  DEMO_LOGIN1, DEMO_PASSWD1, DEMO_PROFILE_ID1, DEMO_LOGIN2, DEMO_PASSWD2, DEMO_PROFILE_ID2, USER_AUTHORIZE
} from '../../../projects/lib-core/src/lib/lib-core.const';
import {
  API_AUTHORIZE, API_AUTHORIZE_SIGNIN, API_AUTHORIZE_SIGNOUT
} from '../../../projects/app-authorize/src/app/services/authorize-api.service';


@Injectable({
  providedIn: 'root'
})
export class MockAuthorizeInterceptor implements HttpInterceptor {

  private authorizeProvider: AuthorizeProvider = new AuthorizeProvider();

  constructor(private router: Router) {
    console.log('MockAuthorizeInterceptor();');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(API_AUTHORIZE)) {
      return next.handle(req);
    }
    let response: Partial<{}> = {};
    const delayTime = 100;
    let status = 500;
    if (req.url === API_AUTHORIZE_SIGNIN) {
      response = this.handleSignin(req);
      status = 200;
    } else if (req.url === API_AUTHORIZE_SIGNOUT) {
      response = this.handleSignout(req);
      status = 200;
    }
    return of(new HttpResponse({ status, body: response })).pipe(delay(delayTime));
  }

  private handleSignin(req: HttpRequest<any>): Partial<{}> {
    let result: Partial<{}> = {};
    const method = (req != null ? req.method : null);
    switch (method) {
      case 'POST':
        sessionStorage.removeItem(USER_AUTHORIZE);
        result = this.authorizeProvider.get({ login: req.body.login, password: req.body.password });
        if (result != null) {
          const authorizeJson = JSON.stringify(result);
          sessionStorage.setItem(USER_AUTHORIZE, String(authorizeJson));
        }
        break;
      default:
        break;
    }
    return result;
  }

  private handleSignout(req: HttpRequest<any>): Partial<{}> {
    let result: Partial<{}> = {};
    const method = (req != null ? req.method : null);
    switch (method) {
      case 'GET':
        sessionStorage.removeItem(USER_AUTHORIZE);
        result = {};
        break;
      default:
        break;
    }
    return result;
  }
}


class AuthorizeProvider {
  private authorizeList: AuthorizeDto[] = this.createList();

  constructor() {
  }

  // ** Public API **

  public get(data: { login: string, password: string }): AuthorizeDto {
    let result: AuthorizeDto = null;
    const list: AuthorizeDto[] = this.authorizeList.slice();
    if (!!data.login) {
      const authorizeDto: AuthorizeDto = list.find(item => data.login === item.login && data.password === item.password);
      if (authorizeDto != null) {
        const authorizeData = Object.assign({}, authorizeDto, { password: null });
        result = authorizeData;
      }
    }
    return result;
  }

  public delete(data: { ids: number[] }): string {
    if (Array.isArray(data.ids)) {
      for (const id of data.ids) {
        const index = this.authorizeList.findIndex(item => item.id === id);
        if (index > -1) {
          this.authorizeList.splice(index, 1);
        }
      }
    }
    return null;
  }

  // ** Privat API **

  private createList(): AuthorizeDto[] {
    const result: AuthorizeDto[] = [];
    result.push(this.createAuthorize(1, DEMO_LOGIN1, DEMO_PASSWD1, DEMO_PROFILE_ID1));
    result.push(this.createAuthorize(2, DEMO_LOGIN2, DEMO_PASSWD2, DEMO_PROFILE_ID2));
    return result;
  }

  private createAuthorize(id: number, login: string, password: string, profileId: number): AuthorizeDto {
    return { id, login, password, profileId };
  }
}
```
Let's modify the main application module _ / src / app / app.module.ts_:
```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from '../environments/environment';
import { LibCoreModule } from '../../projects/lib-core/src/lib/lib-core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AppInitService } from './services/app-init.service';
import { MockClientInterceptor } from './interceptors/mock-client.interceptor';
import { MockTaskInterceptor } from './interceptors/mock-task.interceptor';
import { MockAuthorizeInterceptor } from './interceptors/mock-authorize.interceptor';

const provideMock = [
  { provide: HTTP_INTERCEPTORS, useClass: MockClientInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: MockTaskInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: MockAuthorizeInterceptor, multi: true }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule, // ** Must be loaded first **
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LibCoreModule
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitService: AppInitService) => () => appInitService.initProfile(),
      deps: [AppInitService],
      multi: true
    },
    ...(!environment.production ? provideMock : [])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('AppModule();');
  }
}
```

### Create a route permission check.

The procedure for checking permissions for access to a specific route depends only on the data of the user profile, then it can be moved into the _LibCoreModule_ kernel library module. To check the permissions of a route, the _Route_ class has the corresponding properties:
- _canActivate_ - check for route activation;
- _canLoad_ - check for route loading (for lazy loading);
We will indicate what permissions to check in the route in the _data_ section.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Let's create a class in the `lib-core` library to check permissions according to user profile data. When creating, we will indicate the signs of creating two interfaces:
```bash
$ npx ng generate guard guards/permissions --project=lib-core --implements CanActivate --implements CanLoad
```
Let's implement two permission checks in this class: _CanActivate_ and _CanLoad_.
_./projects/lib-core/src/lib/guards/permissions.guard.ts_
```ts
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate, CanLoad {

  constructor(private profileService: ProfileService) {
  }

  // ** Public API **

  public canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkPermissions(route.data.permissions, this.profileService.availablePermissions());
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkPermissions(route.data.permissions, this.profileService.availablePermissions());
  }

  // ** Private API **

  private checkPermissions(requiredPermissions: string[], availablePermissions: string[]): boolean {
    const innRequiredPermissions = (requiredPermissions || []);
    const innAvailablePermissions = (availablePermissions || []);
    let result = true;
    for (let i = 0, len = innRequiredPermissions.length; i < len && result; i++) {
      result = (innAvailablePermissions.indexOf(innRequiredPermissions[i]) > -1);
    }
    return result;
  }
}
```
In the _LibCoreModule_ file, add _PermissionsGuard_ to the list of providers:
```ts
providers: [
  ProfileApiService,
  ProfileService,
  PermissionsGuard
]
```
An example of use when building routes in the main application.
_./src/app/app-routing.module.ts_
```ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '../../projects/lib-core/src/lib/guards/permissions.guard';
import { LoadPermission } from './app.consts';

const routes: Routes = [
  {
    path: 'app-client',
    loadChildren: () => import('../../projects/app-client/src/app/app.module').then(mod => mod.AppModule),
    data: {
      permissions: ['appClient']
    },
    canLoad: [PermissionsGuard],
  },
  {
    path: 'app-task',
    loadChildren: () => import('../../projects/app-task/src/app/app.module').then(mod => mod.AppModule),
    data: {
      permissions: ['appTask']
    },
    canLoad: [PermissionsGuard],
  },
  {
    path: '**',
    redirectTo: '/app-client/list'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```
Do not forget that permissions for a route are stored in an additional application where this route is used (_permissions: ['clientList'] _). And only the main application stores the permissions to load the additional application (_permissions: ['appClient'] _). This is the principle of "decentralizing" logic. Everything that is required to implement the execution logic of the additional application is stored in the secondary application itself.

> Output:
>
> permissions to download additional applications are contained in the _lib-core_ library, and permissions to internal routes of additional applications - in these applications (for independence of additional applications);

### Creating an additional application _app-authorize_.

Before starting work, the user must authorize, specify his username and password. Let's create an additional application `app-authorize`, which will implement the page for authorization.

To continue, go to the main application directory:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Create an additional authorization application.
```bash
$ npx ng generate application app-authorize --routing=true --style=scss
```
- `ng generate application <name>` - create a new application `<name>` in the projects subdirectory of the workspace;
- `--style = scss` - sets the SCSS preprocessor to be used for style files (default CSS);
- `--routing = true` - tells _Angular CLI_ to create a routing NgModule;

Next, we create a component for authorization when entering the software package.

Create a module and a _signin_ component:
```bash
$ npx ng generate module signin --project=app-authorize
$ npx ng generate component signin --project=app-authorize --export=true
```
In this component, the user should enter his username and password, which are used for authorization on the server.

The source code can be downloaded from [github-crm-simple3] (https://github.com/alx-melnichuk/crm-simple3). (Run `npm install` before starting the application.)

You can launch the project on the StackBlitz website by following the link [https://stackblitz.com/github/alx-melnichuk/crm-simple3 ](https://stackblitz.com/github/alx-melnichuk/crm-simple3).

### Analysis of the obtained result

As a result of the work done, we have the following conclusions:
- the module `HttpClientModule` is described in the import list only for the main application, but not for additional applications (at the time of loading the additional application, this module will already be loaded into memory);
- сервис указывается в списке провайдеров только в модуле, где он создается, иначе будет создан второй экземпляр сервиса;
- the _LibCoreModule_ module is described in the import list only for the main application, but not for additional applications (this module is already loaded into memory);
- permission to download applications of additional applications in the library _lib-core_, permission to internal routes of applications - in these applications (for the independence of additional applications);
