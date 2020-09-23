import { SimpleChanges, SimpleChange } from '@angular/core';



/** Defines the parameters of a `CookieOptions` instance. */
export interface CookieOptionsParams {
  /** The domain for which the cookie is valid. */
  domain: string;
  /** The expiration date and time for the cookie. An `undefined` value indicates a session cookie. */
  expires: Date;
  /** The maximum duration, in seconds, until the cookie expires. A negative value indicates a session cookie. */
  maxAge: number;
  /** The path to which the cookie applies. */
  path: string;
  /** Value indicating whether to transmit the cookie over HTTPS only. */
  secure: boolean;
}

/** Defines the attributes of a HTTP cookie. */
export class CookieOptions {
  /** The domain for which the cookie is valid. */
  domain: string;
  /** The expiration date and time for the cookie. An `undefined` value indicates a session cookie. */
  expires?: Date;
  /** The path to which the cookie applies. */
  path: string;
  /** Value indicating whether to transmit the cookie over HTTPS only. */
  secure: boolean;
  /** The maximum duration, in seconds, until the cookie expires. A negative value indicates a session cookie. */
  get maxAge(): number {
    if (!this.expires) {
      return -1;
    }
    const now = new Date();
    return (this.expires > now ? Math.ceil((this.expires.getTime() - now.getTime()) / 1000) : 0);
  }
  set maxAge(value: number) {
    this.expires = (value < 0 ? undefined : new Date(Date.now() + (value * 1000)));
  }

  /**
   * Creates new cookie options.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<CookieOptionsParams> = {}) {
    const {domain = '', expires, maxAge = -1, path = '', secure = false} = options;
    this.domain = domain;
    this.expires = expires;
    this.path = path;
    this.secure = secure;
    this.maxAge = (maxAge >= 0 ? maxAge : this.maxAge);
  }
}


export class CookieUtil {

  private static defaults = {
    domain: '',
    expires: null,
    maxAge: -1,
    path: '',
    secure: false
  };

  /** The keys of the cookies associated with the current document. */
  public static get keys(): string[] {
    const keys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '');
    return keys.length ? keys.split(/\s*(?:=[^;]*)?;\s*/).map(decodeURIComponent) : [];
  }

  /** The number of cookies associated with the current document. */
  public static get keyLength(): number {
    return CookieUtil.keys.length;
  }

  /** Removes all cookies associated with the current document. */
  /*clear(): void {
    const changes: SimpleChanges = {};
    for (const [key, value] of this) {
      changes[key] = new SimpleChange(value, undefined, false);
      CookieUtil._removeItem(key);
    }
  }*/

  /**
   * Gets a value indicating whether the current document has a cookie with the specified key.
   * @param key The cookie name.
   * @return `true` if the current document has a cookie with the specified key, otherwise `false`.
   */
  public static has(key: string): boolean {
    const token = encodeURIComponent(key).replace(/[-.+*]/g, String.raw`\$&`);
    return new RegExp(String.raw`(?:^|;\s*)${token}\s*=`).test(document.cookie);
  }

  /**
   * Gets the value associated to the specified key.
   * @param key The cookie name.
   * @param defaultValue The value to return if the cookie does not exist.
   * @return The cookie value, or the default value if the cookie is not found.
   */
  public static get(key: string, defaultValue?: string): string | undefined {
    if (!CookieUtil.has(key)) {
      return defaultValue;
    }
    try {
      const token = encodeURIComponent(key).replace(/[-.+*]/g, String.raw`\$&`);
      const scanner = new RegExp(String.raw`(?:(?:^|.*;)\s*${token}\s*=\s*([^;]*).*$)|^.*$`);
      return decodeURIComponent(document.cookie.replace(scanner, '$1'));
    }
    catch {
      return defaultValue;
    }
  }

  /**
   * Gets the deserialized value associated to the specified key.
   * @param key The cookie name.
   * @param defaultValue The value to return if the cookie does not exist.
   * @return The deserialized cookie value, or the default value if the cookie is not found.
   */
  public static getObject(key: string, defaultValue?: any): any {
    try {
      const value = CookieUtil.get(key);
      return value !== undefined ? JSON.parse(value) : defaultValue;
    }

    catch {
      return defaultValue;
    }
  }
  /**
   * Removes the cookie with the specified key and its associated value.
   * @param key The cookie name.
   * @param options The cookie options.
   * @return The value associated with the specified key before it was removed.
   */
  public static remove(key: string, options?: CookieOptions): string | undefined {
    const previousValue = CookieUtil.get(key);
    CookieUtil._removeItem(key, options);
    return previousValue;
  }
  /**
   * Associates a given value to the specified key.
   * @param key The cookie name.
   * @param value The cookie value.
   * @param options The cookie options.
   * @return This instance.
   * @throws `TypeError` The specified key is invalid.
   */
  public static set(key: string, value: string, options?: CookieOptions): void {
    if (!key.length) {
      throw new TypeError('Invalid cookie name.');
    }
    const cookieOptions = CookieUtil._getOptions(options).toString();
    let cookieValue = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (!!cookieOptions.length) {
      cookieValue += `; ${cookieOptions}`;
    }
    document.cookie = cookieValue;
  }

  /**
   * Serializes and associates a given value to the specified key.
   * @param key The cookie name.
   * @param value The cookie value.
   * @param options The cookie options.
   * @return This instance.
   */
  public static setObject(key: string, value: any, options?: CookieOptions): void {
    return CookieUtil.set(key, JSON.stringify(value), options);
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public static toString(): string {
    return document.cookie;
  }

  /**
   * Merges the default cookie options with the specified ones.
   * @param options The options to merge with the defaults.
   * @return The resulting cookie options.
   */
  private static _getOptions(options: CookieOptions = new CookieOptions()): CookieOptions {
    return new CookieOptions({
      domain: (options.domain.length ? options.domain : CookieUtil.defaults.domain),
      expires: (options.expires != null ? options.expires : CookieUtil.defaults.expires),
      path: (options.path.length ? options.path : CookieUtil.defaults.path),
      secure: (options.secure != null ? options.secure : CookieUtil.defaults.secure)
    });
  }

  /**
   * Removes the value associated to the specified key.
   * @param key The cookie name.
   * @param options The cookie options.
   */
  private static _removeItem(key: string, options?: CookieOptions): void {
    if (!CookieUtil.has(key)) {
      return;
    }
    const cookieOptions = CookieUtil._getOptions(options);
    cookieOptions.expires = new Date(0);
    document.cookie = `${encodeURIComponent(key)}=; ${cookieOptions}`;
  }
}
