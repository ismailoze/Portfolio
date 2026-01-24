# Testing Guide - Portfolio Application

Bu dokümantasyon, Portfolio uygulaması için test stratejisi ve test çalıştırma talimatlarını içerir.

## 📋 Test Stratejisi

### Backend Testleri

**Test Framework:** xUnit  
**Mocking:** Moq  
**Assertions:** FluentAssertions

#### Test Kategorileri

1. **Unit Tests** (`Portfolio.Application.Tests`)

   - Validator testleri (FluentValidation)
   - DTO validation testleri
   - Business logic testleri

2. **Integration Tests** (`Portfolio.Api.Tests`)

   - Controller testleri
   - API endpoint testleri
   - Middleware testleri

3. **Infrastructure Tests** (`Portfolio.Infrastructure.Tests`)
   - Service implementasyon testleri
   - JWT token service testleri
   - Email service testleri

### Frontend Testleri

**Test Framework:** Jasmine + Karma  
**Testing Utilities:** Angular Testing Utilities

#### Test Kategorileri

1. **Service Tests**

   - AuthService
   - ApiService
   - ThemeService
   - SEO Service

2. **Component Tests**

   - Feature component'leri
   - Shared component'leri
   - Layout component'leri

3. **Guard Tests**

   - AuthGuard
   - AdminGuard

4. **Interceptor Tests**
   - JwtInterceptor
   - ErrorInterceptor

## 🚀 Test Çalıştırma

### Backend Testleri

```bash
# Tüm testleri çalıştır
cd backend
dotnet test

# Belirli bir test projesini çalıştır
dotnet test tests/Portfolio.Application.Tests

# Verbose output ile
dotnet test --verbosity normal

# Coverage raporu ile
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

### Frontend Testleri

```bash
# Tüm testleri çalıştır
cd frontend/src/portfolio
npm test

# Watch mode
npm test -- --watch

# Coverage raporu ile
npm test -- --code-coverage

# Headless mode (CI için)
npm test -- --watch=false --browsers=ChromeHeadless
```

## 📊 Test Coverage Hedefleri

- **Critical Path Coverage:** %100
- **Business Logic:** %90+
- **Services:** %85+
- **Controllers:** %80+

## 🧪 Critical Path Testleri

### Backend

1. **Authentication Flow**

   - ✅ Login validation
   - ✅ Register validation
   - ✅ JWT token generation
   - ✅ AuthController endpoints

2. **Validation**
   - ✅ LoginDto validation
   - ✅ RegisterDto validation
   - ✅ CreateProjectDto validation

### Frontend

1. **Authentication Flow**

   - ✅ Login service
   - ✅ Register service
   - ✅ Token management
   - ✅ Auth guard

2. **API Integration**
   - ✅ ApiService methods
   - ✅ Projects component
   - ✅ Contact form submission

## 📝 Test Yazma Kuralları

### Backend

- Test dosyaları `*Tests.cs` formatında
- Her test method'u `[Fact]` attribute ile işaretlenmeli
- Test method isimleri açıklayıcı olmalı: `MethodName_Scenario_ExpectedResult`
- Arrange-Act-Assert pattern kullanılmalı
- FluentAssertions kullanılmalı

### Frontend

- Test dosyaları `*.spec.ts` formatında
- `describe` ve `it` blokları kullanılmalı
- Test isimleri açıklayıcı olmalı
- Mock'lar için Jasmine spies kullanılmalı
- HTTP testing için `HttpClientTestingModule` kullanılmalı

## 🔍 Test Örnekleri

### Backend Unit Test Örneği

```csharp
[Fact]
public void LoginDtoValidator_ValidInput_ShouldPass()
{
    // Arrange
    var validator = new LoginDtoValidator();
    var dto = new LoginDto("test@example.com", "Password123!");

    // Act
    var result = validator.Validate(dto);

    // Assert
    result.IsValid.Should().BeTrue();
}
```

### Frontend Component Test Örneği

```typescript
it("should load projects on init", () => {
  // Arrange
  const mockProjects = [{ id: "1", title: "Test Project" }];
  projectService.getPublishedProjects.and.returnValue(of(mockProjects));

  // Act
  component.ngOnInit();
  fixture.detectChanges();

  // Assert
  expect(component.projects()).toEqual(mockProjects);
});
```

## 🐛 Debugging Tests

### Backend

```bash
# Debug mode ile test çalıştır
dotnet test --logger "console;verbosity=detailed"
```

### Frontend

```bash
# Karma debug mode
npm test -- --watch --browsers=Chrome
```

## 📈 CI/CD Integration

Testler GitHub Actions pipeline'ında otomatik çalışır:

- **Backend:** Her push/PR'da backend testleri çalışır
- **Frontend:** Her push/PR'da frontend testleri çalışır
- **Coverage:** Coverage raporları CI'da oluşturulur

## 🔄 Test Maintenance

- Test'ler kod değişikliklerinden sonra güncellenmeli
- Broken test'ler hemen düzeltilmeli
- Test coverage düşerse yeni test'ler eklenmeli
- Flaky test'ler tespit edilip düzeltilmeli
