import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Intercepteur fonctionnel Angular 21
 * Ajoute automatiquement le token JWT sur chaque requête /api
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const token = auth.token();

  // N'attacher le token que pour les appels API protégés
  if (token && req.url.includes('/api/')) {
    const authed = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authed);
  }

  return next(req);
};
