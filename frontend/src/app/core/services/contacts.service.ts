import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact, ContactPayload } from '../models/contact.model';
import { ActivityLogService } from './activity-log.service';

const STORAGE_KEY = 'vdp_contacts';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private logSvc = inject(ActivityLogService);

  contacts    = signal<Contact[]>([]);
  loading     = signal(false);
  error       = signal<string | null>(null);

  unreadCount = computed(() => this.contacts().filter(c => !c.read).length);
  total       = computed(() => this.contacts().length);

  private _load(): Contact[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Contact[]) : [];
    } catch {
      return [];
    }
  }

  private _save(contacts: Contact[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch { /* quota localStorage dépassé */ }
  }

  // ── Soumission publique ───────────────────────────────────
  submit(payload: ContactPayload): Observable<{ success: boolean; data: Contact }> {
    const contact: Contact = {
      ...payload,
      id       : crypto.randomUUID(),
      read     : false,
      createdAt: new Date().toISOString(),
    };
    this._save([contact, ...this._load()]);
    this.contacts.update(list => [contact, ...list]);
    this.logSvc.addLog('SUBMIT_CONTACT', `Nouvelle demande de devis : ${contact.name}`, 'public');
    return of({ success: true, data: contact });
  }

  // ── Chargement admin ──────────────────────────────────────
  loadAll(): Observable<{ success: boolean; data: Contact[] }> {
    this.loading.set(true);
    const data = this._load();
    this.contacts.set(data);
    this.loading.set(false);
    return of({ success: true, data });
  }

  // ── Marquer lu/non lu ─────────────────────────────────────
  markRead(id: string, read: boolean): Observable<{ success: boolean; data: Contact }> {
    const list  = this._load();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return of({ success: false, data: {} as Contact });
    const updated = { ...list[index], read };
    list[index] = updated;
    this._save(list);
    this.contacts.update(list => list.map(c => c.id === id ? updated : c));
    this.logSvc.addLog(
      'UPDATE_CONTACT',
      `Contact ${read ? 'marqué lu' : 'marqué non lu'} : ${updated.name}`
    );
    return of({ success: true, data: updated });
  }

  // ── Suppression ───────────────────────────────────────────
  delete(id: string): Observable<{ success: boolean }> {
    const list   = this._load();
    const target = list.find(c => c.id === id);
    this._save(list.filter(c => c.id !== id));
    this.contacts.update(list => list.filter(c => c.id !== id));
    if (target) this.logSvc.addLog('DELETE_CONTACT', `Contact supprimé : ${target.name}`);
    return of({ success: true });
  }
}
