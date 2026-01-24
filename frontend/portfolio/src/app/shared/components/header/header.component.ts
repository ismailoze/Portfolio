import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { PortfolioOwner } from '../../../core/models/api.models';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ThemeToggleComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private themeService = inject(ThemeService);
  private i18nService = inject(I18nService);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private ownerSub?: Subscription;

  isMenuOpen = signal(false);
  isScrolled = signal(false);
  currentRoute = signal('');

  isAuthenticated = this.authService.isAuthenticated;
  isAdmin = this.authService.isAdmin;

  // Portfolio sahibinin adı soyadı
  ownerName = signal<string>('');

  constructor() {
    // Scroll event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }

    // Route change listener
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute.set(event.url);
        this.isMenuOpen.set(false); // Close mobile menu on route change
      });
  }

  ngOnInit(): void {
    this.currentRoute.set(this.router.url);
    // Portfolio sahibinin bilgilerini yükle
    this.loadPortfolioOwner();
  }

  ngOnDestroy(): void {
    // Memory leak'i önlemek için subscription'ı temizle
    this.ownerSub?.unsubscribe();
  }

  private loadPortfolioOwner(): void {
    this.ownerSub = this.apiService.get<PortfolioOwner>('profile/owner').subscribe({
      next: (owner) => {
        if (owner.firstName && owner.lastName) {
          this.ownerName.set(`${owner.firstName} ${owner.lastName}`);
        }
      },
      error: (err) => {
        console.error('Portfolio owner load error:', err);
        this.ownerName.set(''); // Hata durumunda boş bırak
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute() === route || this.currentRoute().startsWith(route + '/');
  }
}
