import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  /**
   * Intersection Observer ile scroll animation helper
   */
  observeElement(element: HTMLElement, options?: IntersectionObserverInit): Observable<boolean> {
    return new Observable(observer => {
      const intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            observer.next(entry.isIntersecting);
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px',
          ...options
        }
      );

      intersectionObserver.observe(element);

      return () => {
        intersectionObserver.disconnect();
      };
    });
  }

  /**
   * Scroll event'i dinle (debounced)
   */
  onScroll(debounceMs: number = 100): Observable<Event> {
    return fromEvent(window, 'scroll').pipe(
      debounceTime(debounceMs)
    );
  }

  /**
   * Scroll position'ı al
   */
  getScrollPosition(): number {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  /**
   * Smooth scroll to element
   */
  scrollToElement(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Scroll to top
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Element'in viewport'ta görünür olup olmadığını kontrol et
   */
  isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
