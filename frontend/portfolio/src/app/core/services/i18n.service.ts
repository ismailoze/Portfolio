import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'tr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private languageSignal = signal<Language>(this.getInitialLanguage());
  currentLanguage = this.languageSignal.asReadonly();

  constructor(private translate: TranslateService) {
    // Dil değişikliklerini dinle
    effect(() => {
      const lang = this.languageSignal();
      // translate.use() Observable döndürür, subscribe etmek önemli
      this.translate.use(lang).subscribe({
        next: () => {
          // Translation yüklendi
          this.updateHtmlLang(lang);
          this.saveLanguage(lang);
        },
        error: (err) => {
          console.error('Translation load error:', err);
        }
      });
    });
  }

  /**
   * Dil değiştir
   */
  setLanguage(lang: Language): void {
    this.languageSignal.set(lang);
  }

  /**
   * Başlangıç dilini belirle
   */
  private getInitialLanguage(): Language {
    // LocalStorage'dan al
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'tr' || savedLang === 'en') {
      return savedLang;
    }

    // Browser language'ı kontrol et
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('tr')) {
        return 'tr';
      }
      if (browserLang.startsWith('en')) {
        return 'en';
      }
    }

    // Varsayılan olarak Türkçe
    return 'tr';
  }

  /**
   * HTML lang attribute'unu güncelle
   */
  private updateHtmlLang(lang: Language): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }

  /**
   * Dili localStorage'a kaydet
   */
  private saveLanguage(lang: Language): void {
    localStorage.setItem('language', lang);
  }
}
