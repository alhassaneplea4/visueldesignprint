import {
  Component, OnInit, inject, signal, computed, ChangeDetectionStrategy
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
    /* Toolbar */
    .toolbar { display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
    .filter-tabs { display:flex; gap:4px; }
    .tab {
      padding:7px 16px; font-size:11px; font-weight:700; letter-spacing:1.5px;
      text-transform:uppercase; cursor:pointer; border:1px solid rgba(255,255,255,.08);
      background:transparent; color:rgba(245,245,240,.5); transition:all .2s;
    }
    .tab.active { background:#00B4D8; color:#0D0D0D; border-color:#00B4D8; }
    .badge-count { background:#E63B7A; color:#fff; font-size:10px; font-weight:700;
      padding:1px 6px; margin-left:6px; vertical-align:middle; }
    /* Stats row */
    .stats-row { display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap; }
    .mini-stat { background:#1A1A1A; border:1px solid rgba(255,255,255,.06); padding:16px 20px;
      border-top:3px solid var(--c,#00B4D8); min-width:120px; }
    .mini-stat:nth-child(2) { --c:#E63B7A; }
    .mini-stat:nth-child(3) { --c:#22C55E; }
    .mini-val { font-family:'Bebas Neue',sans-serif; font-size:36px; color:var(--c,#00B4D8); line-height:1; }
    .mini-lbl { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#6B6B6B; margin-top:4px; }
    /* List */
    .contact-list { display:flex; flex-direction:column; gap:2px; }
    .contact-card {
      background:#1A1A1A; border:1px solid rgba(255,255,255,.06);
      border-left:3px solid transparent; transition:border-color .2s;
    }
    .contact-card.unread { border-left-color:#E63B7A; }
    .contact-card.read   { border-left-color:rgba(255,255,255,.08); }
    .card-header {
      display:grid; grid-template-columns:auto 1fr auto auto; align-items:center;
      gap:16px; padding:16px 20px; cursor:pointer;
    }
    .status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .status-dot.unread { background:#E63B7A; box-shadow:0 0 6px #E63B7A; }
    .status-dot.read   { background:#333; }
    .card-main { min-width:0; }
    .card-name  { font-size:14px; font-weight:700; color:#F5F5F0; }
    .card-meta  { font-size:12px; color:#6B6B6B; margin-top:2px; }
    .card-meta span { margin-right:12px; }
    .card-service { font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase;
      background:rgba(0,180,216,.12); color:#00B4D8; padding:3px 8px; white-space:nowrap; }
    .card-date  { font-size:11px; color:#6B6B6B; white-space:nowrap; }
    /* Expanded body */
    .card-body { padding:0 20px 20px 48px; border-top:1px solid rgba(255,255,255,.04); }
    .card-body.hidden { display:none; }
    .msg-label { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#6B6B6B; margin:16px 0 8px; }
    .msg-text  { font-size:14px; line-height:1.75; color:rgba(245,245,240,.8); white-space:pre-wrap; }
    .card-actions { display:flex; gap:8px; margin-top:16px; }
    .btn-sm {
      padding:6px 14px; font-size:11px; font-weight:700; letter-spacing:1.5px;
      text-transform:uppercase; cursor:pointer; border:1px solid rgba(255,255,255,.1);
      background:transparent; color:rgba(245,245,240,.6); transition:all .2s;
    }
    .btn-sm:hover { color:#F5F5F0; border-color:rgba(255,255,255,.25); }
    .btn-sm.read-toggle { border-color:rgba(0,180,216,.3); color:#00B4D8; }
    .btn-sm.read-toggle:hover { background:rgba(0,180,216,.1); }
    .btn-sm.danger { border-color:rgba(239,68,68,.3); color:#EF4444; }
    .btn-sm.danger:hover { background:rgba(239,68,68,.1); }
    /* Empty */
    .empty { text-align:center; padding:60px 20px; color:#6B6B6B; }
    .empty span { display:block; font-size:40px; margin-bottom:12px; }
    /* Loading */
    .skeleton { height:72px; background:#1A1A1A; border:1px solid rgba(255,255,255,.06); animation:pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
    /* Confirm overlay */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:500; display:flex; align-items:center; justify-content:center; }
    .confirm-box { background:#1A1A1A; border:1px solid rgba(255,255,255,.1); padding:32px; max-width:380px; width:90%; }
    .confirm-box h3 { font-family:'Bebas Neue',sans-serif; font-size:24px; color:#F5F5F0; margin-bottom:10px; }
    .confirm-box p  { font-size:14px; color:#6B6B6B; margin-bottom:24px; }
    .confirm-actions { display:flex; gap:12px; }
    .btn-cancel { padding:10px 20px; background:transparent; border:1px solid rgba(255,255,255,.1); color:rgba(245,245,240,.6); font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; }
    .btn-delete { padding:10px 20px; background:#EF4444; border:none; color:#fff; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; }
  `],
  template: `
    <h1>DEMANDES DE DEVIS</h1>
    <p class="subtitle">Formulaires de contact reçus depuis le site</p>

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
      <div class="filter-tabs">
        <button class="tab" [class.active]="filter() === 'all'"    (click)="filter.set('all')">
          Toutes <span class="badge-count">{{ svc.total() }}</span>
        </button>
        <button class="tab" [class.active]="filter() === 'unread'" (click)="filter.set('unread')">
          Non lues <span class="badge-count">{{ svc.unreadCount() }}</span>
        </button>
        <button class="tab" [class.active]="filter() === 'read'"   (click)="filter.set('read')">
          Lues
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
                <div class="card-name">{{ c.name }}</div>
                <div class="card-meta">
                  <span>✉ {{ c.email }}</span>
                  @if (c.phone) { <span>📞 {{ c.phone }}</span> }
                </div>
              </div>
              @if (c.service) {
                <span class="card-service">{{ c.service }}</span>
              }
              <span class="card-date">{{ c.createdAt | date:'d MMM yyyy, HH:mm' }}</span>
            </div>

            <div class="card-body" [class.hidden]="expandedId() !== c.id">
              <div class="msg-label">Message</div>
              <div class="msg-text">{{ c.message }}</div>
              <div class="card-actions">
                <button class="btn-sm read-toggle" (click)="toggleRead(c)">
                  {{ c.read ? '● Marquer non lu' : '✓ Marquer comme lu' }}
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
          <h3>CONFIRMER</h3>
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
export class ContactsManagerComponent implements OnInit {
  svc   = inject(ContactsService);
  toast = inject(ToastService);

  filter     = signal<Filter>('all');
  expandedId = signal<string | null>(null);
  confirmId  = signal<string | null>(null);

  filtered = computed(() => {
    const f = this.filter();
    const list = this.svc.contacts();
    if (f === 'unread') return list.filter(c => !c.read);
    if (f === 'read')   return list.filter(c =>  c.read);
    return list;
  });

  toggleExpand(id: string): void {
    this.expandedId.update(cur => cur === id ? null : id);
    const contact = this.svc.contacts().find(c => c.id === id);
    if (contact && !contact.read) this.markRead(contact, true);
  }

  toggleRead(c: Contact): void  { this.markRead(c, !c.read); }

  private markRead(c: Contact, read: boolean): void {
    this.svc.markRead(c.id, read).subscribe({
      error: () => this.toast.error('Erreur lors de la mise à jour.')
    });
  }

  openConfirm(id: string):  void { this.confirmId.set(id); }
  cancelConfirm():          void { this.confirmId.set(null); }

  doDelete(): void {
    const id = this.confirmId();
    if (!id) return;
    this.svc.delete(id).subscribe({
      next:  () => { this.toast.success('Demande supprimée.'); this.confirmId.set(null); if (this.expandedId() === id) this.expandedId.set(null); },
      error: () => this.toast.error('Erreur lors de la suppression.')
    });
  }

  ngOnInit(): void { this.svc.loadAll().subscribe(); }
}
