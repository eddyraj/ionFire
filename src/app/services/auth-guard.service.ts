import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private auth: AuthService
    ) { }

  canActivate(): boolean {

    this.auth.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      if(!user){
        this.router.navigate(['home']);
        return false;
      }
    });

    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
