import { Component, signal, inject, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../core/services/contact.service';
import { CreateContactMessageDto } from '../../core/models/api.models';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';
import { environment } from '../../../environments/environment';

// Cloudflare Turnstile tip tanımları
declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ScrollAnimationDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  @ViewChild('turnstileWidget', { static: false }) turnstileWidget!: ElementRef<HTMLDivElement>;

  contactForm: FormGroup;
  submitting = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  turnstileToken = signal<string | null>(null);
  turnstileWidgetId: string | null = null;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      turnstileToken: ['']
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Cloudflare Turnstile widget'ını yükle (loadTurnstile içinde production kontrolü var)
    this.loadTurnstile();
  }

  ngOnDestroy(): void {
    // Widget'ı temizle
    if (this.turnstileWidgetId && window.turnstile) {
      try {
        window.turnstile.remove(this.turnstileWidgetId);
      } catch (e) {
        console.error('Turnstile widget temizlenirken hata:', e);
      }
    }
  }

  private loadTurnstile(): void {
    // Production modunda değilse Turnstile'ı yükleme
    if (!environment.production) {
      return;
    }

    // Script yoksa önce yükle
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Script yüklenene kadar bekle
    const checkTurnstile = setInterval(() => {
      if (window.turnstile && this.turnstileWidget?.nativeElement) {
        clearInterval(checkTurnstile);
        this.renderTurnstile();
      }
    }, 100);

    // 10 saniye sonra timeout
    setTimeout(() => {
      clearInterval(checkTurnstile);
      if (!window.turnstile) {
        console.warn('Cloudflare Turnstile script yüklenemedi');
      }
    }, 10000);
  }

  private renderTurnstile(): void {
    if (!window.turnstile || !this.turnstileWidget?.nativeElement) {
      return;
    }

    const siteKey = environment.cloudflareTurnstileSiteKey;
    if (!siteKey) {
      console.warn('Cloudflare Turnstile site key tanımlı değil');
      return;
    }

    try {
      this.turnstileWidgetId = window.turnstile.render(this.turnstileWidget.nativeElement, {
        sitekey: siteKey,
        callback: (token: string) => {
          // Token alındığında form'a ekle
          this.turnstileToken.set(token);
          this.contactForm.patchValue({ turnstileToken: token });
        },
        'error-callback': () => {
          // Hata durumunda token'ı temizle
          this.turnstileToken.set(null);
          this.contactForm.patchValue({ turnstileToken: '' });
          this.error.set('contact.turnstileError');
        },
        'expired-callback': () => {
          // Token süresi dolduğunda temizle
          this.turnstileToken.set(null);
          this.contactForm.patchValue({ turnstileToken: '' });
        }
      });
    } catch (e) {
      console.error('Turnstile widget render hatası:', e);
    }
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Turnstile token kontrolü - sadece production modunda
    if (environment.production) {
      if (!this.turnstileToken() || !this.contactForm.value.turnstileToken) {
        this.error.set('contact.turnstileRequired');
        // Widget'ı resetle
        if (this.turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(this.turnstileWidgetId);
        }
        return;
      }
    }

    this.submitting.set(true);
    this.error.set(null);
    this.success.set(false);

    const dto: CreateContactMessageDto = this.contactForm.value;

    this.contactService.sendMessage(dto).subscribe({
      next: () => {
        this.success.set(true);
        this.contactForm.reset();
        this.turnstileToken.set(null);
        this.submitting.set(false);
        
        // Widget'ı resetle
        if (this.turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(this.turnstileWidgetId);
        }
        
        // 3 saniye sonra success mesajını gizle
        setTimeout(() => {
          this.success.set(false);
        }, 3000);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'contact.error');
        this.submitting.set(false);
        // Hata durumunda widget'ı resetle
        if (this.turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(this.turnstileWidgetId);
          this.turnstileToken.set(null);
          this.contactForm.patchValue({ turnstileToken: '' });
        }
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (field?.hasError('email')) {
      return 'Geçerli bir e-posta adresi giriniz';
    }
    if (field?.hasError('minlength')) {
      return `En az ${field.errors?.['minlength'].requiredLength} karakter olmalıdır`;
    }
    return '';
  }
}
