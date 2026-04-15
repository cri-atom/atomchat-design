import { Injector } from '@angular/core';

let _injector: Injector | null = null;

/**
 * Stores the root Angular {@link Injector} for use outside the DI tree.
 * Called once by {@link AtomAgentBuilderModule} during application bootstrap.
 *
 * @param injector - The application-level injector provided by the host module.
 */
export function setInjector(injector: Injector): void {
  _injector = injector;
}

