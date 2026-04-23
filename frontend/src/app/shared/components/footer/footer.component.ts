import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vdp-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    footer {
      background: #0D0D0D;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 60px 5% 30px;
    }
    .footer-inner {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: 60px;
      margin-bottom: 48px;
    }
    .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .logo-mark { width: 36px; height: 36px; flex-shrink: 0; }
    .logo-text { display: flex; flex-direction: column; line-height: 1; }
    .logo-text .name { font-family: 'Bebas Neue',sans-serif; font-size: 16px; letter-spacing: 2px; color: #F5F5F0; }
    .logo-text .tagline { font-size: 9px; letter-spacing: 3px; color: #00B4D8; }
    .brand-desc { font-size: 14px; font-weight: 300; line-height: 1.7; color: rgba(245,245,240,.5); margin-top: 16px; }
    .col-title { font-family: 'Barlow Condensed',sans-serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #F5F5F0; margin-bottom: 20px; }
    ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    ul li a { color: rgba(245,245,240,.5); text-decoration: none; font-size: 13px; transition: color .3s; }
    ul li a:hover { color: #00B4D8; }
    .social-links { display: flex; gap: 12px; margin-top: 20px; }
    .social-link {
      width: 36px; height: 36px; border: 1px solid rgba(255,255,255,.12);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; text-decoration: none; color: #F5F5F0;
      transition: all .3s;
    }
    .social-link:hover { border-color: #00B4D8; background: rgba(0,180,216,.12); color: #00B4D8; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,.06);
      padding-top: 24px;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px;
    }
    .footer-bottom p { font-size: 12px; color: rgba(245,245,240,.35); }
    .footer-bottom a { color: #00B4D8; text-decoration: none; font-size: 12px; }
    @media (max-width: 1024px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px)  { .footer-inner { grid-template-columns: 1fr; } }
  `],
  template: `
    <footer>
      <div class="footer-inner">
        <div>
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
          <p class="brand-desc">Votre partenaire d'impression grand format à Conakry. Qualité, rapidité, professionnalisme.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/share/17NnQYVFwA/" target="_blank" class="social-link" aria-label="Facebook">f</a>
            <a href="#" class="social-link" aria-label="WhatsApp">w</a>
            <a href="#" class="social-link" aria-label="Instagram">ig</a>
          </div>
        </div>

        <div>
          <div class="col-title">Services</div>
          <ul>
            <li><a href="#services">Bâches & Banderoles</a></li>
            <li><a href="#services">Affiches & Kakémonos</a></li>
            <li><a href="#services">Covering Véhicule</a></li>
            <li><a href="#services">Vitrophanie</a></li>
            <li><a href="#services">Panneaux & Enseignes</a></li>
            <li><a href="#services">Packaging & Flyers</a></li>
          </ul>
        </div>

        <div>
          <div class="col-title">Navigation</div>
          <ul>
            <li><a routerLink="/">Accueil</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#process">Processus</a></li>
            <li><a href="#actualites">Actualités</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <div class="col-title">Contact</div>
          <ul>
            <li><a href="#">Conakry, Guinée</a></li>
            <li><a href="tel:+224000000000">+224 XXX XXX XXX</a></li>
            <li><a href="mailto:contact@vdesignprint.com">contact&#64;vdesignprint.com</a></li>
            <li><a href="https://www.facebook.com/share/17NnQYVFwA/" target="_blank">Facebook</a></li>
            <li><a routerLink="/admin">Administration ↗</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} Visuel Design Print. Tous droits réservés.</p>
        <p>Fait avec ❤️ à Conakry, Guinée</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
