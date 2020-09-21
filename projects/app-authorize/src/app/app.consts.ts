import { RB_APP_AUTHORISE } from '../../../../projects/lib-core/src/lib/constants/core.constants';

/*
 * const RB_* - Route branch.
 * const RP_* - Route parameter.
 * const RT_* - Route.
 */
export const RB_LOGIN = 'login';
// router - "/app-auth/login"
export const RT_APP_AUTH_LOGIN = '/' + RB_APP_AUTHORISE + '/' + RB_LOGIN;


export const API_AUTHORISE = 'api/authorize';
export const API_LOGIN = 'login';
