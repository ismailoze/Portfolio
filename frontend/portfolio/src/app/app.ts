import { Component, OnInit, inject, effect, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from './core/services/i18n.service';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  template: `
    <div class="app-root">
      <router-outlet></router-outlet>
      <app-toast />
    </div>
  `,
  styles: ['.app-root { min-height: 100vh; }']
})
export class App implements OnInit {
  private translate = inject(TranslateService);
  private i18nService = inject(I18nService);
  private themeService = inject(ThemeService);

  constructor() {
    // Initialize i18n with current language
    this.translate.setDefaultLang('tr');
    
    // Effect to update translate service when language changes
    effect(() => {
      const lang = this.i18nService.currentLanguage();
      this.translate.use(lang).subscribe();
    });

    // TranslateService'in hazır olmasını bekle ve ilk dili ayarla
    afterNextRender(() => {
      const currentLang = this.i18nService.currentLanguage();
      // Translation dosyalarının yüklenmesini bekle
      this.translate.use(currentLang).subscribe();
    });
  }

  ngOnInit(): void {
    // Set initial language (backup)
    const currentLang = this.i18nService.currentLanguage();
    this.translate.use(currentLang).subscribe();
  }
}
