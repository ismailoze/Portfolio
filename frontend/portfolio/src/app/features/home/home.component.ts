import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';
import { ApiService } from '../../core/services/api.service';
import { PortfolioOwner } from '../../core/models/api.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ScrollAnimationDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private apiService = inject(ApiService);
  private translationSub?: Subscription;
  private langChangeSub?: Subscription;
  private ownerSub?: Subscription;
  private animationInterval?: ReturnType<typeof setInterval>;
  private animationTimeout?: ReturnType<typeof setTimeout>;

  // Typing animation için text - signal kullanarak zoneless change detection için
  typingText = '';
  displayedText = signal('');
  isTyping = signal(false); // Translation yüklenene kadar false

  // Portfolio sahibinin adı soyadı
  ownerName = signal<string>('');
  // Profil resmi URL'i (assets klasöründen veya API'den çekilebilir)
  profileImageUrl = signal<string>('assets/images/profile.png');

  constructor() {
    // Dil değişikliklerini dinle
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.loadTranslation();
    });
  }

  ngOnInit(): void {
    // Component hazır olduğunda translation'ı yükle
    this.loadTranslation();
    // Portfolio sahibinin bilgilerini yükle
    this.loadPortfolioOwner();
  }

  ngOnDestroy(): void {
    // Memory leak'i önlemek için subscription ve timer'ları temizle
    this.translationSub?.unsubscribe();
    this.langChangeSub?.unsubscribe();
    this.ownerSub?.unsubscribe();
    this.stopAnimation();
  }

  private loadPortfolioOwner(): void {
    this.ownerSub = this.apiService.get<PortfolioOwner>('profile/owner').subscribe({
      next: (owner) => {
        if (owner.firstName && owner.lastName) {
          this.ownerName.set(`${owner.firstName} ${owner.lastName}`);
        }
        // profileImageUrl: API şu an sadece firstName/lastName döndürüyor.
        // Profil resmi assets/images/profile.png üzerinden kullanılıyor.
      },
      error: (err) => {
        console.error('Portfolio owner load error:', err);
        // Hata durumunda translation'dan göster
        this.ownerName.set('');
      }
    });
  }

  /**
   * Resim yüklenemezse hata logla
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('Profil resmi yüklenemedi:', this.profileImageUrl());
    console.error('Resim URL:', img?.src);
    // Resim yüklenemezse gizle
    if (img && img.parentElement) {
      img.parentElement.style.display = 'none';
    }
    // Veya varsayılan bir placeholder göster
    this.profileImageUrl.set('');
  }

  private stopAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = undefined;
    }
  }

  private loadTranslation(): void {
    // Önceki animasyonu durdur
    this.stopAnimation();

    // Önceki subscription'ı temizle
    this.translationSub?.unsubscribe();

    // Yeni translation'ı yükle
    this.translationSub = this.translate.get('home.subtitle').subscribe({
      next: (text: string) => {
        if (!text) {
          console.warn('Translation text is empty for home.subtitle');
          return;
        }
        
        console.log('Translation loaded:', text);
        
        // Önce animasyonu durdur (eğer hala çalışıyorsa)
        this.stopAnimation();
        
        this.typingText = text;
        this.displayedText.set('');
        this.isTyping.set(false);
        
        // Animasyonu hemen başlat
        this.startTypingAnimation();
      },
      error: (err) => {
        console.error('Translation load error:', err);
      }
    });
  }

  private startTypingAnimation(): void {
    // typingText boşsa animasyonu başlatma
    if (!this.typingText) {
      console.warn('Typing animation: typingText is empty');
      return;
    }

    console.log('Starting typing animation with text:', this.typingText);

    // Önceki animasyonu durdur (güvenlik için)
    this.stopAnimation();

    let index = 0;
    this.isTyping.set(true);
    this.displayedText.set(''); // Başlangıçta temizle
    
    this.animationInterval = setInterval(() => {
      // Component destroy edilmişse dur
      if (!this.typingText) {
        this.stopAnimation();
        return;
      }

      if (index < this.typingText.length) {
        // Signal'ı güncelle - zoneless change detection otomatik algılayacak
        this.displayedText.set(this.displayedText() + this.typingText[index]);
        index++;
      } else {
        // Animasyon tamamlandı
        if (this.animationInterval) {
          clearInterval(this.animationInterval);
          this.animationInterval = undefined;
        }
        this.isTyping.set(false);
        
        // 2 saniye sonra tekrar başlat
        this.animationTimeout = setTimeout(() => {
          // Timeout çalıştığında hala component destroy edilmemişse devam et
          if (this.typingText) {
            this.displayedText.set('');
            this.startTypingAnimation();
          }
        }, 2000);
      }
    }, 100);
  }
}
