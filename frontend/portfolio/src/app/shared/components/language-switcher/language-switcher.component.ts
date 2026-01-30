import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        data-testid="language-switcher"
        (click)="toggleLanguage()"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
        type="button">
        {{ i18nService.currentLanguage() === 'tr' ? 'EN' : 'TR' }}
      </button>
    </div>
  `,
  styles: []
})
export class LanguageSwitcherComponent {
  i18nService = inject(I18nService);

  toggleLanguage(): void {
    const currentLang = this.i18nService.currentLanguage();
    const newLang = currentLang === 'tr' ? 'en' : 'tr';
    this.i18nService.setLanguage(newLang);
  }
}
