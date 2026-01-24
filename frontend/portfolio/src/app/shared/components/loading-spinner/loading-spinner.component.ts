import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (fullScreen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div class="text-center">
          <div class="spinner"></div>
          @if (message) {
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ message }}</p>
          }
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center p-4">
        <div class="spinner spinner--sm"></div>
        @if (message) {
          <p class="ml-3 text-gray-600 dark:text-gray-400">{{ message }}</p>
        }
      </div>
    }
  `,
  styles: [`
    .spinner {
      @apply inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin;
      
      &--sm {
        @apply w-4 h-4 border-2 border-t-primary-600;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() fullScreen = false;
  @Input() message = '';
}
