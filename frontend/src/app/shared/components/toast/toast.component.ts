import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'vdp-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      min-width: 260px;
      max-width: 400px;
      background: #1A1A1A;
      border: 1px solid rgba(255,255,255,0.08);
      border-left-width: 3px;
      color: #F5F5F0;
      font-family: 'Barlow', sans-serif;
      font-size: 13px;
      font-weight: 600;
      animation: slideIn 0.35s ease;
    }
    .toast.success  { border-left-color: #22C55E; }
    .toast.error    { border-left-color: #EF4444; }
    .toast.warning  { border-left-color: #F4C430; }
    .toast.info     { border-left-color: #00B4D8; }
    .close-btn {
      margin-left: auto;
      background: none;
      border: none;
      color: rgba(245,245,240,0.4);
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 0;
    }
    .close-btn:hover { color: #F5F5F0; }
    @keyframes slideIn {
      from { transform: translateX(60px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `],
  template: `
    <div class="toast-container">
      @for (toast of toastSvc.toasts(); track toast.id) {
        <div class="toast {{ toast.type }}">
          <span>{{ iconFor(toast.type) }}</span>
          <span>{{ toast.message }}</span>
          <button class="close-btn" (click)="toastSvc.remove(toast.id)">✕</button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastSvc = inject(ToastService);

  iconFor(type: string): string {
    const icons: Record<string, string> = {
      success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️'
    };
    return icons[type] ?? 'ℹ️';
  }
}
