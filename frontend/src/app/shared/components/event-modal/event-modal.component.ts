import {
  Component, inject, output, input, effect,
  signal, ChangeDetectionStrategy
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EventsService }          from '../../../core/services/events.service';
import { ToastService }           from '../../../core/services/toast.service';
import { VdpEvent, EVENT_CATEGORIES, EventPayload } from '../../../core/models/event.model';

@Component({
  selector: 'vdp-event-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.75); backdrop-filter: blur(4px);
      z-index: 500; display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }
    .modal {
      background: #1A1A1A; border: 1px solid rgba(255,255,255,.08);
      width: 100%; max-width: 660px; max-height: 92vh; overflow-y: auto;
    }
    .modal-header {
      padding: 24px 28px; border-bottom: 1px solid rgba(255,255,255,.08);
      display: flex; align-items: center; justify-content: space-between;
    }
    .modal-header h3 {
      font-family: 'Bebas Neue',sans-serif; font-size: 28px;
      letter-spacing: 2px; color: #F5F5F0;
    }
    .close-btn {
      width: 32px; height: 32px; background: none;
      border: 1px solid rgba(255,255,255,.1); color: #F5F5F0;
      cursor: pointer; font-size: 14px; transition: all .2s; display: flex;
      align-items: center; justify-content: center;
    }
    .close-btn:hover { border-color: #EF4444; color: #EF4444; }
    .modal-body { padding: 28px; display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-field label {
      font-size: 11px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: #6B6B6B;
    }
    .form-field input,
    .form-field select,
    .form-field textarea {
      background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
      color: #F5F5F0; padding: 12px 14px;
      font-family: 'Barlow',sans-serif; font-size: 13px;
      outline: none; transition: border-color .3s; width: 100%;
    }
    .form-field input:focus,
    .form-field select:focus,
    .form-field textarea:focus { border-color: #00B4D8; }
    .form-field.error input,
    .form-field.error select,
    .form-field.error textarea { border-color: #EF4444; }
    .form-field select option { background: #131313; }
    .form-field textarea { resize: vertical; min-height: 100px; }
    .err-msg { font-size: 11px; color: #EF4444; margin-top: 2px; }

    /* Upload zone */
    .upload-zone {
      border: 2px dashed rgba(255,255,255,.12); padding: 28px;
      text-align: center; cursor: pointer; transition: all .3s; position: relative;
    }
    .upload-zone:hover { border-color: #00B4D8; }
    .upload-zone input[type="file"] { display: none; }
    .upload-zone .icon { font-size: 30px; margin-bottom: 8px; }
    .upload-zone p { font-size: 13px; color: #6B6B6B; }
    .upload-zone small { font-size: 11px; color: rgba(245,245,240,.3); margin-top: 4px; display: block; }
    .preview { margin-top: 12px; }
    .preview img { max-height: 150px; max-width: 100%; border: 1px solid rgba(255,255,255,.08); }

    .modal-footer {
      padding: 20px 28px; border-top: 1px solid rgba(255,255,255,.08);
      display: flex; justify-content: flex-end; gap: 12px;
    }
    .btn-cancel {
      background: transparent; border: 1px solid rgba(255,255,255,.1);
      color: rgba(245,245,240,.6); padding: 10px 22px;
      font-family: 'Barlow',sans-serif; font-size: 12px;
      font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer;
      transition: all .2s;
    }
    .btn-cancel:hover { border-color: rgba(255,255,255,.25); color: #F5F5F0; }
    .btn-save {
      background: #00B4D8; border: none; color: #0D0D0D;
      padding: 10px 28px; font-family: 'Barlow',sans-serif;
      font-size: 12px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; cursor: pointer; transition: all .2s;
      display: flex; align-items: center; gap: 8px;
    }
    .btn-save:hover { background: #F5F5F0; }
    .btn-save:disabled { opacity: .5; cursor: not-allowed; }
    .spinner {
      width: 14px; height: 14px; border: 2px solid #0D0D0D;
      border-top-color: transparent; border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `],
  template: `
    <div class="overlay" (click)="onOverlayClick($event)">
      <div class="modal" role="dialog" aria-modal="true">

        <div class="modal-header">
          <h3>{{ editEvent() ? 'MODIFIER' : 'NOUVELLE' }} PUBLICATION</h3>
          <button class="close-btn" (click)="closed.emit()" aria-label="Fermer">✕</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body">

            <!-- Titre -->
            <div class="form-field" [class.error]="hasError('title')">
              <label for="title">Titre *</label>
              <input id="title" type="text" formControlName="title"
                     placeholder="Titre de la publication" />
              @if (hasError('title')) {
                <span class="err-msg">Le titre est requis</span>
              }
            </div>

            <!-- Catégorie + Date -->
            <div class="form-row">
              <div class="form-field" [class.error]="hasError('category')">
                <label for="cat">Catégorie *</label>
                <select id="cat" formControlName="category">
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>
              <div class="form-field" [class.error]="hasError('date')">
                <label for="date">Date *</label>
                <input id="date" type="date" formControlName="date" />
                @if (hasError('date')) {
                  <span class="err-msg">La date est requise</span>
                }
              </div>
            </div>

            <!-- Extrait -->
            <div class="form-field" [class.error]="hasError('excerpt')">
              <label for="excerpt">Extrait / Description *</label>
              <textarea id="excerpt" formControlName="excerpt"
                        placeholder="Description courte de la publication…"></textarea>
              @if (hasError('excerpt')) {
                <span class="err-msg">L'extrait est requis</span>
              }
            </div>

            <!-- Image upload -->
            <div class="form-field">
              <label>Image (optionnel)</label>
              <div class="upload-zone" (click)="fileInput.click()">
                <input #fileInput type="file" accept="image/*"
                       (change)="onFileChange($event)" />
                <div class="icon">🖼️</div>
                <p>Cliquez pour sélectionner une image</p>
                <small>JPG, PNG, WebP — Max 5 MB</small>
              </div>
              @if (imagePreview()) {
                <div class="preview">
                  <img [src]="imagePreview()" alt="Aperçu" />
                </div>
              }
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closed.emit()">Annuler</button>
            <button type="submit" class="btn-save" [disabled]="saving()">
              @if (saving()) {
                <span class="spinner"></span>
                <span>Enregistrement…</span>
              } @else {
                <span>{{ editEvent() ? '💾 Mettre à jour' : '🚀 Publier' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EventModalComponent {
  // ── Inputs / Outputs ──────────────────────────────────────
  editEvent = input<VdpEvent | null>(null);
  closed    = output<void>();
  saved     = output<void>();

  // ── Deps ──────────────────────────────────────────────────
  private fb      = inject(FormBuilder);
  private svc     = inject(EventsService);
  private toast   = inject(ToastService);

  // ── State ─────────────────────────────────────────────────
  saving       = signal(false);
  imagePreview = signal<string>('');
  uploadedUrl  = signal<string>('');

  categories = EVENT_CATEGORIES;

  form = this.fb.group({
    title    : ['', [Validators.required, Validators.minLength(3)]],
    category : [EVENT_CATEGORIES[0], Validators.required],
    date     : [new Date().toISOString().split('T')[0], Validators.required],
    excerpt  : ['', [Validators.required, Validators.minLength(10)]]
  });

  // Pré-remplir le formulaire si on est en mode édition
  constructor() {
    effect(() => {
      const ev = this.editEvent();
      if (ev) {
        this.form.patchValue({
          title   : ev.title,
          category: ev.category,
          date    : ev.date,
          excerpt : ev.excerpt
        });
        if (ev.image) {
          this.imagePreview.set(ev.image);
          this.uploadedUrl.set(ev.image);
        }
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) {
      this.closed.emit();
    }
  }

  // ── Image upload ──────────────────────────────────────────
  onFileChange(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Aperçu local immédiat
    const reader = new FileReader();
    reader.onload = evt => this.imagePreview.set(evt.target?.result as string);
    reader.readAsDataURL(file);

    // Upload vers le backend
    this.svc.uploadImage(file).subscribe({
      next: res => this.uploadedUrl.set(res.url),
      error: () => this.toast.error('Erreur lors de l\'upload de l\'image')
    });
  }

  // ── Submit ────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);

    const payload: EventPayload = {
      title    : this.form.value.title!,
      excerpt  : this.form.value.excerpt!,
      category : this.form.value.category as any,
      date     : this.form.value.date!,
      image    : this.uploadedUrl()
    };

    const req = this.editEvent()
      ? this.svc.update(this.editEvent()!.id, payload)
      : this.svc.create(payload);

    req.subscribe({
      next: () => {
        this.toast.success(
          this.editEvent() ? '✅ Publication mise à jour !' : '🚀 Publication créée !'
        );
        this.saving.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Une erreur est survenue');
        this.saving.set(false);
      }
    });
  }
}
