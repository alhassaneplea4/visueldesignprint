import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  VdpEvent, EventPayload,
  EventsResponse, EventResponse
} from '../models/event.model';
import { ActivityLogService } from './activity-log.service';

const STORAGE_KEY = 'vdp_events';

const SEED_EVENTS: VdpEvent[] = [
  {
    id       : 'seed-1',
    title    : 'Bienvenue chez Visuel Design Print',
    excerpt  : 'Votre imprimerie grand format à Conakry. Bâches, banderoles, kakémonos, covering véhicule — nous donnons vie à vos projets visuels avec une qualité irréprochable.',
    category : 'Actualité',
    date     : new Date().toISOString().split('T')[0],
    image    : '',
    createdAt: new Date().toISOString(),
  },
  {
    id       : 'seed-2',
    title    : 'Nouveau service : Enseignes lumineuses LED',
    excerpt  : 'Offrez à votre commerce une visibilité percutante, de jour comme de nuit. Lettres découpées rétroéclairées, caissons LED et néons personnalisés disponibles.',
    category : 'Nouveau service',
    date     : new Date(Date.now() - 7 * 86_400_000).toISOString().split('T')[0],
    image    : '',
    createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
  }
];

@Injectable({ providedIn: 'root' })
export class EventsService {
  private logSvc = inject(ActivityLogService);

  readonly events   = signal<VdpEvent[]>([]);
  readonly loading  = signal(false);
  readonly error    = signal<string | null>(null);

  readonly totalCount      = computed(() => this.events().length);
  readonly thisMonth       = computed(() => {
    const now = new Date();
    return this.events().filter(e => {
      const d = new Date(e.date);
      return d.getMonth()    === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    }).length;
  });
  readonly countByCategory = computed(() =>
    this.events().reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  private _load(): VdpEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this._save(SEED_EVENTS);
        return SEED_EVENTS;
      }
      return JSON.parse(raw) as VdpEvent[];
    } catch {
      return SEED_EVENTS;
    }
  }

  private _save(events: VdpEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch { /* quota localStorage dépassé (image trop lourde ?) */ }
  }

  // ── GET all ───────────────────────────────────────────────
  loadAll(): Observable<EventsResponse> {
    this.loading.set(true);
    this.error.set(null);
    const data = this._load();
    this.events.set(data);
    this.loading.set(false);
    return of({ success: true, data });
  }

  // ── CREATE ────────────────────────────────────────────────
  create(payload: EventPayload): Observable<EventResponse> {
    const newEvent: VdpEvent = {
      ...payload,
      id       : crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newEvent, ...this._load()];
    this._save(updated);
    this.events.update(list => [newEvent, ...list]);
    this.logSvc.addLog('CREATE_EVENT', `Publication créée : « ${newEvent.title} »`);
    return of({ success: true, data: newEvent });
  }

  // ── UPDATE ────────────────────────────────────────────────
  update(id: string, payload: Partial<EventPayload>): Observable<EventResponse> {
    const list  = this._load();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) {
      return throwError(() => ({ error: { message: 'Événement introuvable' } }));
    }
    const updated: VdpEvent = { ...list[index], ...payload, updatedAt: new Date().toISOString() };
    list[index] = updated;
    this._save(list);
    this.events.update(events => events.map(e => e.id === id ? updated : e));
    this.logSvc.addLog('UPDATE_EVENT', `Publication modifiée : « ${updated.title} »`);
    return of({ success: true, data: updated });
  }

  // ── DELETE ────────────────────────────────────────────────
  delete(id: string): Observable<{ success: boolean; message: string }> {
    const list   = this._load();
    const target = list.find(e => e.id === id);
    this._save(list.filter(e => e.id !== id));
    this.events.update(events => events.filter(e => e.id !== id));
    if (target) this.logSvc.addLog('DELETE_EVENT', `Publication supprimée : « ${target.title} »`);
    return of({ success: true, message: 'Publication supprimée.' });
  }

  // ── UPLOAD image → base64 data URL ────────────────────────
  uploadImage(file: File): Observable<{ success: boolean; url: string }> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        this.logSvc.addLog('UPLOAD_IMAGE', `Image importée : ${file.name}`);
        observer.next({ success: true, url: reader.result as string });
        observer.complete();
      };
      reader.onerror = () => {
        observer.error({ error: { message: 'Impossible de lire le fichier.' } });
      };
      reader.readAsDataURL(file);
    });
  }
}
