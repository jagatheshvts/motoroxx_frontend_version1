import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthGaurd implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

  canActivate() {
    if (this.auth.authenticated) {
      return true;
    } else {
      this.router.navigateByUrl('/sessions/signin');
    }
  }
}
