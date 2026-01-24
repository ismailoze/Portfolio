---
name: Portfolio Uygulaması Planı
overview: ASP.NET Core 9 Web API backend ve Angular v20 frontend ile modern, animasyonlu portfolio uygulaması geliştirme planı. Admin paneli, CMS API'leri ve JWT authentication içerir.
todos:
  - id: backend-setup
    content: Backend solution yapısını oluştur (Portfolio.Api, Portfolio.Application, Portfolio.Domain, Portfolio.Infrastructure), NuGet paketlerini kur ve base configuration yap
    status: completed
  - id: domain-models
    content: Domain entity'lerini tanımla (User, Project, BlogPost, WorkExperience, Education, Skill, ContactMessage) ve value object'leri oluştur
    status: completed
    dependencies:
      - backend-setup
  - id: database-setup
    content: EF Core DbContext, migrations ve seed data oluştur
    status: completed
    dependencies:
      - domain-models
  - id: application-layer
    content: Application layer'da Result pattern, service'ler, DTO'lar ve validation kurallarını implement et
    status: completed
    dependencies:
      - database-setup
  - id: auth-system
    content: JWT authentication ve Identity sistemini kur, AuthController ve token management'ı implement et
    status: completed
    dependencies:
      - application-layer
  - id: api-controllers
    content: API controller'larını oluştur (Projects, Blog, Experience, Education, Skills, Contact, Admin), middleware'leri ekle ve Swagger yapılandır
    status: completed
    dependencies:
      - auth-system
  - id: frontend-setup
    content: Angular v20 projesini oluştur, core services (AuthService, ApiService, ThemeService), interceptors ve guards yapılandır
    status: completed
  - id: frontend-routing
    content: Routing yapısını kur (home, about, projects, blog, experience, education, skills, contact, admin), lazy loading ve route guards ekle
    status: completed
    dependencies:
      - frontend-setup
  - id: ui-components
    content: Layout component'lerini (Header, Footer) ve shared component'leri oluştur, theme system (dark/light mode) implement et
    status: completed
    dependencies:
      - frontend-routing
  - id: feature-components
    content: Feature component'lerini oluştur (Home, About, Projects, Blog, Experience, Education, Skills, Contact, Admin)
    status: completed
    dependencies:
      - ui-components
  - id: animations-effects
    content: CSS animations, Angular animations, scroll effects, hover effects ve modern UI tricks'leri implement et
    status: completed
    dependencies:
      - feature-components
  - id: api-integration
    content: Frontend'de API entegrasyonunu tamamla, error handling ve loading states ekle
    status: completed
    dependencies:
      - api-controllers
      - feature-components
  - id: responsive-polish
    content: Responsive design iyileştirmeleri, performance optimization ve SEO meta tags ekle
    status: completed
    dependencies:
      - api-integration
  - id: testing
    content: Backend ve frontend için unit test'ler yaz, critical path'ler için integration test'ler ekle
    status: completed
    dependencies:
      - responsive-polish
  - id: deployment
    content: Dockerfile, CI/CD pipeline ve deployment configuration hazırla
    status: pending
    dependencies:
      - testing
---

# Portfolio Uygulaması - Geliştirme Planı

## Mimari Karar

**Seçilen Mimari:** Layered + Boundaries (Ports & Adapters Lite)

**Architecture Complexity Score (ACS):** 6/10

- Business rules karmaşıklığı: 1/2 (orta - içerik yönetimi)
- External integrations: 1/2 (DB + email service)
- Use-case sayısı: 2/2 (Projects, Blog, Experience, Education, Skills, Contact, Admin)
- Maintenance süresi: 1/2 (orta süreli)
- Entrypoint sayısı: 1/2 (Web API)

**Nedenler:**

- Domain karmaşıklığı Clean Architecture'ı gerektirmiyor
- Application ve Infrastructure katmanları ayrılacak
- Interface'ler sadece external dependency'ler için kullanılacak
- Feature-based organization ile modüler yapı

**Klasör Yapısı:**

```
Portfolio/
├── backend/
│   ├── Portfolio.Api/          # Presentation (Controllers, Middleware)
│   ├── Portfolio.Application/   # Business Logic (Services, DTOs)
│   ├── Portfolio.Domain/        # Domain Models, Entities
│   ├── Portfolio.Infrastructure/# Data Access, External Services
│   └── Portfolio.Shared/         # Common utilities
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/            # Services, guards, interceptors
    │   │   ├── features/        # Feature modules
    │   │   ├── shared/          # Shared components
    │   │   └── layout/          # Layout components
    │   └── assets/
    └── styles/                  # Global styles, animations
```

## Backend (ASP.NET Core 9 Web API)

### 1. Proje Yapısı ve Bağımlılıklar

**Ana Projeler:**

- `Portfolio.Api` - Web API projesi (.NET 9)
- `Portfolio.Application` - Application layer
- `Portfolio.Domain` - Domain entities ve value objects
- `Portfolio.Infrastructure` - EF Core, Identity, Email services

**NuGet Paketleri:**

- `Microsoft.EntityFrameworkCore.SqlServer` / `PostgreSQL`
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `FluentValidation`
- `AutoMapper`
- `Serilog` (structured logging)
- `Swashbuckle.AspNetCore` (Swagger)

### 2. Domain Model

**Entity'ler:**

- `User` (Identity'den extend)
- `Project` (Title, Description, Technologies, GitHubUrl, LiveUrl, ImageUrl, IsPublished, CreatedAt)
- `BlogPost` (Title, Content, Excerpt, Slug, PublishedAt, IsPublished, Tags)
- `WorkExperience` (Company, Position, StartDate, EndDate, Description, Technologies)
- `Education` (Institution, Degree, Field, StartDate, EndDate, Description)
- `Skill` (Name, Category, Level, Icon)
- `ContactMessage` (Name, Email, Subject, Message, CreatedAt, IsRead)

**Value Objects:**

- `Email`, `Url`, `DateRange`

### 3. Application Layer

**Features:**

- `Projects/` - GetProjects, GetProject, CreateProject, UpdateProject, DeleteProject
- `Blog/` - GetPosts, GetPost, CreatePost, UpdatePost, DeletePost
- `Experience/` - GetExperiences, CreateExperience, UpdateExperience, DeleteExperience
- `Education/` - GetEducations, CreateEducation, UpdateEducation, DeleteEducation
- `Skills/` - GetSkills, CreateSkill, UpdateSkill, DeleteSkill
- `Contact/` - SendMessage, GetMessages, MarkAsRead
- `Auth/` - Login, Register, RefreshToken

**Pattern'ler:**

- Result<T> pattern (exception-free business logic)
- CQRS-lite (Commands ve Queries ayrımı)
- Mediator pattern (MediatR opsiyonel, basit projeler için service'ler yeterli)

### 4. Infrastructure Layer

**Implementations:**

- `ApplicationDbContext` (EF Core)
- `IEmailService` → `SmtpEmailService`
- `IJwtTokenService` → `JwtTokenService`
- Repository pattern (sadece gerekli yerlerde, EF Core DbContext genelde yeterli)

### 5. API Layer

**Controllers:**

- `ProjectsController` - Public ve Admin endpoints
- `BlogController` - Public ve Admin endpoints
- `ExperienceController`, `EducationController`, `SkillsController`
- `ContactController` - Public submit, Admin list
- `AuthController` - Login, Register, Refresh
- `AdminController` - Dashboard stats

**Middleware:**

- Exception handling middleware (Result → HTTP response mapping)
- Request logging middleware
- CORS configuration

**Configuration:**

- `appsettings.json` + `appsettings.Development.json`
- Environment variables için `IConfiguration`
- JWT settings, DB connection string, Email settings

### 6. Security & Validation

- JWT authentication (Access + Refresh tokens)
- Role-based authorization (Admin, User)
- Input validation (FluentValidation)
- SQL injection koruması (EF Core parameterized queries)
- CORS policy
- Rate limiting (opsiyonel)

## Frontend (Angular v20)

### 1. Proje Yapısı

**Angular CLI ile:**

```bash
ng new frontend --routing --style=scss --standalone
```

**Modül Yapısı:**

- Standalone components (Angular v20 best practice)
- Feature-based organization
- Lazy loading routes

### 2. Core Services

**Services:**

- `AuthService` - Login, logout, token management
- `ApiService` - HTTP client wrapper, base URL, interceptors
- `ThemeService` - Dark/Light mode toggle
- `AnimationService` - Reusable animation utilities

**Interceptors:**

- `AuthInterceptor` - JWT token ekleme
- `ErrorInterceptor` - Error handling ve toast notifications

**Guards:**

- `AuthGuard` - Protected routes
- `AdminGuard` - Admin-only routes

### 3. Features

**Feature Modules:**

- `home/` - Landing page, hero section
- `about/` - Hakkımda sayfası
- `projects/` - Proje listesi ve detay
- `blog/` - Blog post listesi ve detay
- `experience/` - İş deneyimi timeline
- `education/` - Eğitim bilgileri
- `skills/` - Yetenekler showcase
- `contact/` - İletişim formu
- `admin/` - Admin dashboard (lazy loaded)

**Component Yapısı:**

- Her feature kendi component'lerini içerir
- Shared components `shared/` altında
- Layout components `layout/` altında (Header, Footer, Sidebar)

### 4. UI/UX & Animations

**CSS Framework:**

- Custom SCSS (CSS Variables ile theming)
- Modern CSS features (Grid, Flexbox, Custom Properties)
- CSS Animations + Angular Animations

**Animasyon Teknikleri:**

- **Scroll Animations:** Intersection Observer API ile fade-in, slide-up
- **Page Transitions:** Route animations (fade, slide)
- **Hover Effects:** 3D transforms, scale, glow effects
- **Loading States:** Skeleton loaders, progress indicators
- **Micro-interactions:** Button ripples, card flips, typing animations

**Özel Efektler:**

- Gradient backgrounds (animated)
- Glassmorphism (frosted glass effect)
- Particle effects (canvas/WebGL)
- Parallax scrolling
- Smooth scroll behavior
- Image lazy loading with blur-up

**Responsive Design:**

- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly interactions

### 5. State Management

**Strateji:**

- Server state: Angular Signals + HTTP (native)
- Client/UI state: Signals veya minimal service-based state
- Redux/Zustand gerekmez (basit portfolio için)

### 6. Styling Architecture

**SCSS Yapısı:**

```
styles/
├── abstracts/
│   ├── _variables.scss    # Colors, spacing, typography
│   ├── _mixins.scss       # Reusable mixins
│   └── _functions.scss
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _utilities.scss
├── components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   └── _forms.scss
├── layouts/
│   ├── _header.scss
│   └── _footer.scss
└── animations/
    ├── _fade.scss
    ├── _slide.scss
    └── _hover.scss
```

**Theming:**

- CSS Variables ile dark/light mode
- Color palette: Primary, Secondary, Accent, Background, Text
- Smooth theme transitions

### 7. Third-Party Libraries

**Önerilen:**

- `@angular/animations` - Built-in animations
- `rxjs` - Reactive programming (built-in)
- `ngx-toastr` - Toast notifications (opsiyonel)
- `marked` - Markdown parsing (blog için)

**Kaçınılacak:**

- Ağır UI framework'ler (Material, Bootstrap) - Custom design için
- Gereksiz state management kütüphaneleri

## Veritabanı Tasarımı

**Entity Relationships:**

- `User` 1:N `Project`, `BlogPost`, `ContactMessage`
- `Project` N:M `Skill` (Many-to-Many)
- `BlogPost` N:M `Tag` (Many-to-Many, opsiyonel)

**Migrations:**

- EF Core Code-First migrations
- Seed data (initial admin user, sample data)

## Deployment & CI/CD

**Backend:**

- Dockerfile (multi-stage build)
- Docker Compose (dev environment)
- Production: Azure App Service / AWS / VPS

**Frontend:**

- Angular build (production optimization)
- Static hosting: Vercel, Netlify, Azure Static Web Apps
- CDN için asset optimization

**CI/CD:**

- GitHub Actions / Azure DevOps
- Automated tests
- Build ve deploy pipelines

## Güvenlik Önlemleri

- JWT token expiration ve refresh mechanism
- HTTPS only (production)
- Input sanitization
- XSS protection (Angular built-in)
- CSRF tokens
- Rate limiting (API endpoints)
- Environment variables için secrets management

## Test Stratejisi

**Backend:**

- Unit tests (Application layer)
- Integration tests (API endpoints)
- xUnit / NUnit

**Frontend:**

- Component tests (Angular Testing Library)
- E2E tests (Playwright / Cypress) - Critical paths

## Dokümantasyon

- README.md (her proje için)
- API documentation (Swagger/OpenAPI)
- Architecture Decision Record (ADR) - Mimari seçimler için
- Deployment guide

## Geliştirme Adımları (Yüksek Seviye)

1. **Backend Setup:**

   - Solution ve proje yapısı oluşturma
   - EF Core ve Identity kurulumu
   - JWT authentication setup
   - Base API structure

2. **Domain & Database:**

   - Entity'lerin tanımlanması
   - DbContext configuration
   - Initial migration ve seed data

3. **Application Layer:**

   - Result pattern implementation
   - Service'ler ve DTO'lar
   - Validation rules

4. **API Layer:**

   - Controller'lar
   - Middleware'ler
   - Swagger configuration

5. **Frontend Setup:**

   - Angular projesi oluşturma
   - Core services ve interceptors
   - Routing yapısı
   - Theme system

6. **UI Components:**

   - Layout components
   - Feature components
   - Shared components
   - Animations

7. **Integration:**

   - API entegrasyonu
   - Error handling
   - Loading states

8. **Polish:**

   - Animasyonlar ve efektler
   - Responsive design
   - Performance optimization
   - SEO (meta tags, structured data)

9. **Testing & Deployment:**

   - Test yazımı
   - CI/CD setup
   - Production deployment
