import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * Authenticated user profile resolved at runtime.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  /** URL of the user's profile picture. */
  avatar?: string;
  companyId?: string;
}

/**
 * Abstract authentication service.
 *
 * @remarks
 * Provide a concrete implementation via {@link AtomAgentBuilderModule.forRoot}
 * or {@link AtomAgentBuilderConfig.services}. The library ships with a default
 * implementation that reads from {@link AppConfigService} static config.
 */
@Injectable()
export abstract class AuthService {
  /**
   * Emits the current user profile.
   * Uses a `ReplaySubject` so late subscribers receive the last emitted value.
   */
  abstract userdoc: ReplaySubject<User>;

  /** Emits `true` when the authenticated user has super-admin privileges. */
  abstract isSuperAdmin(): Observable<boolean>;
}
