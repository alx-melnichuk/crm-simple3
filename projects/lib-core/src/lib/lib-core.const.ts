
export class Tracing {
  public static log(message?: any, ...optionalParams: any[]): void {
    console.log('%clib-core: ' + message, 'color: Grey; font-weight: bold', ...optionalParams);
  }
}

export const VERSION_APP = '0.3.0';
export const DEMO_LOGIN1 = 'user1';
export const DEMO_PASSWD1 = '123456';
export const DEMO_PROFILE_ID1 = 1;
export const DEMO_LOGIN2 = 'user2';
export const DEMO_PASSWD2 = '123456';
export const DEMO_PROFILE_ID2 = 2;
// Window.sessionStorage
export const USER_AUTHORIZE = 'user-authorize';

// Route:
export const RB_APP_AUTHORISE = 'app-authorize';
export const RB_APP_CLIENT = 'app-client';
export const RB_APP_TASK = 'app-task';
