import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal ile theme state yönetimi
  private themeSignal = signal<Theme>(this.getInitialTheme());
  currentTheme = this.themeSignal.asReadonly();

  constructor() {
    // Theme değişikliklerini dinle ve DOM'a uygula
    effect(() => {
      const theme = this.themeSignal();
      this.applyTheme(theme);
      this.saveTheme(theme);
    });

    // İlk yüklemede theme'i uygula
    this.applyTheme(this.themeSignal());
  }

  /**
   * Theme'i değiştir
   */
  toggleTheme(): void {
    const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Belirli bir theme'i ayarla
   */
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  /**
   * Theme'i DOM'a uygula
   */
  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
  }

  /**
   * Başlangıç theme'ini belirle
   */
  private getInitialTheme(): Theme {
    // LocalStorage'dan al (kullanıcı daha önce bir tercih yaptıysa onu kullan)
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Varsayılan olarak dark mode
    return 'dark';
  }

  /**
   * Theme'i localStorage'a kaydet
   */
  private saveTheme(theme: Theme): void {
    localStorage.setItem('theme', theme);
  }
}
