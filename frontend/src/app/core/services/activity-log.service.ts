import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ActivityLog } from '../models/activity-log.model';

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/logs`;

  logs    = signal<ActivityLog[]>([]);
  loading = signal(false);
  total   = computed(() => this.logs().length);

  loadAll() {
    this.loading.set(true);
    return this.http.get<{ success: boolean; data: ActivityLog[] }>(this.base).pipe(
      tap({
        next:  res => { this.logs.set(res.data); this.loading.set(false); },
        error: ()  => this.loading.set(false)
      })
    );
  }

  clearAll() {
    return this.http.delete<{ success: boolean }>(this.base).pipe(
      tap(() => this.logs.set([]))
    );
  }
}
