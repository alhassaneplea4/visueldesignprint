import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import {
  VdpEvent, EventPayload,
  EventsResponse, EventResponse
} from '../models/event.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/events`;

  // ── State (Signals) ──────────────────────────────────────
  readonly events   = signal<VdpEvent[]>([]);
  readonly loading  = signal(false);
  readonly error    = signal<string | null>(null);

  readonly totalCount   = computed(() => this.events().length);
  readonly thisMonth    = computed(() => {
    const now = new Date();
    return this.events().filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    }).length;
  });
  readonly countByCategory = computed(() => {
    return this.events().reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  });

  // ── GET all ───────────────────────────────────────────────
  loadAll(): Observable<EventsResponse> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<EventsResponse>(this.base).pipe(
      tap(res => {
        this.events.set(res.data);
        this.loading.set(false);
      }),
      catchError(err => {
        this.error.set(err.error?.message || 'Erreur de chargement');
        this.loading.set(false);
        return EMPTY;
      })
    );
  }

  // ── CREATE ────────────────────────────────────────────────
  create(payload: EventPayload): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.base, payload).pipe(
      tap(res => {
        this.events.update(events => [res.data, ...events]);
      })
    );
  }

  // ── UPDATE ────────────────────────────────────────────────
  update(id: string, payload: Partial<EventPayload>): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.base}/${id}`, payload).pipe(
      tap(res => {
        this.events.update(events =>
          events.map(e => e.id === id ? res.data : e)
        );
      })
    );
  }

  // ── DELETE ────────────────────────────────────────────────
  delete(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.base}/${id}`).pipe(
      tap(() => {
        this.events.update(events => events.filter(e => e.id !== id));
      })
    );
  }

  // ── UPLOAD image ──────────────────────────────────────────
  uploadImage(file: File): Observable<{ success: boolean; url: string }> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<{ success: boolean; url: string }>(
      `${this.base}/upload`, form
    );
  }
}
