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
│   ├── src/
│   │   └── portfolio/              # Angular Application
│   └── tests/                      # Frontend Tests
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
cd frontend/src/portfolio

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
cd frontend/src/portfolio
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

`frontend/src/portfolio/.env` dosyası oluşturun:

```env
API_URL=http://localhost:5000
```

## 🐳 Docker

### Docker Compose ile Local Development

```bash
docker-compose up -d
```

Bu komut PostgreSQL ve backend servislerini başlatır.

## 🔒 Güvenlik

- ✅ Secrets asla commit edilmez
- ✅ Environment variables kullanılır
- ✅ JWT token'lar güvenli şekilde saklanır
- ✅ Input validation (FluentValidation)
- ✅ SQL Injection koruması (EF Core parameterized queries)
- ✅ CORS yapılandırması

## 📋 API Dokümantasyonu

Swagger UI: `https://localhost:5001/swagger` (Development ortamında)

## 🔄 CI/CD

GitHub Actions ile otomatik build ve test:

- **Backend CI**: Her push/PR'da backend testleri çalışır
- **Frontend CI**: Her push/PR'da frontend build ve testleri çalışır
- **Deploy**: `main` branch'e push veya tag oluşturulduğunda deployment tetiklenir

### Deployment Trigger

- `[deploy-backend]` commit mesajı ile backend deployment
- `[deploy-frontend]` commit mesajı ile frontend deployment
- `v*` tag'leri ile her iki servis deployment

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
