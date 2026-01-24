import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
      <!-- Admin Header -->
      <header class="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ 'nav.admin' | translate }}
            </h1>
            <a routerLink="/" class="btn btn--ghost btn--sm">
              {{ 'nav.home' | translate }}
            </a>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        <!-- Admin Navigation -->
        <nav class="mb-8">
          <div class="flex space-x-4 border-b border-gray-200 dark:border-slate-700">
            <a 
              routerLink="/admin" 
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: true}"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-600 transition-colors">
              Dashboard
            </a>
            <a 
              routerLink="/admin/projects" 
              routerLinkActive="active"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-600 transition-colors">
              {{ 'nav.projects' | translate }}
            </a>
            <a 
              routerLink="/admin/blog" 
              routerLinkActive="active"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-600 transition-colors">
              {{ 'nav.blog' | translate }}
            </a>
            <a 
              routerLink="/admin/messages" 
              routerLinkActive="active"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-600 transition-colors">
              Messages
            </a>
            <a 
              routerLink="/admin/skills" 
              routerLinkActive="active"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-600 transition-colors">
              {{ 'nav.skills' | translate }}
            </a>
            <a 
              routerLink="/admin/education" 
              routerLinkActive="active"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-600 transition-colors">
              {{ 'nav.education' | translate }}
            </a>
            <a 
              routerLink="/admin/experience" 
              routerLinkActive="active"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-b-2 border-transparent hover:border-primary-600 transition-colors">
              {{ 'nav.experience' | translate }}
            </a>
          </div>
        </nav>

        <!-- Admin Content -->
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .active {
      @apply text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400;
    }
  `]
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
}
