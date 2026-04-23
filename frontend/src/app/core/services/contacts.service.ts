import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Contact, ContactPayload } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/contacts`;

  contacts   = signal<Contact[]>([]);
  loading    = signal(false);
  error      = signal<string | null>(null);

  unreadCount = computed(() => this.contacts().filter(c => !c.read).length);
  total       = computed(() => this.contacts().length);

  submit(payload: ContactPayload) {
    return this.http.post<{ success: boolean; data: Contact }>(this.base, payload).pipe(
      tap(res => { if (res.success) this.contacts.update(list => [res.data, ...list]); })
    );
  }

  loadAll() {
    this.loading.set(true);
    return this.http.get<{ success: boolean; data: Contact[] }>(this.base).pipe(
      tap({
        next:  res => { this.contacts.set(res.data); this.loading.set(false); },
        error: err => { this.error.set(err.message);  this.loading.set(false); }
      })
    );
  }

  markRead(id: string, read: boolean) {
    return this.http.put<{ success: boolean; data: Contact }>(`${this.base}/${id}`, { read }).pipe(
      tap(res => {
        if (res.success) this.contacts.update(list => list.map(c => c.id === id ? res.data : c));
      })
    );
  }

  delete(id: string) {
    return this.http.delete<{ success: boolean }>(`${this.base}/${id}`).pipe(
      tap(() => this.contacts.update(list => list.filter(c => c.id !== id)))
    );
  }
}
