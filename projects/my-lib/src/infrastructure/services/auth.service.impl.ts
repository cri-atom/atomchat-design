import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, catchError, map, of, take, timeout } from 'rxjs';
import { AuthService, User } from '../../core/services/auth.service';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable()
export class AgentBuilderAuthServiceImpl extends AuthService {
  private readonly http = inject(HttpClient);

  private readonly appConfig = inject(AppConfigService);

  override userdoc = new ReplaySubject<User>(1);

  constructor() {
    super();

    if (this.appConfig.configData.auth.mode === 'http') {
      this.fetchUserFromBackend().pipe(take(1)).subscribe((user) => {
        this.userdoc.next(user);
      });
      return;
    }

    const staticUser = this.appConfig.configData.auth.staticUser;
    this.userdoc.next(staticUser ?? this.getFallbackUser());
  }

  override isSuperAdmin(): Observable<boolean> {
    return this.userdoc.pipe(
      take(1),
      map((user) => user?.email?.endsWith('@atom.com') ?? false),
    );
  }

  private fetchUserFromBackend(): Observable<User> {
    const config = this.appConfig.configData;
    const url = `${config.apiBaseUrl}${config.backendPaths.auth}`;

    return this.http.get<User>(url).pipe(
      timeout(config.requestTimeoutMs),
      catchError(() => of(this.getFallbackUser())),
    );
  }

  private getFallbackUser(): User {
    return {
      id: 'dev-user',
      name: 'Developer',
      email: 'dev@atom.com',
      companyId: 'dev-company',
    };
  }
}
