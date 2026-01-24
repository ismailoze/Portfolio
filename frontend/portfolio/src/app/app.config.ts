import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  provideTranslateService
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

// Custom HTTP Loader
export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix = '/assets/i18n/',
    private suffix = '.json'
  ) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`).pipe(
      map((response) => response)
    );
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    provideAnimations(),

    // ✅ ngx-translate (Angular 20 uyumlu)
    ...provideTranslateService({
      defaultLanguage: 'tr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
};