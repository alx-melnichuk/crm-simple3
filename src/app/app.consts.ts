
export class Tracing {
  public static log(message?: any, ...optionalParams: any[]): void {
    console.log('%cmain: ' + message, 'color: Grey; font-weight: bold; font-style: italic;', ...optionalParams);
  }
}

// Permissions that govern the download of additional applications.
export enum LoadPermission {
  appClient = 'appClient',
  appTask = 'appTask'
}

