>[Предыдущая статья - часть 2](https://github.com/alx-melnichuk/crm-simple2/blob/master/README.md)

## Объединить несколько _Angular_ приложений в одно сложное. (часть 3)

### Введение

В предыдущих статьях было создано небольшое приложение на _Angular_, которое имеет основное приложение и два дополнительных приложения. Дополнительные приложения имеют свои независимые активы. Так же была подключена библиотека _Angular Material_. В этой статье продолжим развивать это программный комплекс.

Добавим следующее:
- общую библиотеку _Core_;
- дополнительное приложение авторизации;

### Предварительные условия

Предварительные условия детально описаны в предыдущей статье.
Укажем кратко:
- _Node.js_ версии 10.9.0 или более поздняя;
- Менеджер пакетов _npm_ версии 6.14.8 или более поздняя;
- _Angular_ версии 10 или более поздняя;

Создать каталог для проекта  перейти в него:
```bash
$ mkdir /home/alexey/ws_ts3/crm-simple3/ && cd /home/alexey/ws_ts3/crm-simple3/
```
Копируем в него файлы проекта из предыдущей статьи [github-crm-simple2](https://github.com/alx-melnichuk/crm-simple2). При этом можно удалить файлы `img-*.png`.

Запустить установку всех требуемых пакетов:
```bash
$ npm install
```
### Создание общей библиотеки ядра.

В данном программном комплексе имеются сущности, которые используются во всех дополнительных приложениях. Это могут быть: общие декораторы, текущий пользователь, проверка разрешений текущего пользователя и так далее.

Рассмотрим профиль пользователя, в котором хранится список разрешений. Предположим пользователь выбрал какой-либо маршруту и после этого выполняется загрузка соответствующего дополнительного приложения. Для каждого маршрута в дополнительном приложении выполняется проверка разрешения доступа. Таким образом объект профиля пользователя и функции проверки разрешения доступа можно вынести в общедоступную библиотеку _ядра_.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Выполнить создание общедоступной библиотеки _ядра_:
```bash
$ npx ng generate library lib-core
```
Все сущности, которые будут экспортироваться в этой библиотеке будем указывать в файле: `./projects/lib-core/src/public-api.ts`.  Это позволит сократить описание файла источника в строке импорта.

### Создание декоратора _auto-unsubscribe_.

Очень часть возникает необходимость выполнять отписку для сущности `Subscription` из библиотеки `rxjs`. Ниже описан такой пример.
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
Создадим декоратор, который будет автоматически отписывать все имеющиеся в классе подписки. Идея очень проста: пройтись по все свойствам объекта и проверить является ли свойство объектом с функцией _unsubscribe_. И если да, то вызвать эту функцию.

Переходим в каталог нашей библиотеки:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/projects/lib-core/src/lib/
```
Создаем каталог _decorators_, в котором будут храниться все декораторы данной библиотеки.
```bash
$ mkdir decorators && cd ./decorators
```
Создаем файл _auto-unsubscribe.ts_
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
Пример использования:
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
При разрушении объекта данного класса автоматически выполнится отписка для всех переменных типа `Subscription`.

Еще можно добавить список свойств, которые являются массивами `Subscription`.
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
Теперь данный декоратор можно использовать для автоматической отписки всех переменных типа  `Subscription`, а так же можно указать список массивов с типом `Subscription`.

### Создание сервиса _profile-api_.

Для работы с данными профиля пользователя требуется сервис, который будет обращаться к API сервера.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Создадим в библиотеке `lib-core` сервис получения данных профиля пользователя:
```bash
$ npx ng generate service services/profile-api --project=lib-core
```
Параметр `services/profile-api` определяет наименование нового сервиса _profile-api_, а так же указывает подкаталог _services_, в котором требуется создать этот новый сервис.

Реализуем сервис получение профиля пользователя.

Данный сервис использует объект класса `HttpClient` и по этому требуется добавить модуль `HttpClientModule` в основной модуль библиотеки  _lib-core.module.ts_. Это приведет к том, что в рамах данной библиотеки будет использоваться отдельный экземпляр класса `HttpClient`. А когда потребуется добавить в заголовок запроса токен авторизации, то для библиотеки  _lib-core_ придется создавать отельный перехватчик. Создавать отельный перехватчик потребуется и для всех дополнительных приложений, так как в них так же был добавлен модуль `HttpClientModule`. Для простоты перенесем импорт модуля `HttpClientModule` из дополнительных приложений в основное. Это позволит иметь общий перехватчик `http`-запросов.

>Вывод:
>
>модуль `HttpClientModule` описываем в списке импорта только для основного приложения, а для дополнительных приложениях - нет (на момент загрузки дополнительного приложения этот модуль уже будет загружен в память);

### Создание сервиса _profile_.

Когда данные профиля пользователя получены с сервера, требуется организовать общий доступ к этим данным. Для этого будем использовать сервис _profile_ в общедоступной библиотеке ядра. Так же требуется отобразить фамилию и имя пользователя в компоненте заголовка основного приложения.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Создадим в библиотеке `lib-core` сервис работы с данными профиля пользователя:
```bash
$ npx ng generate service services/profile --project=lib-core
```
Реализуем в данном сервисе метод получения профиля пользователя:
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
Данный метод должен вызываться при старте основного приложения. И в случае, когда профиль пользователя не определен, выполнить переход на страницу авторизации.

Сервис _profile_ должен быть указан в списке провайдеров только в модуле _lib-core.module_ библиотеки _lib-core_. Во всех остальных дополнительных приложениях нельзя указывать сервис _profile_ в списке провайдеров. По тому, что это приведет к созданию нового экземпляра данного сервиса. А нам требуется, что бы этот сервис был единственным.

### Создание сервиса _app-init.service_.

При старте основного приложения, требуется выполнить проверку данных профиля пользователя. Для этой цели создадим сервис _AppInitService_, в котором будет находится метод с данной проверкой. И этот метод требуется вызывать при старте приложения.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/src/app/
```
Создадим в основном приложении сервис для хранения профиля пользователя:
```bash
$ npx ng generate service services/app-init
```
Добавим метод _initProfile()_, в котором выполняется запрос получения профиля пользователя (_profileService.loadProfile()_). Если сервер возвращает данные профиля пользователя, значит продолжаем загрузку основного приложения. Если сервер не возвращает данные профиля, значит данному пользователю требуется перейти на маршрут авторизации.

Воспользуемся токеном _APP_INITIALIZER_ для определения функции при старте основного приложения. Откроем файл _/src/app/app.module.ts_ и добавим в раздел провайдеров вызов метода _AppInitService.initProfile()_.
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
В данном модуле используется сервис _AppInitService_ и по этому он указан в разделе _providers_. При этом данный сервис зависит от другого сервиса _ProfileService_, который (со своими зависимостями) описан в модуле _LibCoreModule_. Так как в этом месте требуется создание сервиса _ProfileService_ добавим в раздел импорта модуль _LibCoreModule_. В результате  модуль _LibCoreModule_, со своими провайдерами, попадает в память при загрузке модуля _AppModule_ основного приложения. И следовательно после ленивой загрузки модуля дополнительного приложения `app-client` нет необходимости загружать модуль _LibCoreModule_ еще раз. А если все таки его указать в разделе импорта модуля дополнительного приложения `app-client`, то будут созданы новые экземпляры провайдеров модуля _LibCoreModule_. Все это можно проверить выполнив маленький эксперимент.

_Angular_ создаст новые экземпляры для любого из `InjectionToken` или `Injectable` в случаях использования:
1.  Ленивой загрузки модулей;
2.  Инжекты в модулях потомках;

Это происходит потому, что _Angular_ создает новый модуль `Injector` для любого лениво загруженного модуля, это поведение отлично описано в [документации](https://angular.io/guide/ngmodule-faq#why-is-a-service-provided-in-a-lazy-loaded-module-visible-only-to-that-module) и в [этой](https://medium.com/angular-in-depth/angular-dependency-injection-and-tree-shakeable-tokens-4588a8f70d5d) статье.

Когда маршрутизатор _Angular_ лениво загружает модуль, он создает новый контекст выполнения. У этого контекста есть собственный инжектор, который является прямым потомком инжектора приложения.

> Выводы:
>
> сервис указывается в списке провайдеров только в модуле, где он создается, иначе будет создан второй экземпляр сервиса;
>
> модуль _LibCoreModule_ описываем в списке импорта только для основного приложения, а для дополнительных приложений - нет (на момент загрузки дополнительного приложения этот модуль уже будет загружен в память);

### Создание перехватчиков для ответов сервера.

Для работы нашего приложения требуется получать ответы от API сервера. Но так как у нас нет сервера, то ответы на запросы сервера будем формулировать при помощи перехватчиков. Данные перехватчики будут находиться в каталоге _interceptors_ основного приложения. И будут добавляться только в режиме разработки.

Реализуем простой перехватчик для авторизации _mock-authorize.interceptor.ts_:
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
Модифицируем модуль основного приложения _/src/app/app.module.ts_ :
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

### Создание проверки разрешений маршрутов.

Процедура проверки разрешений для доступа к определенному маршруту зависит только , от данных профиля пользователя, то ее можно вынести в модуль библиотеки ядра _LibCoreModule_. Для проверки разрешений маршрута в классе _Route_ предусмотрены соответствующие свойства:
- _canActivate_ - проверка на активацию маршрута;
- _canLoad_ - проверка на загрузку маршрута (для ленивой загрузки);
Какие разрешения проверять укажем в маршруте в разделе _data_.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Создадим в библиотеке `lib-core` класс для проверки разрешений согласно данных профиля пользователя. При создании укажем признаки создания двух интерфейсов:
```bash
$ npx ng generate guard guards/permissions --project=lib-core --implements CanActivate --implements CanLoad
```
Реализуем в данном классе две проверки разрешений: _CanActivate_ и _CanLoad_.
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
В файле _LibCoreModule_ добавим _PermissionsGuard_ в список провайдеров:
```ts
providers: [
  ProfileApiService,
  ProfileService,
  PermissionsGuard
]
```
Пример использования при построении маршрутов в основном приложении.
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
Не стоит забывать, что разрешения на маршрут хранятся в дополнительном приложении, где этот маршрут используется (_permissions: ['clientList']_). И только в основном приложении хранятся разрешения на возможность загрузки дополнительного приложения (_permissions: ['appClient']_). Это и есть принцип "децентрализации" логики. Все что требуется для реализации логики выполнения дополнительного приложения хранится в самом дополнительном приложении.

> Вывод:
>
> разрешения на загрузку дополнительных приложений содержаться в библиотеке _lib-core_, а разрешения на внутренние маршруты дополнительных приложений - в этих приложениях (для независимости  дополнительных приложений); 

### Создание дополнительного приложения _app-authorize_.

Перед началом работы пользователь должен выполнить авторизацию, указать свой логин и пароль. Создадим дополнительное приложение `app-authorize`, в котором будет реализована страница для авторизации.

Для продолжения переходим в каталог основного приложения:
```bash
$ cd /home/alexey/ws_ts3/crm-simple3/
```
Выполнить создание дополнительного приложения по авторизации.
```bash
$ npx ng generate application app-authorize --routing=true --style=scss
```
- `ng generate application <name>` - создание нового приложения `<name>` в projects подкаталоге рабочей области;
- `--style=scss` - устанавливает препроцессор SCSS, который будет использоваться для файлов стилей (по умолчанию CSS);
- `--routing=true` - сообщает _Angular CLI_ о необходимости создания NgModule маршрутизации;

Далее создаем компонент для авторизации при входе в программный комплекс.

Создаем модуль и компонент _signin_:
```bash
$ npx ng generate module signin --project=app-authorize
$ npx ng generate component signin --project=app-authorize --export=true
```
В данном компоненте пользователь вводи свой логин и пароль, по которым и выполняется авторизация на сервере.

Исходный код можно скачать [github-crm-simple3](https://github.com/alx-melnichuk/crm-simple3). (Запустите  `npm install` перед запуском приложения.)

Запустить проект на сайте StackBlitz можно по ссылке [https://stackblitz.com/github/alx-melnichuk/crm-simple3](https://stackblitz.com/github/alx-melnichuk/crm-simple3).

### Анализ полученного результата

В результате проделанной работы имеем следующие выводы:
- модуль `HttpClientModule` описываем в списке импорта только для основного приложения, а для дополнительных приложениях - нет (на момент загрузки дополнительного приложения этот модуль уже будет загружен в память);
- сервис указывается в списке провайдеров только в модуле, где он создается, иначе будет создан второй экземпляр сервиса;
- модуль _LibCoreModule_ описываем в списке импорта только для основного приложения, а для дополнительных приложений - нет (на момент загрузки дополнительного приложения этот модуль уже будет загружен в память);
- разрешения на загрузку дополнительных приложений содержаться в библиотеке _lib-core_, а разрешения на внутренние маршруты дополнительных приложений - в этих приложениях (для независимости  дополнительных приложений);


