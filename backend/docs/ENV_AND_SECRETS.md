# Ortam Değişkenleri ve Gizliler (Backend)

Bu doküman, Portfolio API için gizli değerlerin ve ortam ayarlarının nasıl yönetileceğini açıklar.

## ⚠️ Güvenlik Uyarısı

**Eğer `appsettings.json` veya `appsettings.Development.json` dosyaları daha önce gerçek parola/secret ile commit edildiyse:**
- Tüm ilgili secret'ları **hemen rotate edin** (veritabanı şifresi, JWT SecretKey, Cloudflare Turnstile, SMTP App Password).
- Git geçmişinden bu dosyaları kaldırmak için `git filter-repo` veya BFG Repo-Cleaner kullanılabilir.

---

## Geliştirme Ortamı: User Secrets

`appsettings.Development.json` repoda **takip edilmez**. Yerel geliştirme için:

**Mevcut repoda** bu dosya daha önce commit edildiyse, takipten çıkarmak için (yerel kopya kalır):
```bash
git rm --cached backend/src/Portfolio.Api/appsettings.Development.json
```

1. **Örnek dosyayı kopyalayın:**
   ```bash
   cp src/Portfolio.Api/appsettings.Development.Example.json src/Portfolio.Api/appsettings.Development.json
   ```

2. **User Secrets ile gizli değerleri ayarlayın** (önerilen):
   ```bash
   cd backend
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=portfoliodb;Username=postgres;Password=postgres;" --project src/Portfolio.Api
   dotnet user-secrets set "JwtSettings:SecretKey" "EnAz32KarakterUzunlugundaBirGizliAnahtar!" --project src/Portfolio.Api
   dotnet user-secrets set "CloudflareTurnstile:SecretKey" "0x..." --project src/Portfolio.Api
   dotnet user-secrets set "CloudflareTurnstile:SiteKey" "0x..." --project src/Portfolio.Api
   dotnet user-secrets set "SmtpSettings:Username" "your@gmail.com" --project src/Portfolio.Api
   dotnet user-secrets set "SmtpSettings:Password" "app-password" --project src/Portfolio.Api
   dotnet user-secrets set "SmtpSettings:FromEmail" "your@gmail.com" --project src/Portfolio.Api
   ```

   Alternatif: `appsettings.Development.json` içine doğrudan yazabilirsiniz; bu dosya `.gitignore`'da olduğu için commit edilmez.

---

## Üretim: Ortam Değişkenleri

ASP.NET Core, `__` (çift alt çizgi) ile hierarchy okur. Örnek env değişkenleri:

| Ortam Değişkeni | Açıklama |
|-----------------|----------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string |
| `JwtSettings__SecretKey` | JWT imza için en az 32 karakter |
| `JwtSettings__Issuer` | JWT Issuer (ör. PortfolioApi) |
| `JwtSettings__Audience` | JWT Audience |
| `CloudflareTurnstile__SecretKey` | Cloudflare Turnstile secret |
| `CloudflareTurnstile__SiteKey` | Cloudflare Turnstile site key (frontend ile paylaşılır) |
| `SmtpSettings__Host` | SMTP sunucu |
| `SmtpSettings__Port` | SMTP port (ör. 587) |
| `SmtpSettings__Username` | SMTP kullanıcı |
| `SmtpSettings__Password` | SMTP uygulama şifresi |
| `SmtpSettings__FromEmail` | Gönderici e-posta |

Docker örneği:
```yaml
environment:
  ConnectionStrings__DefaultConnection: "Host=db;Port=5432;Database=portfoliodb;Username=...;Password=...;"
  JwtSettings__SecretKey: "${JWT_SECRET}"
  CloudflareTurnstile__SecretKey: "${CF_TURNSTILE_SECRET}"
  CloudflareTurnstile__SiteKey: "${CF_TURNSTILE_SITE_KEY}"
```

---

## appsettings.json İçeriği

`appsettings.json` repoda **placeholders** ile bulunur. Gerçek değerler User Secrets (Development) veya ortam değişkenleri (Production) ile override edilir.
