import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { tap }        from 'rxjs/operators';
import { environment } from '@env/environment';

export interface AuthUser {
  username: string;
  role    : string;
}

interface LoginResponse {
  success: boolean;
  token  : string;
  user   : AuthUser;
}

const TOKEN_KEY = 'vdp_token';
const USER_KEY  = 'vdp_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  // ── Signals ──────────────────────────────────────────────
  readonly token       = signal<string | null>(this._getStoredToken());
  readonly currentUser = signal<AuthUser | null>(this._getStoredUser());
  readonly isLoggedIn  = computed(() => !!this.token());

  // ── Login ─────────────────────────────────────────────────
  login(username: string, password: string) {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      { username, password }
    ).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          this.token.set(res.token);
          this.currentUser.set(res.user);
        }
      })
    );
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
