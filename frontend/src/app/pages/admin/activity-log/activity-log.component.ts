import {
  Component, OnInit, inject, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivityLogService } from '../../../core/services/activity-log.service';
import { ToastService }       from '../../../core/services/toast.service';
import { ActivityLog, LogAction } from '../../../core/models/activity-log.model';

type Category = 'all' | 'auth' | 'events' | 'contacts' | 'system';

const ACTION_META: Record<LogAction, { icon: string; color: string; category: Category }> = {
  LOGIN:           { icon: '🔐', color: '#00B4D8', category: 'auth'     },
  CREATE_EVENT:    { icon: '✅', color: '#22C55E', category: 'events'   },
  UPDATE_EVENT:    { icon: '✏️', color: '#F4C430', category: 'events'   },
  DELETE_EVENT:    { icon: '🗑️', color: '#EF4444', category: 'events'   },
  UPLOAD_IMAGE:    { icon: '🖼️', color: '#00B4D8', category: 'events'   },
  SUBMIT_CONTACT:  { icon: '📩', color: '#E63B7A', category: 'contacts' },
  UPDATE_CONTACT:  { icon: '📬', color: '#F4C430', category: 'contacts' },
  DELETE_CONTACT:  { icon: '🗑️', color: '#EF4444', category: 'contacts' },
  CLEAR_LOGS:      { icon: '🧹', color: '#6B6B6B', category: 'system'   }
};

@Component({
  selector: 'vdp-activity-log',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    h1 { font-family:'Bebas Neue',sans-serif; font-size:36px; letter-spacing:2px; color:#F5F5F0; margin-bottom:6px; }
    .subtitle { font-size:13px; color:#6B6B6B; margin-bottom:28px; }
    /* Toolbar */
    .toolbar { display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap; justify-content:space-between; }
    .filter-tabs { display:flex; gap:4px; flex-wrap:wrap; }
    .tab { padding:7px 14px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; border:1px solid rgba(255,255,255,.08); background:transparent; color:rgba(245,245,240,.5); transition:all .2s; }
    .tab.active { background:#00B4D8; color:#0D0D0D; border-color:#00B4D8; }
    .btn-clear { padding:8px 18px; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; border:1px solid rgba(239,68,68,.3); background:transparent; color:#EF4444; transition:all .2s; }
    .btn-clear:hover { background:rgba(239,68,68,.1); }
    /* Stats */
    .stats-row { display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap; }
    .mini-stat { background:#1A1A1A; border:1px solid rgba(255,255,255,.06); padding:14px 18px; border-top:3px solid var(--c,#00B4D8); min-width:110px; }
    .mini-stat:nth-child(2){--c:#22C55E} .mini-stat:nth-child(3){--c:#E63B7A} .mini-stat:nth-child(4){--c:#EF4444}
    .mini-val { font-family:'Bebas Neue',sans-serif; font-size:32px; color:var(--c,#00B4D8); line-height:1; }
    .mini-lbl { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#6B6B6B; margin-top:3px; }
    /* Timeline */
    .timeline { display:flex; flex-direction:column; gap:2px; }
    .log-entry {
      display:grid; grid-template-columns:36px 1fr auto; align-items:center;
      gap:14px; padding:14px 20px; background:#1A1A1A;
      border:1px solid rgba(255,255,255,.04); border-left:3px solid var(--entry-color,#333);
      transition:background .2s;
    }
    .log-entry:hover { background:#222; }
    .log-icon { font-size:18px; text-align:center; line-height:1; }
    .log-body { min-width:0; }
    .log-label { font-size:13px; font-weight:600; color:#F5F5F0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .log-meta  { font-size:11px; color:#6B6B6B; margin-top:3px; }
    .log-meta span { margin-right:10px; }
    .log-date  { font-size:11px; color:#6B6B6B; white-space:nowrap; }
    /* Empty & loading */
    .empty { text-align:center; padding:60px 20px; color:#6B6B6B; }
    .empty span { display:block; font-size:40px; margin-bottom:12px; }
    .skeleton { height:60px; background:#1A1A1A; border:1px solid rgba(255,255,255,.06); animation:pulse 1.5s ease-in-out infinite; margin-bottom:2px; }
    @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
    /* Confirm */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:500; display:flex; align-items:center; justify-content:center; }
    .confirm-box { background:#1A1A1A; border:1px solid rgba(255,255,255,.1); padding:32px; max-width:380px; width:90%; }
    .confirm-box h3 { font-family:'Bebas Neue',sans-serif; font-size:24px; color:#F5F5F0; margin-bottom:10px; }
    .confirm-box p  { font-size:14px; color:#6B6B6B; margin-bottom:24px; }
    .confirm-actions { display:flex; gap:12px; }
    .btn-cancel { padding:10px 20px; background:transparent; border:1px solid rgba(255,255,255,.1); color:rgba(245,245,240,.6); font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; }
    .btn-delete { padding:10px 20px; background:#EF4444; border:none; color:#fff; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; }
  `],
  template: `
    <h1>JOURNAL D'ACTIVITÉS</h1>
    <p class="subtitle">Historique de toutes les actions effectuées sur l'administration</p>

    <div class="stats-row">
      <div class="mini-stat">
        <div class="mini-val">{{ svc.total() }}</div>
        <div class="mini-lbl">Total</div>
      </div>
      <div class="mini-stat">
        <div class="mini-val">{{ countBy('events') }}</div>
        <div class="mini-lbl">Publications</div>
      </div>
      <div class="mini-stat">
        <div class="mini-val">{{ countBy('contacts') }}</div>
        <div class="mini-lbl">Contacts</div>
      </div>
      <div class="mini-stat">
        <div class="mini-val">{{ countBy('auth') }}</div>
        <div class="mini-lbl">Connexions</div>
      </div>
    </div>

    <div class="toolbar">
      <div class="filter-tabs">
        <button class="tab" [class.active]="filter() === 'all'"      (click)="filter.set('all')">Tous</button>
        <button class="tab" [class.active]="filter() === 'events'"   (click)="filter.set('events')">Publications</button>
        <button class="tab" [class.active]="filter() === 'contacts'" (click)="filter.set('contacts')">Contacts</button>
        <button class="tab" [class.active]="filter() === 'auth'"     (click)="filter.set('auth')">Connexions</button>
        <button class="tab" [class.active]="filter() === 'system'"   (click)="filter.set('system')">Système</button>
      </div>
      <button class="btn-clear" (click)="confirmClear.set(true)">🧹 Effacer le journal</button>
    </div>

    @if (svc.loading()) {
      @for (i of [1,2,3,4,5]; track i) { <div class="skeleton"></div> }
    } @else if (filtered().length === 0) {
      <div class="empty">
        <span>📋</span>Aucune activité enregistrée
      </div>
    } @else {
      <div class="timeline">
        @for (entry of filtered(); track entry.id) {
          <div class="log-entry" [style.--entry-color]="meta(entry.action).color">
            <div class="log-icon">{{ meta(entry.action).icon }}</div>
            <div class="log-body">
              <div class="log-label">{{ entry.label }}</div>
              <div class="log-meta">
                <span>👤 {{ entry.user }}</span>
                <span>🏷 {{ entry.action }}</span>
              </div>
            </div>
            <div class="log-date">{{ entry.createdAt | date:'d MMM yyyy, HH:mm' }}</div>
          </div>
        }
      </div>
    }

    @if (confirmClear()) {
      <div class="overlay" (click)="confirmClear.set(false)">
        <div class="confirm-box" (click)="$event.stopPropagation()">
          <h3>EFFACER LE JOURNAL</h3>
          <p>Cette action supprimera définitivement tout l'historique d'activités. Continuer ?</p>
          <div class="confirm-actions">
            <button class="btn-cancel" (click)="confirmClear.set(false)">Annuler</button>
            <button class="btn-delete" (click)="doClear()">Effacer tout</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ActivityLogComponent implements OnInit {
  svc         = inject(ActivityLogService);
  toast       = inject(ToastService);
  filter      = signal<Category>('all');
  confirmClear = signal(false);

  filtered = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.svc.logs();
    return this.svc.logs().filter(l => ACTION_META[l.action]?.category === f);
  });

  meta(action: LogAction) { return ACTION_META[action] ?? { icon: '•', color: '#6B6B6B', category: 'system' }; }

  countBy(cat: Category): number {
    return this.svc.logs().filter(l => ACTION_META[l.action]?.category === cat).length;
  }

  doClear(): void {
    this.svc.clearAll().subscribe({
      next:  () => { this.toast.success('Journal effacé.'); this.confirmClear.set(false); },
      error: () =>   this.toast.error('Erreur lors de l\'effacement.')
    });
  }

  ngOnInit(): void { this.svc.loadAll().subscribe(); }
}
