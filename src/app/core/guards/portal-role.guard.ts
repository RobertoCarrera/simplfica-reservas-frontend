import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, switchMap, map, catchError, timeout } from 'rxjs/operators';
import { PortalAuthService } from '../../core/services/portal-auth.service';

@Injectable({ providedIn: 'root' })
export class PortalRoleGuard implements CanActivate {
  private auth = inject(PortalAuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.loading$.pipe(
      // Wait until loading finishes
      filter((loading) => !loading),
      take(1),
      switchMap(() => this.auth.portalUser$),
      take(1),
      timeout(15000),
      map((user) => {
        if (!user) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      }),
    );
  }
}
