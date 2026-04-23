import {
  Component, OnInit, inject, signal, ChangeDetectionStrategy, DestroyRef
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavbarComponent }    from '../../shared/components/navbar/navbar.component';
import { FooterComponent }    from '../../shared/components/footer/footer.component';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { ToastComponent }     from '../../shared/components/toast/toast.component';
import { EventsService }    from '../../core/services/events.service';
import { ContactsService } from '../../core/services/contacts.service';
import { ToastService }    from '../../core/services/toast.service';

@Component({
  selector: 'vdp-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, EventCardComponent, ToastComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./home.component.scss'],
  template: `
    <vdp-navbar />
    <vdp-toast />

    <!-- ── HERO ─────────────────────────────────────────── -->
    <section id="hero" class="hero">
      <div class="hero-bg"></div>
      <div class="cmyk-deco">
        <div class="c1"></div>
        <div class="c2"></div>
        <div class="c3"></div>
        <div class="c4">Visuel Design Print</div>
      </div>
      <div class="hero-content">
        <span class="hero-label">Imprimerie professionnelle — Guinée</span>
        <h1>
          <span class="c">IMPRIMEZ</span><br>
          GRAND<br>
          <span class="m">FORMAT</span>
        </h1>
        <p class="hero-sub">
          <b class="typewriter-line">{{ typedText() }}<span class="type-cursor">|</span></b>
          Des impressions haute définition qui donnent vie à vos idées. Bâches, banderoles,
          affiches, roll-up — nous imprimons tout ce qui fait votre image.
        </p>
        <div class="hero-actions">
          <a href="#contact" class="btn-primary">
            Demander un devis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <a href="#services" class="btn-outline">Nos services</a>
        </div>
      </div>
    </section>

    <!-- ── STATS ─────────────────────────────────────────── -->
    <div class="stats-bar">
      <div class="stat"><span class="stat-num">500<em>+</em></span><span class="stat-lbl">Clients satisfaits</span></div>
      <div class="stat"><span class="stat-num">5<em>ans</em></span><span class="stat-lbl">D'expérience</span></div>
      <div class="stat"><span class="stat-num">48<em>h</em></span><span class="stat-lbl">Délai express</span></div>
      <div class="stat"><span class="stat-num">100<em>%</em></span><span class="stat-lbl">Qualité garantie</span></div>
    </div>

    <!-- ── SERVICES ──────────────────────────────────────── -->
    <section id="services" class="section section--dark">
      <div class="section-header">
        <span class="section-label hero-label">Ce que nous faisons</span>
        <h2>NOS <em>SERVICES</em> D'IMPRESSION</h2>
        <p class="section-desc">De la bâche publicitaire au kakémono, nous maîtrisons tous les supports grand format avec une qualité d'impression irréprochable.</p>
      </div>
      <div class="services-grid">
        @for (service of services; track service.num) {
          <div class="service-card">
            <span class="service-num">{{ service.num }}</span>
            <div class="service-icon">{{ service.icon }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.desc }}</p>
            <a href="#contact" class="service-link">Demander un devis →</a>
          </div>
        }
      </div>
    </section>

    <!-- ── ABOUT ─────────────────────────────────────────── -->
    <section id="about" class="section about-section">
      <div class="about-visual">
        <div class="about-main">
          <div class="about-main-text">
            <img src="vdp.jpg" alt="Visuel Design Print" style="max-width: 100%;height: auto;display: block;">
          </div>
        </div>
        <div class="about-accent"><p>QUALITÉ<br>PROFESSIONNELLE</p></div>
        <div class="about-badge"><span>N°1</span><small>Guinée</small></div>
      </div>
      <div class="about-content">
        <span class="section-label hero-label">Notre histoire</span>
        <h2>L'IMPRESSION AU<br><em>SERVICE DE VOTRE</em><br>COMMUNICATION</h2>
        <p>Visuel Design Print est votre partenaire de confiance pour tous vos besoins d'impression grand format à Conakry et en Guinée. Forts de plusieurs années d'expérience, nous combinons technologies d'impression de pointe et expertise créative.</p>
        <p>Notre équipe de professionnels vous accompagne de la conception à la livraison, en garantissant des résultats qui dépassent vos attentes, dans les meilleurs délais.</p>
        <ul class="about-list">
          @for (item of aboutItems; track item) {
            <li>{{ item }}</li>
          }
        </ul>
      </div>
    </section>

    <!-- ── PROCESS ────────────────────────────────────────── -->
    <section id="process" class="section section--dark">
      <div class="section-header section-header--center">
        <span class="section-label hero-label">Comment ça marche</span>
        <h2>NOTRE <em>PROCESSUS</em><br>EN 4 ÉTAPES</h2>
      </div>
      <div class="process-grid">
        @for (step of steps; track step.num) {
          <div class="step">
            <div class="step-num">{{ step.num }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        }
      </div>
    </section>

    <!-- ── ACTUALITÉS ─────────────────────────────────────── -->
    <section id="actualites" class="section">
      <div class="section-header">
        <span class="section-label hero-label">Ce qui se passe</span>
        <h2>ACTUALITÉS & <em>RÉALISATIONS</em></h2>
      </div>

      @if (eventsSvc.loading()) {
        <div class="events-loading">
          @for (i of [1,2,3]; track i) {
            <div class="skeleton-card"></div>
          }
        </div>
      } @else if (eventsSvc.events().length === 0) {
        <div class="events-empty">
          <span>📰</span>
          <p>Aucune actualité pour le moment. Revenez bientôt !</p>
        </div>
      } @else {
        <div class="events-grid">
          @for (ev of eventsSvc.events(); track ev.id) {
            <vdp-event-card [event]="ev" />
          }
        </div>
      }
    </section>

    

    <!-- ── ÉQUIPE ───────────────────────────────────────────── -->
    <section id="equipe" class="section">
      <div class="section-header">
        <span class="section-label hero-label">Les visages derrière l'excellence</span>
        <h2>NOTRE <em>ÉQUIPE</em></h2>
        <p class="section-desc">Une équipe passionnée et créative, dédiée à donner vie à vos projets avec la plus haute qualité d'impression.</p>
      </div>

      <div class="team-grid">
        @for (member of team; track member.name) {
          <div class="team-card">
            <div class="team-avatar" [style.--accent]="member.color">
              <img [src]="member.photo" [alt]="member.name" class="team-avatar-img">
              <div class="team-avatar-bar"></div>
            </div>
            <div class="team-card-body">
              <h4>{{ member.name }}</h4>
              <span class="team-role" [style.color]="member.color">{{ member.role }}</span>
              <p>{{ member.bio }}</p>
            </div>
          </div>
        }
      </div>

      <div class="team-photo-slot">
        <img src="team-slot.jpg" alt="L'équipe Visuel Design Print" class="team-photo-img">
      </div>
    </section>

    <!-- ── CONTACT ────────────────────────────────────────── -->
    <section id="contact" class="section section--dark">
      <div class="contact-inner">
        <div class="contact-info">
          <span class="section-label hero-label">Parlons de votre projet</span>
          <h3>DEMANDEZ VOTRE DEVIS <em>GRATUIT</em></h3>
          <p>Décrivez-nous votre projet et nous vous recontacterons dans les plus brefs délais.</p>
          <div class="contact-items">
            @for (item of contactItems; track item.label) {
              <div class="contact-item">
                <div class="contact-icon" [innerHTML]="item.icon"></div>
                <div>
                  <span class="contact-item-label">{{ item.label }}</span>
                  <span class="contact-item-value">{{ item.value }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <form class="contact-form" [formGroup]="contactForm" (ngSubmit)="sendContact()">
          <div class="form-row">
            <div class="form-field">
              <label>Nom complet</label>
              <input type="text" formControlName="name" placeholder="Votre nom" />
            </div>
            <div class="form-field">
              <label>Téléphone</label>
              <input type="tel" formControlName="phone" placeholder="+224 ..." />
            </div>
          </div>
          <div class="form-field">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="votre@email.com" />
          </div>
          <div class="form-field">
            <label>Type de service</label>
            <select formControlName="service">
              <option value="">Choisir un service…</option>
              @for (svc of serviceOptions; track svc) {
                <option [value]="svc">{{ svc }}</option>
              }
            </select>
          </div>
          <div class="form-field">
            <label>Description du projet</label>
            <textarea formControlName="message"
                      placeholder="Décrivez votre projet : dimensions, quantité, délai…"></textarea>
          </div>
          <button type="submit" class="btn-primary">
            <span>Envoyer la demande</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </form>
      </div>
    </section>

    <vdp-footer />
  `
})
export class HomeComponent implements OnInit {
  eventsSvc          = inject(EventsService);
  private contactsSvc = inject(ContactsService);
  private toast       = inject(ToastService);
  private fb          = inject(FormBuilder);
  private destroyRef  = inject(DestroyRef);
  private san         = inject(DomSanitizer);
  private svg         = (h: string): SafeHtml => this.san.bypassSecurityTrustHtml(h);

  typedText = signal('');

  private readonly phrases = [
    'Là où vos idées prennent vie en grand.',
    'Imprimerie Moderne',
    'De la Conception à la Réalisation'
  ];

  private typeWriter(): void {
    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let tid: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = this.phrases[phraseIndex];
      if (!isDeleting) {
        this.typedText.set(current.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          tid = setTimeout(tick, 2200);
          return;
        }
      } else {
        this.typedText.set(current.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting  = false;
          phraseIndex = (phraseIndex + 1) % this.phrases.length;
          tid = setTimeout(tick, 500);
          return;
        }
      }
      tid = setTimeout(tick, isDeleting ? 45 : 75);
    };

    tid = setTimeout(tick, 600);
    this.destroyRef.onDestroy(() => clearTimeout(tid));
  }

  contactForm = this.fb.group({
    name   : ['', Validators.required],
    phone  : [''],
    email  : ['', [Validators.required, Validators.email]],
    service: [''],
    message: ['', Validators.required]
  });

  serviceOptions = [
    'Bâches & Banderoles', 'Affiches & Kakémonos',
    'Covering Véhicule', 'Vitrophanie',
    'Panneaux & Enseignes', 'Packaging & Flyers',
    'Communication événementielle', 'Enseignes lumineuses', 'Autre'
  ];

  services = [
    { num:'01', icon:'🖼️', title:'Bâches & Banderoles',            desc:'Bâches publicitaires, banderoles événementielles et habillages de façade. Résistants aux intempéries, en haute définition.' },
    { num:'02', icon:'📋', title:'Affiches & Kakémonos',            desc:'Affiches grand format, roll-up et kakémonos pour vos événements, salons et points de vente. Impact visuel maximum.' },
    { num:'03', icon:'🚗', title:'Covering Véhicule',               desc:'Habillage complet ou partiel de vos véhicules. Transformez votre flotte en support de communication mobile.' },
    { num:'04', icon:'🪟', title:'Vitrophanie',                     desc:'Décoration et communication sur vitres, miroirs et surfaces lisses. Films adhésifs, dépolis personnalisés.' },
    { num:'05', icon:'🪧', title:'Panneaux & Enseignes',            desc:'Panneaux rigides, signalétique directionnelle et totems publicitaires pour votre commerce ou entreprise.' },
    { num:'06', icon:'📦', title:'Packaging & Flyers',              desc:'Flyers, brochures, cartes de visite et packaging personnalisé. Communication print complète pour votre marque.' },
    { num:'07', icon:'🎪', title:'Communication événementielle',    desc:'Habillage de stands, backdrops, scénographies et supports promotionnels. Faites de chaque événement une expérience visuelle immersive et mémorable.' },
    { num:'08', icon:'💡', title:'Enseignes lumineuses',            desc:'Lettres découpées rétroéclairées, caissons LED et néons personnalisés. Offrez à votre commerce une visibilité percutante, de jour comme de nuit.' }
  ];

  aboutItems = [
    'Une équipe jeune, dynamique et motivée',
    'Équipements d\'impression dernière génération',
    'Matériaux de qualité supérieure et durables',
    'Délais de production express disponibles',
    'Conseil en création graphique inclus',
    'Livraison et pose sur site possible'
  ];

  steps = [
    { num:'01', title:'Consultation',  desc:'Nous analysons vos besoins, votre budget et vos objectifs pour vous proposer la solution idéale.' },
    { num:'02', title:'Conception',    desc:'Notre équipe crée ou adapte votre fichier graphique pour une impression optimale selon le support choisi.' },
    { num:'03', title:'Production',    desc:'Impression sur nos équipements grand format avec contrôle qualité rigoureux à chaque étape.' },
    { num:'04', title:'Livraison',     desc:'Livraison dans les délais convenus avec pose professionnelle sur site si nécessaire.' }
  ];

  team = [
    {
      name: 'Prénom & Nom', role: 'Directeur Général', color: '#00B4D8',
      photo: 'team/vdp.jpg',
      bio: 'Fondateur de Visuel Design Print, il orchestre la vision et la stratégie de l\'entreprise avec plus de 10 ans d\'expérience dans l\'impression grand format en Guinée.'
    },
    {
      name: 'Prénom & Nom', role: 'Responsable Créative', color: '#E63B7A',
      photo: 'team/vdp.jpg',
      bio: 'Designer passionnée, elle transforme chaque brief en création visuelle percutante. Son sens artistique est le moteur de notre identité créative.'
    },
    {
      name: 'Prénom & Nom', role: 'Technicien en Impression', color: '#F4C430',
      photo: 'team/vdp.jpg',
      bio: 'Maître de nos machines grand format, il garantit la perfection technique de chaque production, du calibrage des couleurs à la finition finale.'
    }
  ];

  contactItems: { icon: SafeHtml; label: string; value: string }[] = [
    {
      icon: this.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`),
      label: 'Adresse', value: 'Nongo - Conakry, Guinée'
    },
    {
      icon: this.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`),
      label: 'Téléphone', value: '+224 625 72 72 37'
    },
    {
      icon: this.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`),
      label: 'Email', value: 'visueldesignprintcom@gmail.com'
    },
    {
      icon: this.svg(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`),
      label: 'Horaires', value: 'Lun – Sam : 8h – 20h'
    }
  ];

  ngOnInit(): void {
    this.eventsSvc.loadAll().subscribe();
    this.typeWriter();
  }

  sendContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const { name, phone, email, service, message } = this.contactForm.value;
    this.contactsSvc.submit({ name: name!, phone: phone ?? '', email: email!, service: service ?? '', message: message! })
      .subscribe({
        next:  () => { this.toast.success('Demande envoyée ! Nous vous recontacterons très bientôt.'); this.contactForm.reset(); },
        error: () =>   this.toast.error('Erreur lors de l\'envoi. Veuillez réessayer.')
      });
  }
}
