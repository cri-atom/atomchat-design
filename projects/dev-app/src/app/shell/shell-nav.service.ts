import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CANVAS_ROUTE_PATTERN, PRIMARY_RAIL, SECONDARY_MODULES } from './nav.config';
import type { PrimaryRailId } from './nav.model';

@Injectable({ providedIn: 'root' })
export class ShellNavService {
  private readonly router = inject(Router);

  readonly url = signal(this.router.url);
  readonly railCollapsed = signal(false);
  private readonly expandedModules = signal<ReadonlySet<string>>(
    new Set(['plataforma', 'citas', 'campanas']),
  );

  readonly hideSecondary = computed(() => CANVAS_ROUTE_PATTERN.test(this.url()));

  readonly activePrimaryId = computed((): PrimaryRailId | null => {
    const path = this.url().split('?')[0];
    const match = PRIMARY_RAIL.find(
      (item) => item.route && (path === item.route || path.startsWith(`${item.route}/`)),
    );
    return match?.id ?? null;
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.url.set(e.urlAfterRedirects));
  }

  isModuleExpanded(moduleId: string): boolean {
    return this.expandedModules().has(moduleId);
  }

  toggleModule(moduleId: string): void {
    const next = new Set(this.expandedModules());
    if (next.has(moduleId)) {
      next.delete(moduleId);
    } else {
      next.add(moduleId);
    }
    this.expandedModules.set(next);
  }

  expandModule(moduleId: string): void {
    const next = new Set(this.expandedModules());
    next.add(moduleId);
    this.expandedModules.set(next);
  }

  activeModuleId(): string | null {
    const path = this.url().split('?')[0];
    const mod = SECONDARY_MODULES.find(
      (m) => path === m.routePrefix || path.startsWith(`${m.routePrefix}/`),
    );
    return mod?.id ?? null;
  }

  toggleRail(): void {
    this.railCollapsed.update((v) => !v);
  }
}
