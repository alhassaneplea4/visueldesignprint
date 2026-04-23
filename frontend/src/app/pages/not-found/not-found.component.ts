import { Component, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vdp-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    /* ── Reset ─────────────────────────────────────────── */
    :host { display: block; }

    /* ── Page ──────────────────────────────────────────── */
    .page {
      min-height: 100vh;
      background: #0D0D0D;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 80px 5% 100px;

      /* Halftone dot pattern — texture d'impression */
      background-image:
        radial-gradient(circle, rgba(255,255,255,.025) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    /* ── Marques de repérage (registration marks) ──────── */
    .reg {
      position: fixed;
      width: 52px; height: 52px;
      pointer-events: none;
    }
    .reg::before, .reg::after {
      content: ''; position: absolute; background: rgba(255,255,255,.12);
    }
    .reg::before { width: 100%; height: 1px; top: 50%; }
    .reg::after  { width: 1px; height: 100%; left: 50%; top: 0; }
    .reg .dot {
      position: absolute; top: 50%; left: 50%;
      width: 16px; height: 16px; border-radius: 50%;
      border: 1px solid rgba(255,255,255,.12);
      transform: translate(-50%, -50%);
    }
    .reg.tl { top: 20px;    left: 20px; }
    .reg.tr { top: 20px;    right: 20px; }
    .reg.bl { bottom: 20px; left: 20px; }
    .reg.br { bottom: 20px; right: 20px; }

    /* ── Blobs CMYK flottants ───────────────────────────── */
    .blobs {
      position: absolute; right: -60px; top: 50%;
      transform: translateY(-55%);
      width: 500px; height: 500px;
      pointer-events: none;
    }
    .blob {
      position: absolute; border-radius: 50%;
      mix-blend-mode: screen; opacity: 0.28;
    }
    .blob.c { width:320px;height:320px; background:#00B4D8; top:0;   left:80px; animation: bA 7s ease-in-out infinite; }
    .blob.m { width:300px;height:300px; background:#E63B7A; bottom:30px; left:0;   animation: bB 9s ease-in-out infinite; }
    .blob.y { width:300px;height:300px; background:#F4C430; bottom:20px; right:0;  animation: bC 8s ease-in-out infinite; }

    @keyframes bA { 0%,100%{transform:translate(0,0)}    50%{transform:translate(-20px,-25px)} }
    @keyframes bB { 0%,100%{transform:translate(0,0)}    50%{transform:translate(18px,22px)}   }
    @keyframes bC { 0%,100%{transform:translate(0,0)}    50%{transform:translate(-14px,-18px)} }

    /* ── Carrés CMYK décoratifs ─────────────────────────── */
    .cmyk-grid {
      position: absolute; left: 32px; bottom: 80px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
      opacity: 0.35;
    }
    .cmyk-grid div { width: 12px; height: 12px; }
    .cmyk-grid div:nth-child(1) { background: #00B4D8; }
    .cmyk-grid div:nth-child(2) { background: #E63B7A; }
    .cmyk-grid div:nth-child(3) { background: #F4C430; }
    .cmyk-grid div:nth-child(4) { background: #1A1A1A; border: 1px solid rgba(255,255,255,.1); }

    /* ── Logo minimal ───────────────────────────────────── */
    .logo-bar {
      position: fixed; top: 0; left: 0; right: 0;
      padding: 18px 5%;
      display: flex; align-items: center; gap: 12px;
      background: rgba(13,13,13,.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,.05);
      z-index: 10;
      text-decoration: none;
    }
    .logo-mark {
      display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
      width: 28px; flex-shrink: 0;
    }
    .logo-mark span { display: block; width: 13px; height: 13px; }
    .logo-mark span:nth-child(1) { background: #00B4D8; opacity:.85; }
    .logo-mark span:nth-child(2) { background: #E63B7A; opacity:.85; }
    .logo-mark span:nth-child(3) { background: #F4C430; opacity:.85; }
    .logo-mark span:nth-child(4) { background: #1A1A1A; }
    .logo-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 17px; letter-spacing: 3px; color: #F5F5F0;
    }

    /* ── Contenu central ────────────────────────────────── */
    .content {
      position: relative; z-index: 5;
      display: flex; flex-direction: column; align-items: flex-start;
      max-width: 700px; width: 100%;
    }

    /* ── Label ──────────────────────────────────────────── */
    .label {
      display: inline-flex; align-items: center; gap: 10px;
      font-size: 11px; font-weight: 600; letter-spacing: 4px;
      text-transform: uppercase; color: #00B4D8; margin-bottom: 20px;
    }
    .label::before {
      content: ''; display: block; width: 30px; height: 1px; background: #00B4D8;
    }

    /* ── Le grand 404 ───────────────────────────────────── */
    .error-code {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(130px, 20vw, 260px);
      line-height: 0.85;
      letter-spacing: -4px;
      color: #F5F5F0;
      user-select: none;
      /* Décalage CMYK — comme une impression mal calée */
      text-shadow:
        -6px -4px 0 rgba(0, 180, 216, 0.7),
         6px  4px 0 rgba(230, 59, 122, 0.7),
         0px  8px 0 rgba(244, 196, 48, 0.5);
      animation: cmyk-drift 10s ease-in-out infinite;
    }

    /* Tentative de recalage périodique — le calage se dérègle puis se corrige */
    @keyframes cmyk-drift {
      0%, 78%, 100% {
        text-shadow:
          -6px -4px 0 rgba(0,180,216,.7),
           6px  4px 0 rgba(230,59,122,.7),
           0px  8px 0 rgba(244,196,48,.5);
      }
      80% {
        text-shadow:
          -18px -10px 0 rgba(0,180,216,.9),
           18px  10px 0 rgba(230,59,122,.9),
           0px   20px 0 rgba(244,196,48,.8);
      }
      82% {
        text-shadow:
          2px 2px 0 rgba(0,180,216,.9),
          -2px -2px 0 rgba(230,59,122,.9),
          1px -3px 0 rgba(244,196,48,.8);
      }
      84% {
        text-shadow:
          -24px 8px 0 rgba(0,180,216,.9),
           20px -12px 0 rgba(230,59,122,.9),
          -8px  24px 0 rgba(244,196,48,.8);
      }
      86% {
        text-shadow:
          -6px -4px 0 rgba(0,180,216,.7),
           6px  4px 0 rgba(230,59,122,.7),
           0px  8px 0 rgba(244,196,48,.5);
      }
    }

    /* ── Règle horizontale ──────────────────────────────── */
    .rule {
      width: 100%; height: 1px; margin: 28px 0 28px;
      background: linear-gradient(90deg, #00B4D8, #E63B7A, #F4C430, transparent);
      opacity: 0.4;
    }

    /* ── Titre et message ───────────────────────────────── */
    .title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(32px, 5vw, 56px);
      letter-spacing: 1px; color: #F5F5F0;
      margin-bottom: 16px; line-height: 1;
    }
    .title em { font-style: normal; color: #00B4D8; }

    .message {
      font-size: 16px; font-weight: 300; line-height: 1.8;
      color: rgba(245,245,240,.6); max-width: 480px; margin-bottom: 40px;
    }

    /* ── Boutons ────────────────────────────────────────── */
    .actions { display: flex; gap: 14px; flex-wrap: wrap; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      background: #00B4D8; color: #0D0D0D;
      padding: 14px 28px; font-family: 'Barlow', sans-serif;
      font-size: 13px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; text-decoration: none;
      transition: all .3s;
      clip-path: polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
    }
    .btn-primary:hover { background: #F5F5F0; transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0,180,216,.4); }

    .btn-outline {
      display: inline-flex; align-items: center; gap: 10px;
      border: 1px solid rgba(245,245,240,.25); color: #F5F5F0;
      padding: 14px 28px; font-size: 13px; font-weight: 600;
      letter-spacing: 2px; text-transform: uppercase; text-decoration: none; transition: all .3s;
    }
    .btn-outline:hover { border-color: #00B4D8; color: #00B4D8; }

    /* ── Barre d'impression infinie ─────────────────────── */
    .print-status {
      position: fixed; bottom: 0; left: 0; right: 0;
      padding: 10px 5%;
      background: rgba(13,13,13,.9);
      border-top: 1px solid rgba(255,255,255,.05);
      display: flex; align-items: center; gap: 16px;
    }
    .print-label {
      font-size: 10px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: #6B6B6B; white-space: nowrap; flex-shrink: 0;
    }
    .bar-track {
      flex: 1; height: 3px; background: rgba(255,255,255,.06); overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #00B4D8, #E63B7A, #F4C430);
      animation: printing 2.4s cubic-bezier(.4,0,.6,1) infinite;
    }
    @keyframes printing {
      0%   { width: 0%;   margin-left: 0; }
      50%  { width: 60%;  margin-left: 20%; }
      100% { width: 0%;   margin-left: 100%; }
    }
    .print-pct {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 14px; color: #6B6B6B; flex-shrink: 0; min-width: 36px;
    }

    /* ── Error code badge ───────────────────────────────── */
    .error-badge {
      position: fixed; top: 22px; right: 5%;
      font-size: 10px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: #6B6B6B;
    }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 768px) {
      .blobs { display: none; }
      .reg.tr, .reg.br { display: none; }
      .error-code { font-size: clamp(100px, 28vw, 160px); letter-spacing: -2px; }
    }
  `],
  template: `
    <!-- Barre logo -->
    <a routerLink="/" class="logo-bar">
      <div class="logo-mark">
        <span></span><span></span><span></span><span></span>
      </div>
      <span class="logo-name">Visuel Design Print</span>
    </a>

    <!-- Badge erreur -->
    <span class="error-badge">Erreur 404</span>

    <!-- Marques de repérage -->
    <div class="reg tl"><div class="dot"></div></div>
    <div class="reg tr"><div class="dot"></div></div>
    <div class="reg bl"><div class="dot"></div></div>
    <div class="reg br"><div class="dot"></div></div>

    <!-- Page principale -->
    <div class="page">

      <!-- Blobs CMYK -->
      <div class="blobs">
        <div class="blob c"></div>
        <div class="blob m"></div>
        <div class="blob y"></div>
      </div>

      <!-- Carrés CMYK décoratifs -->
      <div class="cmyk-grid">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Contenu -->
      <div class="content">
        <span class="label">Erreur d'impression</span>

        <div class="error-code">404</div>

        <div class="rule"></div>

        <h1 class="title">PAGE <em>INTROUVABLE</em></h1>

        <p class="message">
          Cette page semble avoir quitté l'atelier sans prévenir.<br>
          Elle n'est pas dans nos bacs d'impression, ni en cours de calage.<br>
          Nos autres pages, elles, sont parfaitement imprimées.
        </p>

        <div class="actions">
          <a routerLink="/" class="btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="19 12 5 12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Retour à l'accueil
          </a>
          <a routerLink="/" fragment="contact" class="btn-outline">Demander un devis</a>
        </div>
      </div>
    </div>

    <!-- Barre d'état impression -->
    <div class="print-status">
      <span class="print-label">Impression en cours</span>
      <div class="bar-track"><div class="bar-fill"></div></div>
      <span class="print-pct">{{ pct() }}%</span>
    </div>
  `
})
export class NotFoundComponent implements OnInit, OnDestroy {
  pct = signal(0);
  private tid: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.tid = setInterval(() => {
      this.pct.update(v => (v >= 99 ? 0 : v + 1));
    }, 48);
  }

  ngOnDestroy(): void {
    if (this.tid) clearInterval(this.tid);
  }
}
