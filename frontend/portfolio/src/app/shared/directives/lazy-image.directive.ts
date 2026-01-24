import { Directive, ElementRef, OnInit, inject } from '@angular/core';
import { AnimationService } from '../../core/services/animation.service';

@Directive({
  selector: 'img[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit {
  private el = inject(ElementRef<HTMLImageElement>);
  private animationService = inject(AnimationService);

  ngOnInit(): void {
    const img = this.el.nativeElement;
    const src = img.src;
    
    // Set placeholder
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E';
    img.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    
    // Load image
    const imageLoader = new Image();
    imageLoader.onload = () => {
      img.src = src;
      img.classList.remove('opacity-0');
      img.classList.add('opacity-100');
    };
    imageLoader.src = src;

    // Use Intersection Observer for lazy loading
    this.animationService.observeElement(img).subscribe(isVisible => {
      if (isVisible && !imageLoader.src) {
        imageLoader.src = src;
      }
    });
  }
}
