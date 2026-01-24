import { Directive, ElementRef, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { AnimationService } from '../../core/services/animation.service';

@Directive({
  selector: '[appScrollAnimation]',
  standalone: true
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private animationService = inject(AnimationService);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const element = this.el.nativeElement;
    
    // Add initial hidden state
    element.classList.add('scroll-reveal');

    // Observe element
    this.animationService.observeElement(element, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }).subscribe(isVisible => {
      if (isVisible) {
        element.classList.add('revealed');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
