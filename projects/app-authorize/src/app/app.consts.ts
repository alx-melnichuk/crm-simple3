
export class Tracing {
  public static log(message?: any, ...optionalParams: any[]): void {
    console.log('%capp-authorize: ' + message, 'color: MediumPurple; font-weight: bold', ...optionalParams);
  }
}

/*
 * const RB_* - Route branch.
 * const RP_* - Route parameter.
 * const RT_* - Route.
 */
// router - "/authorize/signin"
export const RB_SIGNIN = 'signin';
// export const RT_APP_AUTHORISE_SIGNIN = '/' + RB_APP_AUTHORISE + '/' + RB_LOGIN;

export const API_AUTHORISE = 'api/authorize';
export const API_SIGNIN = 'api/signin';
