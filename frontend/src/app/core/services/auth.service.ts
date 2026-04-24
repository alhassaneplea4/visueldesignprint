import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ActivityLogService } from './activity-log.service';

export interface AuthUser {
  username: string;
  role    : string;
}

const TOKEN_KEY  = 'vdp_token';
const USER_KEY   = 'vdp_user';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'vdp2025';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router  = inject(Router);
  private logSvc  = inject(ActivityLogService);

  // ── Signals ──────────────────────────────────────────────
  readonly token       = signal<string | null>(this._getStoredToken());
  readonly currentUser = signal<AuthUser | null>(this._getStoredUser());
  readonly isLoggedIn  = computed(() => !!this.token());

  // ── Login ─────────────────────────────────────────────────
  login(username: string, password: string): Observable<{ success: boolean; token: string; user: AuthUser }> {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const user: AuthUser = { username, role: 'admin' };
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      this.token.set(token);
      this.currentUser.set(user);
      this.logSvc.addLog('LOGIN', `Connexion administrateur : ${username}`, username);
      return of({ success: true, token, user });
    }
    return throwError(() => ({ error: { message: 'Identifiants incorrects' } }));
  }

  // ── Logout ────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // ── Helpers privés ────────────────────────────────────────
  private _getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private _getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
