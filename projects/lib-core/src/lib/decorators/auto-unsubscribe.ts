
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

export function AutoUnsubscribe(config: { exclude?: string[]; includeArrays?: string[]; } = { exclude: [], includeArrays: [] }): any {
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
