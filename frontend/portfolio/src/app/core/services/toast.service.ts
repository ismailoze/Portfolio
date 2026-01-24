import { Injectable, signal, computed } from '@angular/core';

/** Toast gösterim tipi */
export type ToastType = 'error' | 'success' | 'info';

export interface ToastState {
  messageKey: string;
  type: ToastType;
}

/**
 * HTTP hataları ve genel bildirimler için toast servisi.
 * ErrorInterceptor ile entegre; i18n anahtarı ile çalışır.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toast = signal<ToastState | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  readonly toast = computed(() => this._toast());

  showError(messageKey: string): void {
    this.show(messageKey, 'error');
  }

  showSuccess(messageKey: string): void {
    this.show(messageKey, 'success');
  }

  showInfo(messageKey: string): void {
    this.show(messageKey, 'info');
  }

  private show(messageKey: string, type: ToastType): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this._toast.set({ messageKey, type });
    // Hata ve genel bildirimler 5 saniye sonra otomatik kapanır
    this.dismissTimer = setTimeout(() => {
      this.clear();
      this.dismissTimer = null;
    }, 5000);
  }

  clear(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this._toast.set(null);
  }
}
