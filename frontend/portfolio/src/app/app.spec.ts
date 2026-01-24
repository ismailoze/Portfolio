import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { App } from './app';
import { I18nService } from './core/services/i18n.service';
import { ThemeService } from './core/services/theme.service';

const fakeLoader: TranslateLoader = {
  getTranslation: () => of({})
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideTranslateService({
          defaultLanguage: 'tr',
          loader: { provide: TranslateLoader, useValue: fakeLoader }
        }),
        { provide: I18nService, useValue: { currentLanguage: () => 'tr' } },
        { provide: ThemeService, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain router-outlet and app-toast', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-toast')).toBeTruthy();
  });
});
