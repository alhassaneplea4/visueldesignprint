import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { VdpEvent } from '../../../core/models/event.model';

@Component({
  selector: 'vdp-event-card',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .card {
      background: #161616;
      border: 1px solid rgba(255,255,255,.06);
      overflow: hidden;
      transition: all .3s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .card:hover {
      border-color: rgba(0,180,216,.4);
      transform: translateY(-4px);
      box-shadow: 0 20px 50px rgba(0,0,0,.4);
    }
    .img-wrap {
      height: 220px; background: #1A1A1A;
      position: relative; overflow: hidden; flex-shrink: 0;
    }
    .img-wrap img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder {
      width: 100%; height: 100%; display: flex;
      align-items: center; justify-content: center;
      font-size: 48px; opacity: .3;
      background: repeating-linear-gradient(-45deg,
        rgba(255,255,255,.02), rgba(255,255,255,.02) 10px,
        transparent 10px, transparent 20px);
    }
    .cat-badge {
      position: absolute; top: 16px; left: 16px;
      background: #00B4D8; color: #0D0D0D;
      font-size: 10px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; padding: 4px 10px;
    }
    .body { padding: 28px; flex: 1; display: flex; flex-direction: column; }
    .date {
      font-size: 11px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: #6B6B6B; margin-bottom: 10px;
    }
    .title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 22px; font-weight: 800;
      text-transform: uppercase; letter-spacing: .5px;
      color: #F5F5F0; margin-bottom: 10px; line-height: 1.1;
    }
    .excerpt {
      font-size: 14px; font-weight: 300; line-height: 1.7;
      color: rgba(245,245,240,.6); flex: 1;
    }
  `],
  template: `
    <article class="card">
      <div class="img-wrap">
        @if (event().image) {
          <img [src]="event().image" [alt]="event().title" loading="lazy">
        } @else {
          <div class="placeholder">🖨️</div>
        }
        <span class="cat-badge">{{ event().category }}</span>
      </div>
      <div class="body">
        <div class="date">{{ event().date | date:'d MMMM yyyy':'':'fr' }}</div>
        <h3 class="title">{{ event().title }}</h3>
        <p class="excerpt">{{ event().excerpt }}</p>
      </div>
    </article>
  `
})
export class EventCardComponent {
  event = input.required<VdpEvent>();
}
