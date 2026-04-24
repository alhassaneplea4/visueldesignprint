import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivityLog, LogAction } from '../models/activity-log.model';

const STORAGE_KEY = 'vdp_logs';
const MAX_LOGS    = 300;

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  logs    = signal<ActivityLog[]>([]);
  loading = signal(false);
  total   = computed(() => this.logs().length);

  private _load(): ActivityLog[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ActivityLog[]) : [];
    } catch {
      return [];
    }
  }

  private _save(logs: ActivityLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
    } catch { /* quota localStorage dépassé */ }
  }

  loadAll(): Observable<{ success: boolean; data: ActivityLog[] }> {
    this.loading.set(true);
    const data = this._load();
    this.logs.set(data);
    this.loading.set(false);
    return of({ success: true, data });
  }

  clearAll(): Observable<{ success: boolean }> {
    localStorage.removeItem(STORAGE_KEY);
    this.logs.set([]);
    return of({ success: true });
  }

  addLog(
    action : LogAction,
    label  : string,
    user   = 'admin',
    details: Record<string, unknown> | null = null
  ): void {
    const log: ActivityLog = {
      id: crypto.randomUUID(),
      action,
      label,
      user,
      details,
      createdAt: new Date().toISOString(),
    };
    const updated = [log, ...this._load()].slice(0, MAX_LOGS);
    this._save(updated);
    this.logs.update(list => [log, ...list].slice(0, MAX_LOGS));
  }
}
