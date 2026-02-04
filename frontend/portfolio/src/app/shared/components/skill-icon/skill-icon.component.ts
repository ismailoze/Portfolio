import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-skill-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (iconSvg) {
      <span 
        [innerHTML]="iconSvg" 
        [style.width.px]="size"
        [style.height.px]="size"
        class="inline-flex items-center justify-center flex-shrink-0"
        [attr.aria-label]="iconName">
      </span>
    } @else if (iconName && isLoading()) {
      <span 
        [style.width.px]="size"
        [style.height.px]="size"
        class="inline-flex items-center justify-center flex-shrink-0 animate-pulse bg-gray-200 dark:bg-gray-700 rounded">
      </span>
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    :host ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class SkillIconComponent implements OnInit, OnChanges {
  @Input() iconName: string | null | undefined = null;
  @Input() size = 24;
  @Input() color = 'currentColor';
  @Input() iconSet = 'simple-icons'; // Varsayılan: simple-icons, alternatif: logos, devicon, vb.

  iconSvg: SafeHtml | null = null;
  isLoading = signal(false);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    if (this.iconName) {
      this.loadIcon();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iconName'] && this.iconName) {
      this.loadIcon();
    }
  }

  private async loadIcon(): Promise<void> {
    if (!this.iconName) {
      this.iconSvg = null;
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.iconSvg = null;

    try {
      const trimmedIcon = this.iconName.trim();
      
      // 1. Raw SVG string kontrolü (<svg ile başlıyorsa)
      if (trimmedIcon.startsWith('<svg')) {
        await this.loadFromRawSvg(trimmedIcon);
        this.isLoading.set(false);
        return;
      }
      
      // 2. Data URI kontrolü (data:image/svg+xml)
      if (trimmedIcon.startsWith('data:image/svg+xml')) {
        await this.loadFromDataUri(trimmedIcon);
        this.isLoading.set(false);
        return;
      }
      
      // 3. HTTP/HTTPS URL kontrolü (SVG dosyası)
      if (trimmedIcon.startsWith('http://') || trimmedIcon.startsWith('https://')) {
        await this.loadFromUrl(trimmedIcon);
        this.isLoading.set(false);
        return;
      }
      
      // 4. Iconify formatı (mevcut mantık)
      const iconId = this.getIconName();
      const iconSet = iconId.includes(':') ? iconId.split(':')[0] : this.iconSet;
      let iconName = iconId.includes(':') ? iconId.split(':')[1] : iconId;
      
      // Icon adı mapping'leri (eski/yanlış adları düzelt)
      const iconNameMap: Record<string, string> = {
        // JWT
        'jwt': 'jsonwebtokens',
        // ASP.NET / Entity Framework
        'aspdotnet': 'microsoft',
        'aspnet': 'microsoft',
        'aspdotnetcore': 'microsoft',
        'entityframework': 'microsoft',
        'ef': 'microsoft',
        // Cloud
        'azure': 'microsoftazure',
        'gcp': 'googlecloud',
        // API / REST
        'api': 'swagger',
        'restful': 'swagger',
        'rest': 'swagger',
        // HTML
        'html': 'html5',
        'htmlcss': 'html5',
        // Diğer
        'csharp': 'csharp',
        'dotnet': 'dotnet',
        'angular': 'angular',
        'typescript': 'typescript',
        'javascript': 'javascript',
        'sass': 'sass',
        'postgresql': 'postgresql',
        'docker': 'docker',
        'git': 'git',
        'github': 'github'
      };
      
      iconName = iconNameMap[iconName.toLowerCase()] || iconName;
      
      const apiUrl = `https://api.iconify.design/${iconSet}/${iconName}.svg`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        // Fallback: Eski simple-icons paketinden dene
        if (iconSet === 'simple-icons' && this.iconName && !this.iconName.includes(':')) {
          await this.loadFromSimpleIcons();
          this.isLoading.set(false);
          return;
        }
        throw new Error(`Icon not found: ${iconId}`);
      }
      
      const svgText = await response.text();
      
      // SVG'yi boyutlandır ve renklendir
      let svg = svgText
        .replace(/width="[^"]*"/g, `width="${this.size}"`)
        .replace(/height="[^"]*"/g, `height="${this.size}"`);
      
      // Eğer color currentColor değilse, fill attribute'unu güncelle
      if (this.color !== 'currentColor') {
        svg = svg.replace(/fill="[^"]*"/g, `fill="${this.color}"`);
      } else {
        // currentColor kullanmak için fill="currentColor" ekle
        if (!svg.includes('fill=')) {
          svg = svg.replace(/<svg/, `<svg fill="currentColor"`);
        } else {
          svg = svg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
        }
      }
      
      this.iconSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.isLoading.set(false);
    } catch (error) {
      // Fallback: Simple Icons paketinden dene
      if (this.iconName && !this.iconName.includes(':')) {
        await this.loadFromSimpleIcons();
        this.isLoading.set(false);
      } else {
        console.warn(`Icon yüklenemedi: ${this.iconName}`, error);
        this.iconSvg = null;
        this.isLoading.set(false);
      }
    }
  }

  private async loadFromSimpleIcons(): Promise<void> {
    try {
      // simple-icons paketi tip tanımları eksik olabilir
      const simpleIconsModule = await import('simple-icons');
      const icons = (simpleIconsModule as { default?: Record<string, { svg: string; hex?: string }> }).default ?? simpleIconsModule as Record<string, { svg: string; hex?: string }>;
      
      const normalizedName = (this.iconName || '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      const icon = icons[normalizedName];
      
      if (icon && icon.svg) {
        let svg = icon.svg
          .replace(/width="[^"]*"/g, `width="${this.size}"`)
          .replace(/height="[^"]*"/g, `height="${this.size}"`);
        
        // Icon'un orijinal rengini kullan
        if (icon.hex) {
          svg = svg.replace(/fill="[^"]*"/g, `fill="#${icon.hex}"`);
        } else if (this.color !== 'currentColor') {
          svg = svg.replace(/fill="[^"]*"/g, `fill="${this.color}"`);
        }
        
        this.iconSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
      } else {
        this.iconSvg = null;
      }
    } catch (error) {
      console.warn(`Simple Icons'dan yüklenemedi: ${this.iconName}`, error);
      this.iconSvg = null;
    }
  }

  /**
   * Raw SVG string'den icon yükle
   */
  private async loadFromRawSvg(svgString: string): Promise<void> {
    try {
      let svg = svgString
        .replace(/width="[^"]*"/g, `width="${this.size}"`)
        .replace(/height="[^"]*"/g, `height="${this.size}"`);
      
      // Renklendirme
      if (this.color !== 'currentColor') {
        svg = svg.replace(/fill="[^"]*"/g, `fill="${this.color}"`);
      } else if (!svg.includes('fill=')) {
        svg = svg.replace(/<svg/, `<svg fill="currentColor"`);
      }
      
      this.iconSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
    } catch (error) {
      console.warn('Raw SVG yüklenemedi:', error);
      this.iconSvg = null;
    }
  }

  /**
   * Data URI'den icon yükle (base64 veya encoded)
   */
  private async loadFromDataUri(dataUri: string): Promise<void> {
    try {
      // Base64 decode
      let svgString = '';
      if (dataUri.includes('base64,')) {
        const base64Data = dataUri.split('base64,')[1];
        svgString = atob(base64Data);
      } else if (dataUri.includes(',')) {
        // URL encoded
        const encodedData = dataUri.split(',')[1];
        svgString = decodeURIComponent(encodedData);
      }
      
      if (svgString) {
        await this.loadFromRawSvg(svgString);
      } else {
        throw new Error('Data URI formatı geçersiz');
      }
    } catch (error) {
      console.warn('Data URI yüklenemedi:', error);
      this.iconSvg = null;
    }
  }

  /**
   * URL'den SVG yükle
   */
  private async loadFromUrl(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`SVG yüklenemedi: ${response.status}`);
      }
      
      const svgText = await response.text();
      await this.loadFromRawSvg(svgText);
    } catch (error) {
      console.warn('SVG URL yüklenemedi:', error);
      this.iconSvg = null;
    }
  }

  getIconName(): string {
    if (!this.iconName) {
      return '';
    }

    // Eğer icon adı zaten "iconSet:iconName" formatındaysa, olduğu gibi döndür
    if (this.iconName.includes(':')) {
      return this.iconName;
    }

    // Icon adını normalize et
    const normalizedName = this.iconName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Iconify formatı: iconSet:iconName
    // Örnek: simple-icons:github, logos:react, devicon:angular
    return `${this.iconSet}:${normalizedName}`;
  }
}
