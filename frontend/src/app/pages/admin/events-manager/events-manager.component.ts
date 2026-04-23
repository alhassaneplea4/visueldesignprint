import {
  Component, OnInit, inject, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventsService } from '../../../core/services/events.service';
import { ToastService }  from '../../../core/services/toast.service';
import { EventModalComponent } from '../../../shared/components/event-modal/event-modal.component';
import { VdpEvent } from '../../../core/models/event.model';

@Component({
  selector: 'vdp-events-manager',
  standalone: true,
  imports: [FormsModule, DatePipe, EventModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .page-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
    h1 { font-family: 'Bebas Neue',sans-serif; font-size: 36px; letter-spacing: 2px; color: #F5F5F0; }
    .subtitle { font-size: 13px; color: #6B6B6B; }
    /* Toolbar */
    .toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
    .search {
      background: #1A1A1A; border: 1px solid rgba(255,255,255,.08);
      color: #F5F5F0; padding: 10px 16px; font-family: 'Barlow',sans-serif;
      font-size: 13px; outline: none; width: 280px; transition: border-color .3s;
    }
    .search:focus { border-color: #00B4D8; }
    .search::placeholder { color: #6B6B6B; }
    .filter-select {
      background: #1A1A1A; border: 1px solid rgba(255,255,255,.08);
      color: #F5F5F0; padding: 10px 14px; font-family: 'Barlow',sans-serif;
      font-size: 13px; outline: none; cursor: pointer;
    }
    .filter-select option { background: #131313; }
    .btn-new { display: flex; align-items: center; gap: 8px; background: #00B4D8; border: none; color: #0D0D0D; padding: 10px 20px; font-family: 'Barlow',sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all .2s; margin-left: auto; }
    .btn-new:hover { background: #F5F5F0; }
    /* Table */
    .table-wrap { background: #1A1A1A; border: 1px solid rgba(255,255,255,.06); overflow: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px 16px; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6B6B6B; border-bottom: 1px solid rgba(255,255,255,.06); background: #161616; white-space: nowrap; }
    td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.04); font-size: 13px; color: #F5F5F0; vertical-align: middle; }
    tr:hover td { background: rgba(255,255,255,.02); }
    tr:last-child td { border-bottom: none; }
    .thumb { width: 52px; height: 40px; background: #131313; border: 1px solid rgba(255,255,255,.06); display: flex; align-items: center; justify-content: center; font-size: 18px; overflow: hidden; flex-shrink: 0; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; }
    .ev-title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
    .ev-excerpt { font-size: 12px; color: #6B6B6B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
    .badge { display: inline-block; padding: 3px 9px; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
    .b-cyan   { background: rgba(0,180,216,.15);  color: #00B4D8; }
    .b-pink   { background: rgba(230,59,122,.15); color: #E63B7A; }
    .b-yellow { background: rgba(244,196,48,.15); color: #F4C430; }
    .b-green  { background: rgba(34,197,94,.15);  color: #22C55E; }
    .actions { display: flex; gap: 6px; }
    .btn-edit, .btn-del {
      padding: 6px 12px; font-family: 'Barlow',sans-serif;
      font-size: 11px; font-weight: 600; letter-spacing: 1px;
      text-transform: uppercase; cursor: pointer; border: none; transition: all .2s;
    }
    .btn-edit { background: rgba(0,180,216,.12); color: #00B4D8; border: 1px solid rgba(0,180,216,.25); }
    .btn-edit:hover { background: rgba(0,180,216,.25); }
    .btn-del  { background: rgba(239,68,68,.12); color: #EF4444; border: 1px solid rgba(239,68,68,.2); }
    .btn-del:hover  { background: rgba(239,68,68,.25); }
    .empty { text-align: center; padding: 80px 20px; }
    .empty span { font-size: 48px; display: block; margin-bottom: 12px; }
    .empty p { font-size: 15px; color: #6B6B6B; }
    /* Confirm dialog */
    .confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 600; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .confirm-box { background: #1A1A1A; border: 1px solid rgba(255,255,255,.08); padding: 36px; max-width: 380px; width: 100%; text-align: center; }
    .confirm-box .icon { font-size: 44px; display: block; margin-bottom: 16px; }
    .confirm-box h4 { font-family: 'Barlow Condensed',sans-serif; font-size: 24px; font-weight: 800; text-transform: uppercase; color: #F5F5F0; margin-bottom: 8px; }
    .confirm-box p { font-size: 13px; color: #6B6B6B; margin-bottom: 24px; }
    .confirm-actions { display: flex; gap: 12px; justify-content: center; }
    .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,.1); color: rgba(245,245,240,.6); padding: 10px 22px; font-family: 'Barlow',sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; }
    .btn-del-confirm { background: #EF4444; border: none; color: white; padding: 10px 28px; font-family: 'Barlow',sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; }
    /* Pagination */
    .pagination { display: flex; align-items: center; gap: 8px; margin-top: 16px; justify-content: flex-end; }
    .pg-btn { width: 34px; height: 34px; background: #1A1A1A; border: 1px solid rgba(255,255,255,.08); color: #F5F5F0; cursor: pointer; font-size: 13px; transition: all .2s; }
    .pg-btn:hover:not(:disabled) { border-color: #00B4D8; color: #00B4D8; }
    .pg-btn:disabled { opacity: .3; cursor: not-allowed; }
    .pg-btn.active { background: #00B4D8; color: #0D0D0D; border-color: #00B4D8; font-weight: 700; }
    .pg-info { font-size: 12px; color: #6B6B6B; }
  `],
  template: `
    <div class="page-head">
      <div>
        <h1>ACTUALITÉS & ÉVÉNEMENTS</h1>
        <p class="subtitle">{{ svc.totalCount() }} publication(s) au total</p>
      </div>
    </div>

    <div class="toolbar">
      <input class="search" type="text" [(ngModel)]="searchQ" placeholder="🔍  Rechercher…" />
      <select class="filter-select" [(ngModel)]="filterCat">
        <option value="">Toutes catégories</option>
        <option>Actualité</option>
        <option>Réalisation</option>
        <option>Promotion</option>
        <option>Nouveau service</option>
        <option>Événement</option>
      </select>
      <button class="btn-new" (click)="openCreate()">+ Nouvelle publication</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Visuel</th>
            <th>Titre & Extrait</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @if (paginatedEvents().length === 0) {
            <tr>
              <td colspan="5">
                <div class="empty">
                  <span>📭</span>
                  <p>Aucune publication trouvée</p>
                </div>
              </td>
            </tr>
          } @else {
            @for (ev of paginatedEvents(); track ev.id) {
              <tr>
                <td>
                  <div class="thumb">
                    @if (ev.image) { <img [src]="ev.image" [alt]="ev.title" /> }
                    @else { 🖨️ }
                  </div>
                </td>
                <td>
                  <div class="ev-title">{{ ev.title }}</div>
                  <div class="ev-excerpt">{{ ev.excerpt }}</div>
                </td>
                <td>
                  <span class="badge" [class]="badgeClass(ev.category)">{{ ev.category }}</span>
                </td>
                <td style="color:#6B6B6B;white-space:nowrap">{{ ev.date | date:'d MMM yyyy' }}</td>
                <td>
                  <div class="actions">
                    <button class="btn-edit" (click)="openEdit(ev)">✏ Modifier</button>
                    <button class="btn-del"  (click)="askDelete(ev)">🗑 Suppr.</button>
                  </div>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    @if (totalPages() > 1) {
      <div class="pagination">
        <span class="pg-info">{{ filteredEvents().length }} résultat(s)</span>
        <button class="pg-btn" [disabled]="page() === 1" (click)="setPage(page()-1)">‹</button>
        @for (p of pageNumbers(); track p) {
          <button class="pg-btn" [class.active]="p === page()" (click)="setPage(p)">{{ p }}</button>
        }
        <button class="pg-btn" [disabled]="page() === totalPages()" (click)="setPage(page()+1)">›</button>
      </div>
    }

    <!-- Modal création / édition -->
    @if (modalOpen()) {
      <vdp-event-modal
        [editEvent]="editingEvent()"
        (closed)="closeModal()"
        (saved)="closeModal()"
      />
    }

    <!-- Confirm suppression -->
    @if (confirmOpen()) {
      <div class="confirm-overlay">
        <div class="confirm-box">
          <span class="icon">🗑️</span>
          <h4>Supprimer ?</h4>
          <p>Cette action est irréversible. La publication sera retirée du site.</p>
          <div class="confirm-actions">
            <button class="btn-cancel" (click)="closeConfirm()">Annuler</button>
            <button class="btn-del-confirm" (click)="doDelete()">Supprimer</button>
          </div>
        </div>
      </div>
    }
  `
})
export class EventsManagerComponent implements OnInit {
  svc   = inject(EventsService);
  toast = inject(ToastService);

  searchQ   = '';
  filterCat = '';

  page        = signal(1);
  perPage     = 10;
  modalOpen   = signal(false);
  confirmOpen = signal(false);
  editingEvent  = signal<VdpEvent | null>(null);
  deletingEvent = signal<VdpEvent | null>(null);

  filteredEvents = computed(() => {
    const q   = this.searchQ.toLowerCase();
    const cat = this.filterCat;
    return this.svc.events()
      .filter(e =>
        (!q   || e.title.toLowerCase().includes(q) || e.excerpt.toLowerCase().includes(q)) &&
        (!cat || e.category === cat)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredEvents().length / this.perPage)));

  paginatedEvents = computed(() => {
    const start = (this.page() - 1) * this.perPage;
    return this.filteredEvents().slice(start, start + this.perPage);
  });

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  setPage(p: number): void {
    this.page.set(Math.max(1, Math.min(p, this.totalPages())));
  }

  openCreate(): void { this.editingEvent.set(null); this.modalOpen.set(true); }
  openEdit(ev: VdpEvent): void { this.editingEvent.set(ev); this.modalOpen.set(true); }
  closeModal(): void { this.modalOpen.set(false); this.editingEvent.set(null); }

  askDelete(ev: VdpEvent): void { this.deletingEvent.set(ev); this.confirmOpen.set(true); }
  closeConfirm(): void { this.confirmOpen.set(false); this.deletingEvent.set(null); }

  doDelete(): void {
    const ev = this.deletingEvent();
    if (!ev) return;
    this.svc.delete(ev.id).subscribe({
      next: () => { this.toast.success('🗑️ Publication supprimée'); this.closeConfirm(); },
      error: (err) => { this.toast.error(err.error?.message || 'Erreur de suppression'); this.closeConfirm(); }
    });
  }

  badgeClass(cat: string): string {
    const map: Record<string, string> = {
      'Actualité': 'b-cyan', 'Réalisation': 'b-pink',
      'Promotion': 'b-yellow', 'Nouveau service': 'b-green', 'Événement': 'b-cyan'
    };
    return map[cat] ?? 'b-cyan';
  }

  ngOnInit(): void {
    if (this.svc.events().length === 0) {
      this.svc.loadAll().subscribe();
    }
  }
}
