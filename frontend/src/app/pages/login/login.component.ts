import {
  Component, inject, signal, ChangeDetectionStrategy
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'vdp-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .page {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: #0D0D0D;
      background-image:
        radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0,180,216,.10) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 80% 70%, rgba(230,59,122,.08) 0%, transparent 55%);
    }
    .box {
      background: #1A1A1A; border: 1px solid rgba(255,255,255,.08);
      padding: 48px 52px; width: 100%; max-width: 440px;
    }
    .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 36px; }
    .logo svg { width: 40px; height: 40px; flex-shrink: 0; }
    .logo-text .name { display: block; font-family: 'Bebas Neue',sans-serif; font-size: 18px; letter-spacing: 3px; color: #F5F5F0; }
    .logo-text .tagline { display: block; font-size: 10px; letter-spacing: 4px; color: #00B4D8; text-transform: uppercase; }
    .title { font-family: 'Bebas Neue',sans-serif; font-size: 36px; letter-spacing: 2px; color: #F5F5F0; margin-bottom: 6px; }
    .subtitle { font-size: 13px; font-weight: 300; color: #6B6B6B; margin-bottom: 36px; }
    .error-box {
      background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.25);
      color: #FCA5A5; padding: 10px 14px; font-size: 13px; margin-bottom: 16px;
    }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .field label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #6B6B6B; }
    .field input {
      background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
      color: #F5F5F0; padding: 13px 16px;
      font-family: 'Barlow',sans-serif; font-size: 14px; outline: none;
      transition: border-color .3s; width: 100%;
    }
    .field input:focus { border-color: #00B4D8; }
    .submit {
      width: 100%; background: #00B4D8; border: none; color: #0D0D0D;
      padding: 14px; font-family: 'Barlow',sans-serif; font-size: 13px;
      font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
      cursor: pointer; transition: all .3s; margin-top: 8px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .submit:hover:not(:disabled) { background: #F5F5F0; }
    .submit:disabled { opacity: .6; cursor: not-allowed; }
    .spinner { width: 16px; height: 16px; border: 2px solid #0D0D0D; border-top-color: transparent; border-radius: 50%; animation: spin .6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .hint { font-size: 11px; color: #6B6B6B; text-align: center; margin-top: 20px; }
    .back-link { display: inline-block; margin-top: 24px; color: #00B4D8; font-size: 12px; text-decoration: none; cursor: pointer; }
    .back-link:hover { text-decoration: underline; }
  `],
  template: `
    <div class="page">
      <div class="box">
        <div class="logo">
          <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" fill="#161616"/>
            <rect x="4"  y="4"  width="16" height="16" fill="#00B4D8" opacity="0.85"/>
            <rect x="22" y="4"  width="16" height="16" fill="#E63B7A" opacity="0.85"/>
            <rect x="4"  y="22" width="16" height="16" fill="#F4C430" opacity="0.85"/>
            <rect x="22" y="22" width="16" height="16" fill="#1A1A1A"/>
          </svg>
          <div class="logo-text">
            <span class="name">Visuel Design Print</span>
            <span class="tagline">Administration</span>
          </div>
        </div>

        <div class="title">CONNEXION</div>
        <p class="subtitle">Accédez au panneau d'administration</p>

        @if (errorMsg()) {
          <div class="error-box">{{ errorMsg() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="username">Nom d'utilisateur</label>
            <input id="username" type="text" formControlName="username" placeholder="admin" autocomplete="username" />
          </div>
          <div class="field">
            <label for="password">Mot de passe</label>
            <input id="password" type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password" />
          </div>
          <button type="submit" class="submit" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span>
              <span>Connexion…</span>
            } @else {
              <span>Se connecter</span>
            }
          </button>
        </form>

        <p class="hint">Démo : admin / vdp2025</p>
        <a class="back-link" (click)="goHome()">← Retour au site</a>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb      = inject(FormBuilder);
  private auth    = inject(AuthService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  loading  = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');

    const { username, password } = this.form.value;

    this.auth.login(username!, password!).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Identifiants incorrects');
        this.loading.set(false);
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
