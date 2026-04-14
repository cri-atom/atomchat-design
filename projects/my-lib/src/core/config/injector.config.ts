import { Injector } from '@angular/core';

let _injector: Injector | null = null;

export function setInjector(injector: Injector): void {
  _injector = injector;
}

