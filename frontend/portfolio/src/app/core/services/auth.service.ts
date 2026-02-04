import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { LoginDto, RegisterDto, AuthResponse, RefreshTokenDto, User } from '../models/api.models';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  // Signals for reactive state
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  currentUser = this.currentUserSignal.asReadonly();
  
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user?.roles?.includes('Admin') ?? false;
  });

  constructor() {
    // Check token expiration on init
    this.checkTokenExpiration();
  }

  /**
   * Login kullanıcı
   */
  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/login', credentials).pipe(
      tap(response => {
        this.storeTokens(response);
        // JWT token'dan role bilgisini decode et
        const roles = this.decodeRolesFromToken(response.token);
        const user: User = {
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          roles: roles
        };
        this.currentUserSignal.set(user);
        this.storeUserWithRoles(user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Yeni kullanıcı kaydı
   */
  register(data: RegisterDto): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/register', data).pipe(
      tap(response => {
        this.storeTokens(response);
        // JWT token'dan role bilgisini decode et
        const roles = this.decodeRolesFromToken(response.token);
        const user: User = {
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          roles: roles
        };
        this.currentUserSignal.set(user);
        this.storeUserWithRoles(user);
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Token yenileme
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!refreshToken || !token) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const dto: RefreshTokenDto = { token, refreshToken };
    
    return this.apiService.post<AuthResponse>('auth/refresh', dto).pipe(
      tap(response => {
        this.storeTokens(response);
        // JWT token'dan role bilgisini decode et
        const roles = this.decodeRolesFromToken(response.token);
        const user: User = {
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          roles: roles
        };
        this.currentUserSignal.set(user);
        this.storeUserWithRoles(user);
      }),
      catchError(error => {
        console.error('Refresh token error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  /**
   * Token'ı al
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Refresh token'ı al
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Token'ları sakla
   */
  private storeTokens(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    
    // Token expiration'ı hesapla ve sakla
    if (response.expiresAt) {
      const expiresAt = new Date(response.expiresAt).getTime();
      localStorage.setItem('token_expires_at', expiresAt.toString());
    }
  }

  /**
   * Kullanıcı bilgilerini roles ile sakla
   */
  private storeUserWithRoles(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Kullanıcı bilgilerini sakla (eski method - geriye dönük uyumluluk için)
   */
  private storeUser(response: AuthResponse): void {
    const user: User = {
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Saklanan kullanıcı bilgisini al
   */
  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!userStr && !token) {
      return null;
    }
    
    let user: User | null = null;
    
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        user = null;
      }
    }
    
    // Eğer user yoksa ama token varsa, token'dan bilgi oluştur
    if (!user && token) {
      try {
        const roles = this.decodeRolesFromToken(token);
        user = { email: '', roles: roles };
      } catch {
        return null;
      }
    }
    
    // Eğer user varsa ama role bilgisi yoksa veya token'dan farklıysa, token'dan güncelle
    if (user && token) {
      const tokenRoles = this.decodeRolesFromToken(token);
      if (!user.roles || user.roles.length === 0 || JSON.stringify(user.roles) !== JSON.stringify(tokenRoles)) {
        user.roles = tokenRoles;
        this.storeUserWithRoles(user);
      }
    }
    
    return user;
  }

  /**
   * JWT token'dan role bilgisini decode et
   */
  private decodeRolesFromToken(token: string): string[] {
    try {
      // JWT token 3 parçadan oluşur: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid JWT token format');
        return ['User']; // Default role
      }

      // Payload'ı decode et (base64url)
      const payload = parts[1];
      // Base64URL decode (padding ekle gerekirse)
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      const decoded = atob(padded);
      const claims = JSON.parse(decoded);

      // Role claim'lerini bul
      const roles: string[] = [];
      
      // ASP.NET Core Identity genellikle bu claim'i kullanır
      const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      if (claims[roleClaimKey]) {
        const roleClaim = claims[roleClaimKey];
        if (Array.isArray(roleClaim)) {
          roles.push(...roleClaim);
        } else {
          roles.push(roleClaim);
        }
      }
      
      // Alternatif: "role" claim'i
      if (claims['role']) {
        const roleClaim = claims['role'];
        if (Array.isArray(roleClaim)) {
          roles.push(...roleClaim);
        } else {
          roles.push(roleClaim);
        }
      }

      // Alternatif: "roles" claim'i
      if (claims['roles']) {
        const roleClaim = claims['roles'];
        if (Array.isArray(roleClaim)) {
          roles.push(...roleClaim);
        } else {
          roles.push(roleClaim);
        }
      }

      // Eğer hiç role bulunamadıysa default role döndür
      return roles.length > 0 ? roles : ['User'];
    } catch (error) {
      console.error('Token decode error:', error);
      return ['User']; // Default role
    }
  }

  /**
   * Token expiration kontrolü
   */
  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (!token) {
      // Token yoksa ama user varsa, user'ı temizle
      const user = this.getStoredUser();
      if (user && !user.roles) {
        this.logout();
      }
      return;
    }

    // Token varsa role bilgisini güncelle
    const roles = this.decodeRolesFromToken(token);
    const storedUser = this.getStoredUser();
    if (storedUser) {
      storedUser.roles = roles;
      this.currentUserSignal.set(storedUser);
      this.storeUserWithRoles(storedUser);
    }

    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return;

    const expirationTime = parseInt(expiresAt, 10);
    const now = Date.now();
    const timeUntilExpiry = expirationTime - now;

    // Token 5 dakika içinde expire olacaksa refresh et
    if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
      this.refreshToken().subscribe({
        next: (response) => {
          // Refresh sonrası role bilgisini güncelle
          const newRoles = this.decodeRolesFromToken(response.token);
          const user = this.getStoredUser();
          if (user) {
            user.roles = newRoles;
            this.currentUserSignal.set(user);
            this.storeUserWithRoles(user);
          }
        },
        error: () => {
          // Refresh başarısız olursa logout
          this.logout();
        }
      });
    } else if (timeUntilExpiry <= 0) {
      // Token zaten expire olmuş
      this.logout();
    }
  }
}
