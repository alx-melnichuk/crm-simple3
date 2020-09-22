
export class Tracing {
  public static log(message?: any, ...optionalParams: any[]): void {
    console.log('%clib-core: ' + message, 'color: Grey; font-weight: bold', ...optionalParams);
  }
}

export const VERSION_APP = '0.3.0';
export const DEMO_USER1_LOGIN = 'user1@crm-simple.ua';
export const DEMO_USER1_PASSWD = '123456';
export const DEMO_USER2_LOGIN = 'user2@crm-simple.ua';
export const DEMO_USER2_PASSWD = '123456';

// Route:
export const RB_APP_AUTHORISE = 'app-authorize';
export const RB_APP_CLIENT = 'app-client';
export const RB_APP_TASK = 'app-task';
