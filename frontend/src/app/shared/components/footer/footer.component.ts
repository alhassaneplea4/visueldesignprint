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
    .social-links { display: flex; gap: 10px; margin-top: 20px; }
    .social-link {
      width: 36px; height: 36px; border: 1px solid rgba(255,255,255,.12);
      display: flex; align-items: center; justify-content: center;
      text-decoration: none; color: rgba(245,245,240,.6);
      transition: all .3s;
    }
    .social-link svg { display: block; }
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
            <a href="https://www.facebook.com/share/17NnQYVFwA/" target="_blank" class="social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" target="_blank" class="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://wa.me/224625727237" target="_blank" class="social-link" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
            <a href="#" target="_blank" class="social-link" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
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
            <li><a href="#">Nongo, Conakry - Guinée</a></li>
            <li><a href="tel:+224625727237">+224 625 72 72 37</a></li>
            <li><a href="mailto:visueldesignprintcom@gmail.com">visueldesignprintcom@gmail.com</a></li>
            <li><a href="https://www.facebook.com/share/17NnQYVFwA/" target="_blank">Facebook</a></li>
            <li><a routerLink="/admin">Administration ↗</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} Visuel Design Print. Tous droits réservés.</p>
        <p>By <a href="https://github.com/alhassaneplea4" target="_blank">Elhadj.dev</a></p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
