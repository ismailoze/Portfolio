# Frontend Ortam Değişkenleri

Angular uygulaması `src/environments/` içindeki `environment.*.ts` dosyalarını kullanır. `.env` dosyası varsayılan olarak okunmaz.

## Yapılandırma

- **Geliştirme:** `environment.development.ts` (ng serve ile kullanılır)
- **Production build:** `environment.ts` veya `angular.json` içindeki `fileReplacements` ile production kopyası

## Değişkenler

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `apiUrl` | Backend API base URL (`/api` dahil) | `http://localhost:5000/api` |
| `appName` | Uygulama adı | `Portfolio` |
| `cloudflareTurnstileSiteKey` | Cloudflare Turnstile site key (iletişim, login) | `0x...` |

## .env.example

`frontend/portfolio/.env.example` oluşturup aşağıdaki içeriği kullanın (dokümantasyon amaçlı; Angular `.env` okumaz, `environment.*.ts` kullanılır):

```
# API base URL (backend). /api suffix uygulama tarafından eklenir.
API_URL=http://localhost:5000

# Cloudflare Turnstile site key (iletisim, login). Boş bırakılabilir.
CLOUDFLARE_TURNSTILE_SITE_KEY=
```

Production'da `cloudflareTurnstileSiteKey` ve `apiUrl` ortama uygun ayarlanmalı; **gerçek key'ler repoda tutulmamalı**.
