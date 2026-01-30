# Portfolio Application

Modern portfolio uygulaması - ASP.NET Core Web API (.NET 9) backend ve Angular v20 frontend.

## 🏗️ Mimari

- **Backend**: Clean Architecture (Domain, Application, Infrastructure, API)
- **Frontend**: Angular v20 (Standalone Components)
- **Database**: PostgreSQL
- **Authentication**: JWT + ASP.NET Core Identity
- **CI/CD**: GitHub Actions

## 📁 Proje Yapısı

```
Portfolio/
├── backend/
│   ├── src/
│   │   ├── Portfolio.Api/          # API Layer (Controllers, Middleware)
│   │   ├── Portfolio.Application/  # Application Layer (Services, DTOs, Validators)
│   │   ├── Portfolio.Domain/      # Domain Layer (Entities, Value Objects)
│   │   └── Portfolio.Infrastructure/ # Infrastructure Layer (Data, Services)
│   └── tests/                      # Unit & Integration Tests
├── frontend/
│   └── portfolio/                  # Angular Application (içinde src/, assets/, vb.)
└── .github/
    └── workflows/                  # CI/CD Pipelines
```

## 🚀 Geliştirme

### Gereksinimler

- .NET 9 SDK
- Node.js 22.x
- PostgreSQL 16+
- Git

### Backend

```bash
# Projeye git
cd backend

# Bağımlılıkları yükle
dotnet restore

# Projeyi derle
dotnet build

# Migration oluştur
dotnet ef migrations add <MigrationName> --project src/Portfolio.Infrastructure --startup-project src/Portfolio.Api

# Veritabanını güncelle
dotnet ef database update --project src/Portfolio.Infrastructure --startup-project src/Portfolio.Api

# Uygulamayı çalıştır
dotnet run --project src/Portfolio.Api
```

Backend API: `https://localhost:5001` veya `http://localhost:5000`

### Frontend

```bash
# Projeye git
cd frontend/portfolio

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm start
```

Frontend: `http://localhost:4600`

## 🧪 Test

### Backend Testleri

```bash
cd backend
dotnet test
```

### Frontend Testleri

```bash
cd frontend/portfolio
npm test
```

## 📝 Environment Variables

### Backend

`backend/src/Portfolio.Api/appsettings.Development.json` dosyasını düzenleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=portfoliodb;Username=postgres;Password=postgres;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "PortfolioApi",
    "Audience": "PortfolioClient",
    "ExpirationInMinutes": 60
  }
}
```

### Frontend

`frontend/portfolio/.env` dosyası oluşturun (veya `src/environments/` ile `docs/ENV.md`'e bakın):

```env
API_URL=http://localhost:5000
```

## 🐳 Docker

### Docker Compose ile Çalıştırma (Migration + Backend + Frontend)

Tüm stack (PostgreSQL, backend API, Angular frontend) container içinde çalışır. Backend `ASPNETCORE_ENVIRONMENT=Development` ile ayağa kalktığında **migration otomatik uygulanır** ve **seed** çalışır.

```bash
docker compose up --build
```

**Erişim adresleri**

| Servis    | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:4200    |
| Backend   | http://localhost:5000    |
| Swagger   | http://localhost:5000/swagger |
| PostgreSQL| localhost:5432 (portfoliodb, postgres/postgres) |

**Frontend build-arg’ları** (`docker-compose.yml` veya `.env` ile override):

| Argüman       | Varsayılan               | Açıklama                          |
|---------------|--------------------------|-----------------------------------|
| `API_URL`     | `http://localhost:5000/api` | Angular’ın API base URL’i      |
| `TURNSTILE_KEY` | `""`                  | Cloudflare Turnstile site key     |

Örnek (Turnstile key ile build):

```bash
docker compose build --build-arg TURNSTILE_KEY=0x4AAAAAACMTTzk8JtZDxBxd frontend
docker compose up -d
```

Arka planda çalıştırmak: `docker compose up -d --build`

## 🔒 Güvenlik

- ✅ Secrets asla commit edilmez
- ✅ Environment variables kullanılır
- ✅ JWT token'lar güvenli şekilde saklanır
- ✅ Input validation (FluentValidation)
- ✅ SQL Injection koruması (EF Core parameterized queries)
- ✅ CORS yapılandırması

## 📋 API Dokümantasyonu

Swagger UI: `https://localhost:5001/swagger` (Development ortamında)

## 🔄 CI/CD (GitHub Actions)

GitHub Actions ile otomatik build, test ve isteğe bağlı deploy.

- **Backend CI** (`ci-backend.yml`): `main`/`develop` push veya PR; sadece `backend/**` değişince. Build + test (PostgreSQL service).
- **Frontend CI** (`ci-frontend.yml`): `main`/`develop` push veya PR; sadece `frontend/**` değişince. Lint, build, test.
- **Deploy** (`cd.yml`): `main` push veya `v*` tag; ayrıca **Actions → Deploy → Run workflow** ile manuel.

### Tetikleyiciler

| Tetikleyici | Backend | Frontend |
|-------------|---------|----------|
| Commit mesajında `[deploy-backend]` | ✅ | — |
| Commit mesajında `[deploy-frontend]` | — | ✅ |
| `v*` tag (örn. `v1.0.0`) | ✅ | ✅ |
| Manuel: **Actions → Deploy** → target: `backend` / `frontend` / `both` | Seçime göre | Seçime göre |

### Dokümantasyon ve badge

- Detaylar, secrets ve deploy adımları: [**.github/GITHUB_ACTIONS.md**](.github/GITHUB_ACTIONS.md)
- Durum rozetleri (README’ye ekleyebilirsiniz; `OWNER/REPO` kendi reponuzla değiştirin):

  ```markdown
  [![Backend CI](https://github.com/OWNER/REPO/actions/workflows/ci-backend.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci-backend.yml)
  [![Frontend CI](https://github.com/OWNER/REPO/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci-frontend.yml)
  ```

## 📄 Lisans

MIT License

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Sorularınız için issue açabilirsiniz.
