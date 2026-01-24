import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('turnstileWidget', { static: false }) turnstileWidget!: ElementRef<HTMLDivElement>;

  loginForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  turnstileToken = signal<string | null>(null);
  turnstileWidgetId: string | null = null;

  ngOnInit(): void {
    // Eğer zaten giriş yapılmışsa admin paneline yönlendir
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      turnstileToken: ['']
    });
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
          this.loginForm.patchValue({ turnstileToken: token });
        },
        'error-callback': () => {
          // Hata durumunda token'ı temizle
          this.turnstileToken.set(null);
          this.loginForm.patchValue({ turnstileToken: '' });
          this.error.set('auth.turnstileError');
        },
        'expired-callback': () => {
          // Token süresi dolduğunda temizle
          this.turnstileToken.set(null);
          this.loginForm.patchValue({ turnstileToken: '' });
        }
      });
    } catch (e) {
      console.error('Turnstile widget render hatası:', e);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Form geçersizse tüm alanları işaretle
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Turnstile token kontrolü - sadece production modunda
    if (environment.production) {
      if (!this.turnstileToken() || !this.loginForm.value.turnstileToken) {
        this.error.set('auth.turnstileRequired');
        // Widget'ı resetle
        if (this.turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(this.turnstileWidgetId);
        }
        return;
      }
    }

    this.loading.set(true);
    this.error.set(null);

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      turnstileToken: this.loginForm.value.turnstileToken
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        // Başarılı giriş - admin paneline yönlendir
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'auth.loginError');
        this.loading.set(false);
        // Hata durumunda widget'ı resetle
        if (this.turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(this.turnstileWidgetId);
          this.turnstileToken.set(null);
          this.loginForm.patchValue({ turnstileToken: '' });
        }
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'auth.fieldRequired';
    }
    if (field.errors['email']) {
      return 'auth.invalidEmail';
    }
    if (field.errors['minlength']) {
      return 'auth.passwordMinLength';
    }

    return '';
  }
}
