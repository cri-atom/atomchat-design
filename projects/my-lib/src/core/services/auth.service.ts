import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  companyId?: string;
}

@Injectable()
export abstract class AuthService {
  abstract userdoc: ReplaySubject<User>;
  abstract isSuperAdmin(): Observable<boolean>;
}
