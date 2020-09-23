
export class NavigateUtil {

  public static reloadByPathName(pathName: string): void {
    if (!!pathName && pathName !== window.location.pathname) {
      const protocolHost = window.location.protocol + '//' + window.location.host;
      window.location.href = protocolHost + pathName;
    }
  }
}
