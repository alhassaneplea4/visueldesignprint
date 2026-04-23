import {
  Component, OnInit, inject, ChangeDetectionStrategy
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EventsService }   from '../../../core/services/events.service';
import { ContactsService } from '../../../core/services/contacts.service';

@Component({
  selector: 'vdp-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    h1 { font-family: 'Bebas Neue',sans-serif; font-size: 36px; letter-spacing: 2px; color: #F5F5F0; margin-bottom: 8px; }
    .subtitle { font-size: 13px; color: #6B6B6B; margin-bottom: 32px; }
    /* Stats */
    .stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,.06); padding: 24px; position: relative; overflow: hidden; }
    .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--c, #00B4D8); }
    .stat-card:nth-child(2) { --c: #E63B7A; }
    .stat-card:nth-child(3) { --c: #F4C430; }
    .stat-card:nth-child(4) { --c: #22C55E; }
    .stat-card:nth-child(5) { --c: #E63B7A; }
    .stat-card:nth-child(6) { --c: #F4C430; }
    .stat-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #6B6B6B; margin-bottom: 10px; }
    .stat-value { font-family: 'Bebas Neue',sans-serif; font-size: 52px; line-height: 1; color: var(--c, #00B4D8); }
    /* Grid */
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .panel { background: #1A1A1A; border: 1px solid rgba(255,255,255,.06); padding: 28px; }
    .panel-title { font-family: 'Barlow Condensed',sans-serif; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #F5F5F0; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
    .panel-link { font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #00B4D8; text-decoration: none; }
    /* Recent events */
    .recent-item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.04); }
    .recent-item:last-child { border-bottom: none; }
    .recent-thumb { width: 50px; height: 38px; background: #131313; border: 1px solid rgba(255,255,255,.06); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; overflow: hidden; }
    .recent-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .recent-title { font-size: 13px; font-weight: 600; color: #F5F5F0; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
    .recent-date  { font-size: 11px; color: #6B6B6B; }
    .badge { display: inline-block; padding: 3px 9px; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-left: auto; flex-shrink: 0; }
    .badge-cyan    { background: rgba(0,180,216,.15);  color: #00B4D8; }
    .badge-pink    { background: rgba(230,59,122,.15); color: #E63B7A; }
    .badge-yellow  { background: rgba(244,196,48,.15); color: #F4C430; }
    .badge-green   { background: rgba(34,197,94,.15);  color: #22C55E; }
    /* Categories */
    .cat-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .cat-label { font-size: 13px; font-weight: 600; color: #F5F5F0; min-width: 120px; }
    .cat-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,.06); }
    .cat-bar { height: 100%; background: #00B4D8; transition: width .5s ease; }
    .cat-count { font-size: 12px; color: #6B6B6B; min-width: 24px; text-align: right; }
    /* Empty */
    .empty { text-align: center; padding: 40px 20px; color: #6B6B6B; font-size: 14px; }
    .empty span { display: block; font-size: 36px; margin-bottom: 10px; }
    /* Contacts recents */
    .contact-row { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,.04); }
    .contact-row:last-child { border-bottom:none; }
    .dot { width:8px; height:8px; border-radius:50%; margin-top:4px; flex-shrink:0; }
    .dot.unread { background:#E63B7A; }
    .dot.read   { background:#333; }
    .contact-name { font-size:13px; font-weight:600; color:#F5F5F0; }
    .contact-meta { font-size:11px; color:#6B6B6B; margin-top:2px; }
    .contact-msg  { font-size:12px; color:rgba(245,245,240,.5); margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:280px; }
    @media (max-width: 1024px) { .stats { grid-template-columns: repeat(3,1fr); } }
    @media (max-width: 768px)  { .stats { grid-template-columns: repeat(2,1fr); } .grid { grid-template-columns: 1fr; } }
  `],
  template: `
    <h1>TABLEAU DE BORD</h1>
    <p class="subtitle">Vue d'ensemble de vos publications</p>

    <!-- Stats -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Total publications</div>
        <div class="stat-value">{{ svc.totalCount() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ce mois</div>
        <div class="stat-value">{{ svc.thisMonth() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Réalisations</div>
        <div class="stat-value">{{ (svc.countByCategory()['Réalisation'] || 0) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Promotions</div>
        <div class="stat-value">{{ (svc.countByCategory()['Promotion'] || 0) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Demandes reçues</div>
        <div class="stat-value">{{ contactsSvc.total() }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Non lues</div>
        <div class="stat-value">{{ contactsSvc.unreadCount() }}</div>
      </div>
    </div>

    <div class="grid">
      <!-- Récentes -->
      <div class="panel">
        <div class="panel-title">
          Publications récentes
          <a routerLink="/admin/events" class="panel-link">Voir tout →</a>
        </div>
        @if (recent().length === 0) {
          <div class="empty"><span>📭</span>Aucune publication</div>
        } @else {
          @for (ev of recent(); track ev.id) {
            <div class="recent-item">
              <div class="recent-thumb">
                @if (ev.image) { <img [src]="ev.image" [alt]="ev.title" /> }
                @else { 🖨️ }
              </div>
              <div style="flex:1;min-width:0">
                <div class="recent-title">{{ ev.title }}</div>
                <div class="recent-date">{{ ev.date | date:'d MMM yyyy' }}</div>
              </div>
              <span class="badge" [class]="badgeClass(ev.category)">{{ ev.category }}</span>
            </div>
          }
        }
      </div>

      <!-- Demandes récentes -->
      <div class="panel">
        <div class="panel-title">
          Dernières demandes
          <a routerLink="/admin/contacts" class="panel-link">Voir tout →</a>
        </div>
        @if (contactsSvc.contacts().length === 0) {
          <div class="empty"><span>📭</span>Aucune demande</div>
        } @else {
          @for (c of recentContacts(); track c.id) {
            <div class="contact-row">
              <div class="dot" [class.unread]="!c.read" [class.read]="c.read"></div>
              <div style="flex:1;min-width:0">
                <div class="contact-name">{{ c.name }}</div>
                <div class="contact-meta">{{ c.email }} @if (c.service) { · {{ c.service }} }</div>
                <div class="contact-msg">{{ c.message }}</div>
              </div>
            </div>
          }
        }
      </div>

      <!-- Par catégorie -->
      <div class="panel">
        <div class="panel-title">Par catégorie</div>
        @if (svc.totalCount() === 0) {
          <div class="empty"><span>📊</span>Pas de données</div>
        } @else {
          @for (entry of categoryEntries(); track entry.cat) {
            <div class="cat-row">
              <span class="cat-label">{{ entry.cat }}</span>
              <div class="cat-bar-wrap">
                <div class="cat-bar" [style.width.%]="entry.pct"></div>
              </div>
              <span class="cat-count">{{ entry.count }}</span>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  svc         = inject(EventsService);
  contactsSvc = inject(ContactsService);

  recent() {
    return [...this.svc.events()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  categoryEntries() {
    const cats = this.svc.countByCategory();
    const total = this.svc.totalCount();
    return Object.entries(cats).map(([cat, count]) => ({
      cat, count, pct: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  }

  badgeClass(cat: string): string {
    const map: Record<string, string> = {
      'Actualité': 'badge-cyan', 'Réalisation': 'badge-pink',
      'Promotion': 'badge-yellow', 'Nouveau service': 'badge-green',
      'Événement': 'badge-cyan'
    };
    return map[cat] ?? 'badge-cyan';
  }

  recentContacts() {
    return this.contactsSvc.contacts().slice(0, 4);
  }

  ngOnInit(): void {
    if (this.svc.events().length === 0) this.svc.loadAll().subscribe();
    if (this.contactsSvc.contacts().length === 0) this.contactsSvc.loadAll().subscribe();
  }
}
