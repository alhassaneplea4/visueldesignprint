import {
  Component, inject, signal, ChangeDetectionStrategy, HostListener
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService }    from '../../../core/services/auth.service';
import { EventsService }   from '../../../core/services/events.service';
import { ContactsService } from '../../../core/services/contacts.service';
import { ToastComponent }  from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'vdp-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: flex; min-height: 100vh; background: #0D0D0D; }
    /* Sidebar */
    .sidebar {
      width: 260px; min-height: 100vh; background: #131313;
      border-right: 1px solid rgba(255,255,255,.06);
      display: flex; flex-direction: column; flex-shrink: 0;
      position: fixed; top: 0; left: 0; bottom: 0;
      transition: transform .3s;
      z-index: 200;
    }
    .sidebar.collapsed { transform: translateX(-260px); }
    .sb-logo {
      padding: 22px 24px; border-bottom: 1px solid rgba(255,255,255,.06);
      display: flex; align-items: center; gap: 12px;
    }
    .sb-logo svg { width: 34px; height: 34px; flex-shrink: 0; }
    .sb-logo-text .name { display: block; font-family: 'Bebas Neue',sans-serif; font-size: 16px; letter-spacing: 2px; color: #F5F5F0; }
    .sb-logo-text .role { display: block; font-size: 9px; letter-spacing: 3px; color: #00B4D8; }
    .sb-badge { background: rgba(0,180,216,.15); color: #00B4D8; font-size: 9px; font-weight: 700; letter-spacing: 2px; padding: 3px 8px; margin-left: auto; text-transform: uppercase; }
    .sb-nav { padding: 24px 0; flex: 1; overflow-y: auto; }
    .nav-group-label { font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6B6B6B; padding: 0 24px 10px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 24px; color: rgba(245,245,240,.55);
      cursor: pointer; transition: all .2s; font-size: 13px;
      font-weight: 600; letter-spacing: .5px; border-left: 3px solid transparent;
      text-decoration: none;
    }
    .nav-item:hover { color: #F5F5F0; background: rgba(255,255,255,.04); }
    .nav-item.active { color: #00B4D8; background: rgba(0,180,216,.08); border-left-color: #00B4D8; }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .nav-badge { background: #E63B7A; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 6px; margin-left: auto; min-width: 20px; text-align: center; }
    .sb-footer { padding: 20px 24px; border-top: 1px solid rgba(255,255,255,.06); }
    .user-info { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .user-avatar { width: 36px; height: 36px; background: #00B4D8; color: #0D0D0D; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .user-name { font-size: 13px; font-weight: 600; color: #F5F5F0; }
    .user-role { font-size: 11px; color: #6B6B6B; letter-spacing: 1px; }
    .btn-logout {
      width: 100%; background: transparent; border: 1px solid rgba(255,255,255,.08);
      color: rgba(245,245,240,.5); padding: 8px; font-family: 'Barlow',sans-serif;
      font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
      text-transform: uppercase; cursor: pointer; transition: all .2s;
    }
    .btn-logout:hover { border-color: #EF4444; color: #EF4444; }
    /* Main */
    .main { flex: 1; margin-left: 260px; display: flex; flex-direction: column; min-height: 100vh; transition: margin .3s; }
    .main.expanded { margin-left: 0; }
    .topbar {
      background: #131313; border-bottom: 1px solid rgba(255,255,255,.06);
      padding: 0 32px; height: 64px;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 100;
    }
    .topbar-left { display: flex; align-items: center; gap: 16px; }
    .toggle-btn { background: none; border: 1px solid rgba(255,255,255,.08); color: #F5F5F0; width: 36px; height: 36px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all .2s; }
    .toggle-btn:hover { border-color: #00B4D8; color: #00B4D8; }
    .topbar-title { font-family: 'Barlow Condensed',sans-serif; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #F5F5F0; }
    .topbar-actions { display: flex; align-items: center; gap: 12px; }
    .btn-icon { width: 38px; height: 38px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); color: #F5F5F0; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; transition: all .2s; text-decoration: none; }
    .btn-icon:hover { border-color: #00B4D8; color: #00B4D8; }
    .page-content { flex: 1; padding: 32px; }
    /* Mobile overlay */
    .sb-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 150; }
    .sb-overlay.show { display: block; }
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-260px); }
      .sidebar.open { transform: translateX(0); }
      .main { margin-left: 0; }
    }
  `],
  template: `
    <vdp-toast />

    <!-- Sidebar -->
    <aside class="sidebar" [class.open]="sidebarOpen()" [class.collapsed]="!sidebarOpen()">
      <div class="sb-logo">
        <img src="vdp.jpg" alt="Visuel Design Print" style="width: 42px; height: 42px;" class="logo-img">
        <div class="sb-logo-text">
          <span class="name">Visuel Design</span>
          <span class="role">Administration</span>
        </div>
        <span class="sb-badge">ADMIN</span>
      </div>

      <nav class="sb-nav">
        <div class="nav-group-label">Menu principal</div>
        <a class="nav-item" routerLink="/admin/dashboard" routerLinkActive="active" (click)="closeSidebarMobile()">
          <span class="nav-icon">📊</span>Tableau de bord
        </a>
        <a class="nav-item" routerLink="/admin/events" routerLinkActive="active" (click)="closeSidebarMobile()">
          <span class="nav-icon">📰</span>Actualités & Événements
        </a>
        <a class="nav-item" routerLink="/admin/contacts" routerLinkActive="active" (click)="closeSidebarMobile()">
          <span class="nav-icon">✉️</span>Demandes de devis
          @if (contacts.unreadCount() > 0) {
            <span class="nav-badge">{{ contacts.unreadCount() }}</span>
          }
        </a>

        <a class="nav-item" routerLink="/admin/logs" routerLinkActive="active" (click)="closeSidebarMobile()">
          <span class="nav-icon">📋</span>Journal d'activités
        </a>

        <div class="nav-group-label" style="margin-top:20px">Accès rapide</div>
        <a class="nav-item" routerLink="/" target="_blank">
          <span class="nav-icon">🌐</span>Voir le site
        </a>
      </nav>

      <div class="sb-footer">
        <div class="user-info">
          <div class="user-avatar">{{ userInitial() }}</div>
          <div>
            <div class="user-name">{{ auth.currentUser()?.username }}</div>
            <div class="user-role">Super Admin</div>
          </div>
        </div>
        <button class="btn-logout" (click)="logout()">Déconnexion</button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div class="sb-overlay" [class.show]="sidebarOpen() && isMobile()" (click)="closeSidebarMobile()"></div>

    <!-- Main content -->
    <div class="main" [class.expanded]="!sidebarOpen()">
      <div class="topbar">
        <div class="topbar-left">
          <button class="toggle-btn" (click)="toggleSidebar()" aria-label="Toggle sidebar">☰</button>
          <span class="topbar-title">Administration</span>
        </div>
        <div class="topbar-actions">
          <a routerLink="/" class="btn-icon" title="Voir le site">🌐</a>
        </div>
      </div>

      <div class="page-content">
        <router-outlet />
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  auth          = inject(AuthService);
  contacts      = inject(ContactsService);
  private router = inject(Router);

  sidebarOpen = signal(true);
  isMobile    = signal(false);

  userInitial() {
    return (this.auth.currentUser()?.username?.[0] ?? 'A').toUpperCase();
  }

  constructor() {
    this.checkMobile();
    this.contacts.loadAll().subscribe();
  }

  @HostListener('window:resize')
  checkMobile(): void {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (mobile) this.sidebarOpen.set(false);
    else this.sidebarOpen.set(true);
  }

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  closeSidebarMobile(): void { if (this.isMobile()) this.sidebarOpen.set(false); }

  logout(): void { this.auth.logout(); }
}
