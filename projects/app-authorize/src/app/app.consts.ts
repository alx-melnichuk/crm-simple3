
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
// router - "/authorize/signout"
export const RB_SIGNOUT = 'signout';
// export const RT_APP_AUTHORIZE_SIGNIN = '/' + RB_APP_AUTHORIZE + '/' + RB_SIGNIN;
