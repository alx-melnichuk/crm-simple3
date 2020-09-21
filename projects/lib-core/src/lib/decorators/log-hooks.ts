import { environment } from '../../../../../src/environments/environment';

export function LogHooks(): ClassDecorator {
  return (constructor: any): any => {

    if (!environment.production) {
      const LIFECYCLE_HOOKS = [
        'ngOnInit',
        'ngOnChanges',
        'ngOnDestroy'
      ];
      const componentName = constructor.name;

      for (const hook of LIFECYCLE_HOOKS) {
        const original = constructor.prototype[hook];

        constructor.prototype[hook] = function(...args): any {
          console.log(`%c ${componentName} - ${hook}`, `color: #4CAF50; font-weight: bold`, ...args);
          if (original && typeof original === 'function') {
            original.apply(this, args);
          }
        };
      }
    }

  };
}
