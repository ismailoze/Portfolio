import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    @if (toastService.toast(); as t) {
      <div
        role="alert"
        class="toast"
        [class.toast--error]="t.type === 'error'"
        [class.toast--success]="t.type === 'success'"
        [class.toast--info]="t.type === 'info'"
      >
        <span class="toast__message">{{ t.messageKey | translate }}</span>
        <button
          type="button"
          class="toast__close"
          (click)="toastService.clear()"
          [attr.aria-label]="'common.close' | translate"
        >
          ×
        </button>
      </div>
    }
  `,
  styles: [
    `
      .toast {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 24rem;
        animation: toast-in 0.25s ease-out;
      }
      .toast--error {
        background: #fef2f2;
        color: #991b1b;
        border: 1px solid #fecaca;
      }
      .toast--success {
        background: #f0fdf4;
        color: #166534;
        border: 1px solid #bbf7d0;
      }
      .toast--info {
        background: #eff6ff;
        color: #1e40af;
        border: 1px solid #bfdbfe;
      }
      :host-context(.dark) .toast--error {
        background: #450a0a;
        color: #fecaca;
        border-color: #7f1d1d;
      }
      :host-context(.dark) .toast--success {
        background: #052e16;
        color: #bbf7d0;
        border-color: #14532d;
      }
      :host-context(.dark) .toast--info {
        background: #172554;
        color: #bfdbfe;
        border-color: #1e3a8a;
      }
      .toast__message {
        flex: 1;
      }
      .toast__close {
        background: none;
        border: none;
        font-size: 1.25rem;
        line-height: 1;
        cursor: pointer;
        opacity: 0.7;
        padding: 0 0.25rem;
      }
      .toast__close:hover {
        opacity: 1;
      }
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `
  ]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
