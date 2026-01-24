import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="error-message p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
            {{ 'common.error' | translate }}
          </h3>
          <p class="text-sm text-red-700 dark:text-red-400">
            {{ message || ('errors.networkError' | translate) }}
          </p>
          @if (showRetry && retryCallback) {
            <button
              (click)="onRetry()"
              class="mt-3 btn btn--outline btn--sm text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30">
              {{ 'common.retry' | translate }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ErrorMessageComponent {
  @Input() message = '';
  @Input() showRetry = false;
  @Input() retryCallback?: () => void;

  onRetry(): void {
    if (this.retryCallback) {
      this.retryCallback();
    }
  }
}
