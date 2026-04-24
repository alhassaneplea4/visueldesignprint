import {
  Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ContactsService } from '../../../core/services/contacts.service';
import { ToastService }    from '../../../core/services/toast.service';
import { Contact }         from '../../../core/models/contact.model';

type Filter = 'all' | 'unread' | 'read';

@Component({
  selector: 'vdp-contacts-manager',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    h1 { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:2px; color:#F5F5F0; margin-bottom:6px; }
    .subtitle { font-size:13px; color:#6B6B6B; margin-bottom:28px; }

    /* Stats */
    .stats-row { display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap; }
    .mini-stat { background:#1A1A1A; border:1px solid rgba(255,255,255,.06); padding:16px 20px; border-top:3px solid var(--c,#00B4D8); min-width:120px; }
    .mini-stat:nth-child(2){--c:#E63B7A} .mini-stat:nth-child(3){--c:#22C55E}
    .mini-val { font-family:'Bebas Neue',sans-serif; font-size:36px; color:var(--c,#00B4D8); line-height:1; }
    .mini-lbl { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#6B6B6B; margin-top:4px; }

    /* Toolbar */
    .toolbar { display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap; justify-content:space-between; }
    .toolbar-left  { display:flex; gap:4px; flex-wrap:wrap; }
    .toolbar-right { display:flex; align-items:center; gap:14px; }
    .tab { padding:7px 16px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; border:1px solid rgba(255,255,255,.08); background:transparent; color:rgba(245,245,240,.5); transition:all .2s; }
    .tab.active { background:#00B4D8; color:#0D0D0D; border-color:#00B4D8; }
    .badge-count { background:#E63B7A; color:#fff; font-size:10px; font-weight:700; padding:1px 6px; margin-left:6px; }
    .refresh-info { font-size:11px; color:#6B6B6B; white-space:nowrap; }
    .btn-refresh { padding:7px 14px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; border:1px solid rgba(255,255,255,.1); background:transparent; color:rgba(245,245,240,.5); transition:all .2s; display:flex; align-items:center; gap:6px; }
    .btn-refresh:hover { border-color:#00B4D8; color:#00B4D8; }
    .btn-refresh svg { display:block; }

    /* List */
    .contact-list { display:flex; flex-direction:column; gap:2px; }
    .contact-card { background:#1A1A1A; border:1px solid rgba(255,255,255,.06); border-left:3px solid transparent; transition:border-color .2s; }
    .contact-card.unread { border-left-color:#E63B7A; }
    .contact-card.read   { border-left-color:rgba(255,255,255,.08); }

    .card-header { display:grid; grid-template-columns:auto 1fr auto auto auto; align-items:center; gap:14px; padding:16px 20px; cursor:pointer; }
    .status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .status-dot.unread { background:#E63B7A; box-shadow:0 0 6px #E63B7A; animation:pulse-dot 2s ease-in-out infinite; }
    .status-dot.read   { background:#333; }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }

    .card-main { min-width:0; }
    .card-name { font-size:14px; font-weight:700; color:#F5F5F0; display:flex; align-items:center; gap:8px; }
    .badge-new { background:#E63B7A; color:#fff; font-size:9px; font-weight:700; letter-spacing:1px; padding:1px 7px; text-transform:uppercase; flex-shrink:0; }
    .card-meta { font-size:12px; color:#6B6B6B; margin-top:3px; display:flex; gap:12px; flex-wrap:wrap; }
    .card-service { font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; background:rgba(0,180,216,.12); color:#00B4D8; padding:3px 8px; white-space:nowrap; flex-shrink:0; }
    .card-time-ago { font-size:11px; color:#6B6B6B; white-space:nowrap; flex-shrink:0; }
    .card-date     { font-size:11px; color:rgba(107,107,107,.5); white-space:nowrap; flex-shrink:0; }

    /* Expanded body */
    .card-body { padding:0 20px 20px 46px; border-top:1px solid rgba(255,255,255,.04); }
    .card-body.hidden { display:none; }
    .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0; }
    .detail-item label { display:block; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#6B6B6B; margin-bottom:4px; }
    .detail-item a, .detail-item span { font-size:13px; color:#F5F5F0; text-decoration:none; }
    .detail-item a:hover { color:#00B4D8; text-decoration:underline; }
    .msg-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#6B6B6B; margin-bottom:8px; }
    .msg-text  { font-size:14px; line-height:1.75; color:rgba(245,245,240,.8); white-space:pre-wrap; background:rgba(255,255,255,.02); padding:14px 16px; border-left:2px solid rgba(0,180,216,.3); }

    /* Actions */
    .card-actions { display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; }
    .btn-sm { padding:7px 14px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; border:1px solid rgba(255,255,255,.1); background:transparent; color:rgba(245,245,240,.6); transition:all .2s; display:inline-flex; align-items:center; gap:6px; text-decoration:none; }
    .btn-sm:hover { color:#F5F5F0; border-color:rgba(255,255,255,.3); }
    .btn-sm svg { display:block; }
    .btn-sm.reply       { border-color:rgba(0,180,216,.35); color:#00B4D8; }
    .btn-sm.reply:hover { background:rgba(0,180,216,.1); }
    .btn-sm.read-toggle       { border-color:rgba(0,180,216,.2); color:rgba(0,180,216,.7); }
    .btn-sm.read-toggle:hover { background:rgba(0,180,216,.08); color:#00B4D8; }
    .btn-sm.danger       { border-color:rgba(239,68,68,.3); color:#EF4444; }
    .btn-sm.danger:hover { background:rgba(239,68,68,.1); }

    /* Empty & skeleton */
    .empty { text-align:center; padding:60px 20px; color:#6B6B6B; }
    .empty span { display:block; font-size:40px; margin-bottom:12px; }
    .skeleton { height:72px; background:#1A1A1A; border:1px solid rgba(255,255,255,.06); animation:pulse 1.5s ease-in-out infinite; margin-bottom:2px; }
    @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }

    /* Confirm overlay */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:500; display:flex; align-items:center; justify-content:center; }
    .confirm-box { background:#1A1A1A; border:1px solid rgba(255,255,255,.1); padding:32px; max-width:380px; width:90%; }
    .confirm-box h3 { font-family:'Bebas Neue',sans-serif; font-size:24px; color:#F5F5F0; margin-bottom:10px; }
    .confirm-box p  { font-size:14px; color:#6B6B6B; margin-bottom:24px; }
    .confirm-actions { display:flex; gap:12px; }
    .btn-cancel { padding:10px 20px; background:transparent; border:1px solid rgba(255,255,255,.1); color:rgba(245,245,240,.6); font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; }
    .btn-delete { padding:10px 20px; background:#EF4444; border:none; color:#fff; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; }
  `],
  template: `
    <h1>DEMANDES DE DEVIS</h1>
    <p class="subtitle">Formulaires reçus depuis le site — actualisation automatique toutes les 30 s</p>

    <div class="stats-row">
      <div class="mini-stat">
        <div class="mini-val">{{ svc.total() }}</div>
        <div class="mini-lbl">Total reçues</div>
      </div>
      <div class="mini-stat">
        <div class="mini-val">{{ svc.unreadCount() }}</div>
        <div class="mini-lbl">Non lues</div>
      </div>
      <div class="mini-stat">
        <div class="mini-val">{{ svc.total() - svc.unreadCount() }}</div>
        <div class="mini-lbl">Traitées</div>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <button class="tab" [class.active]="filter() === 'all'"    (click)="filter.set('all')">
          Toutes <span class="badge-count">{{ svc.total() }}</span>
        </button>
        <button class="tab" [class.active]="filter() === 'unread'" (click)="filter.set('unread')">
          Non lues <span class="badge-count">{{ svc.unreadCount() }}</span>
        </button>
        <button class="tab" [class.active]="filter() === 'read'"   (click)="filter.set('read')">Lues</button>
      </div>
      <div class="toolbar-right">
        @if (lastRefresh()) {
          <span class="refresh-info">Actualisé {{ timeAgo(lastRefresh()!.toISOString()) }}</span>
        }
        <button class="btn-refresh" (click)="refresh()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
          Actualiser
        </button>
      </div>
    </div>

    @if (svc.loading()) {
      <div class="contact-list">
        @for (i of [1,2,3]; track i) { <div class="skeleton"></div> }
      </div>
    } @else if (filtered().length === 0) {
      <div class="empty">
        <span>📭</span>
        @if (filter() === 'unread') { Aucune demande non lue }
        @else if (filter() === 'read') { Aucune demande traitée }
        @else { Aucune demande reçue pour l'instant }
      </div>
    } @else {
      <div class="contact-list">
        @for (c of filtered(); track c.id) {
          <div class="contact-card" [class.unread]="!c.read" [class.read]="c.read">
            <div class="card-header" (click)="toggleExpand(c.id)">
              <div class="status-dot" [class.unread]="!c.read" [class.read]="c.read"></div>
              <div class="card-main">
                <div class="card-name">
                  {{ c.name }}
                  @if (isNew(c.createdAt)) { <span class="badge-new">Nouveau</span> }
                </div>
                <div class="card-meta">
                  <span>{{ c.email }}</span>
                  @if (c.phone) { <span>{{ c.phone }}</span> }
                </div>
              </div>
              @if (c.service) { <span class="card-service">{{ c.service }}</span> }
              <span class="card-time-ago">{{ timeAgo(c.createdAt) }}</span>
              <span class="card-date">{{ c.createdAt | date:'d MMM, HH:mm' }}</span>
            </div>

            <div class="card-body" [class.hidden]="expandedId() !== c.id">
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Email</label>
                  <a [href]="'mailto:' + c.email">{{ c.email }}</a>
                </div>
                @if (c.phone) {
                  <div class="detail-item">
                    <label>Téléphone</label>
                    <a [href]="'tel:' + c.phone">{{ c.phone }}</a>
                  </div>
                }
                @if (c.service) {
                  <div class="detail-item">
                    <label>Service demandé</label>
                    <span>{{ c.service }}</span>
                  </div>
                }
                <div class="detail-item">
                  <label>Reçu le</label>
                  <span>{{ c.createdAt | date:'d MMMM yyyy à HH:mm' }}</span>
                </div>
              </div>
              <div class="msg-label">Message du client</div>
              <div class="msg-text">{{ c.message }}</div>
              <div class="card-actions">
                <a [href]="replyLink(c)" class="btn-sm reply">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Répondre par email
                </a>
                <button class="btn-sm read-toggle" (click)="toggleRead(c)">
                  {{ c.read ? 'Marquer non lu' : 'Marquer comme lu' }}
                </button>
                <button class="btn-sm danger" (click)="openConfirm(c.id)">Supprimer</button>
              </div>
            </div>
          </div>
        }
      </div>
    }

    @if (confirmId()) {
      <div class="overlay" (click)="cancelConfirm()">
        <div class="confirm-box" (click)="$event.stopPropagation()">
          <h3>CONFIRMER LA SUPPRESSION</h3>
          <p>Supprimer définitivement cette demande ? Cette action est irréversible.</p>
          <div class="confirm-actions">
            <button class="btn-cancel" (click)="cancelConfirm()">Annuler</button>
            <button class="btn-delete" (click)="doDelete()">Supprimer</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ContactsManagerComponent implements OnInit, OnDestroy {
  svc   = inject(ContactsService);
  toast = inject(ToastService);

  filter      = signal<Filter>('all');
  expandedId  = signal<string | null>(null);
  confirmId   = signal<string | null>(null);
  lastRefresh = signal<Date | null>(null);

  private pollInterval: ReturnType<typeof setInterval> | null = null;

  filtered = computed(() => {
    const f    = this.filter();
    const list = this.svc.contacts();
    if (f === 'unread') return list.filter(c => !c.read);
    if (f === 'read')   return list.filter(c =>  c.read);
    return list;
  });

  ngOnInit(): void {
    this.refresh();
    this.pollInterval = setInterval(() => this.refresh(), 30_000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  refresh(): void {
    this.svc.loadAll().subscribe({
      next: () => this.lastRefresh.set(new Date())
    });
  }

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min  = Math.floor(diff / 60_000);
    if (min < 1)  return 'À l\'instant';
    if (min < 60) return `Il y a ${min} min`;
    const h = Math.floor(min / 60);
    if (h  < 24)  return `Il y a ${h}h`;
    return `Il y a ${Math.floor(h / 24)}j`;
  }

  isNew(dateStr: string): boolean {
    return Date.now() - new Date(dateStr).getTime() < 5 * 60_000;
  }

  replyLink(c: Contact): string {
    const subject = encodeURIComponent(
      `RE: Votre demande de devis – ${c.service || 'Visuel Design Print'}`
    );
    const body = encodeURIComponent(
      `Bonjour ${c.name},\n\nMerci pour votre demande de devis concernant : ${c.service || 'nos services'}.\n\nNous avons bien reçu votre message et nous vous recontacterons dans les plus brefs délais.\n\nCordialement,\nL'équipe Visuel Design Print\n+224 625 72 72 37`
    );
    return `mailto:${c.email}?subject=${subject}&body=${body}`;
  }

  toggleExpand(id: string): void {
    this.expandedId.update(cur => cur === id ? null : id);
    const contact = this.svc.contacts().find(c => c.id === id);
    if (contact && !contact.read) this.markRead(contact, true);
  }

  toggleRead(c: Contact): void { this.markRead(c, !c.read); }

  private markRead(c: Contact, read: boolean): void {
    this.svc.markRead(c.id, read).subscribe({
      error: () => this.toast.error('Erreur lors de la mise à jour.')
    });
  }

  openConfirm(id: string): void { this.confirmId.set(id); }
  cancelConfirm():         void { this.confirmId.set(null); }

  doDelete(): void {
    const id = this.confirmId();
    if (!id) return;
    this.svc.delete(id).subscribe({
      next: () => {
        this.toast.success('Demande supprimée.');
        this.confirmId.set(null);
        if (this.expandedId() === id) this.expandedId.set(null);
      },
      error: () => this.toast.error('Erreur lors de la suppression.')
    });
  }
}
