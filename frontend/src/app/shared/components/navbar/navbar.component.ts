import {
  Component, ChangeDetectionStrategy, signal, inject, HostListener
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'vdp-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    header {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 900;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5%;
      height: 70px;
      background: rgba(13,13,13,0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      transition: box-shadow 0.3s;
    }
    header.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.4); }
    .logo {
      display: flex; align-items: center; gap: 12px;
      text-decoration: none;
    }
    .logo-mark { width: 42px; height: 42px; flex-shrink: 0; }
    .logo-text { display: flex; flex-direction: column; line-height: 1; }
    .logo-text .name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px; letter-spacing: 3px; color: #F5F5F0;
    }
    .logo-text .tagline {
      font-size: 10px; letter-spacing: 5px; color: #00B4D8;
      text-transform: uppercase;
    }
    nav { display: flex; align-items: center; gap: 36px; }
    nav a {
      color: rgba(245,245,240,0.7);
      text-decoration: none; font-size: 12px;
      font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; transition: color 0.3s;
      position: relative;
    }
    nav a::after {
      content: ''; position: absolute; bottom: -4px; left: 0;
      width: 0; height: 1px; background: #00B4D8; transition: width 0.3s;
    }
    nav a:hover, nav a.active { color: #F5F5F0; }
    nav a:hover::after, nav a.active::after { width: 100%; }
    .nav-cta {
      background: #00B4D8 !important; color: #0D0D0D !important;
      padding: 8px 20px; font-weight: 700 !important;
    }
    .nav-cta::after { display: none !important; }
    .nav-cta:hover { background: #F5F5F0 !important; }
    /* Hamburger */
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      cursor: pointer; background: none; border: none; padding: 4px;
    }
    .hamburger span {
      display: block; width: 24px; height: 2px;
      background: #F5F5F0; transition: all 0.3s;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
    /* Mobile nav */
    .mobile-nav {
      display: none; position: fixed; inset: 70px 0 0 0;
      background: rgba(13,13,13,0.97);
      z-index: 800; padding: 40px 5%;
      flex-direction: column; gap: 8px;
    }
    .mobile-nav.open { display: flex; }
    .mobile-nav a {
      color: #F5F5F0; text-decoration: none;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 36px; letter-spacing: 3px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      padding-bottom: 20px;
    }
    @media (max-width: 768px) {
      nav { display: none; }
      .hamburger { display: flex; }
    }
  `],
  template: `
    <header [class.scrolled]="scrolled()">
      <a routerLink="/" class="logo">
        <div class="logo-mark">
          <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" fill="#161616"/>
            <rect x="4" y="4" width="16" height="16" fill="#00B4D8" opacity="0.85"/>
            <rect x="22" y="4" width="16" height="16" fill="#E63B7A" opacity="0.85"/>
            <rect x="4" y="22" width="16" height="16" fill="#F4C430" opacity="0.85"/>
            <rect x="22" y="22" width="16" height="16" fill="#1A1A1A"/>
          </svg>
        </div>
        <div class="logo-text">
          <span class="name">Visuel Design Print</span>
          <span class="tagline">Imprimerie Grand Format</span>
        </div>
      </a>

      <nav>
        <a routerLink="/" fragment="services" routerLinkActive="active">Services</a>
        <a routerLink="/" fragment="about" routerLinkActive="active">À propos</a>
        <a routerLink="/" fragment="actualites" routerLinkActive="active">Actualités</a>
        <a routerLink="/" fragment="contact" class="nav-cta">Devis gratuit</a>
      </nav>

      <button class="hamburger" [class.open]="mobileOpen()"
              (click)="toggleMobile()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </header>

    <div class="mobile-nav" [class.open]="mobileOpen()">
      <a routerLink="/" fragment="services"    (click)="closeMobile()">Services</a>
      <a routerLink="/" fragment="about"       (click)="closeMobile()">À propos</a>
      <a routerLink="/" fragment="actualites"  (click)="closeMobile()">Actualités</a>
      <a routerLink="/" fragment="contact"     (click)="closeMobile()">Contact</a>
    </div>
  `
})
export class NavbarComponent {
  scrolled    = signal(false);
  mobileOpen  = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMobile(): void { this.mobileOpen.update(v => !v); }
  closeMobile():  void { this.mobileOpen.set(false); }
}
