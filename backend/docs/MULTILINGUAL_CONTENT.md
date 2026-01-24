# Çok Dilli İçerik Yönetimi

Bu dokümantasyon, Projects ve Blogs için çok dilli içerik yönetimini açıklar.

## Mimari Yaklaşım

**Translation Entity Pattern** kullanılmaktadır. Her entity için ayrı translation tabloları oluşturulmuştur:

- `ProjectTranslation` - Proje çevirileri
- `BlogPostTranslation` - Blog yazısı çevirileri

## Veri Yapısı

### Project Entity
- **Ortak alanlar** (dil bağımsız):
  - `GitHubUrl`
  - `LiveUrl`
  - `ImageUrl`
  - `IsPublished`
  - `DisplayOrder`

- **Çevrilen alanlar** (dil bağımlı):
  - `Title`
  - `Description`
  - `Technologies`

### BlogPost Entity
- **Ortak alanlar** (dil bağımsız):
  - `PublishedAt`
  - `IsPublished`
  - `FeaturedImageUrl`

- **Çevrilen alanlar** (dil bağımlı):
  - `Title`
  - `Content`
  - `Excerpt`
  - `Slug`

## Kullanım Senaryoları

### Senaryo 1: Manuel Yönetim (Önerilen)

**Admin panelinde:**
1. Proje/Blog oluştururken veya düzenlerken
2. Her dil için ayrı form sekmesi gösterilir
3. Kullanıcı her dil için içeriği manuel olarak girer

**Avantajlar:**
- Tam kontrol
- Çeviri kalitesi garantisi
- SEO optimizasyonu (her dil için özel slug)

**Dezavantajlar:**
- Daha fazla iş yükü
- Her dil için ayrı giriş gerekiyor

### Senaryo 2: Otomatik Çeviri + Manuel Düzenleme

**Admin panelinde:**
1. Türkçe içerik girilir
2. "İngilizce'ye Çevir" butonuna tıklanır
3. Google Translate API veya benzeri servis kullanılır
4. Çeviri gösterilir, kullanıcı düzenleyebilir

**Avantajlar:**
- Hızlı başlangıç
- Daha az manuel iş

**Dezavantajlar:**
- API maliyeti
- Çeviri kalitesi kontrolü gerekir

## API Endpoints

### Projects

```
GET /api/projects?lang=tr
GET /api/projects?lang=en
POST /api/projects
  Body: {
    translations: [
      { languageCode: "tr", title: "...", description: "..." },
      { languageCode: "en", title: "...", description: "..." }
    ],
    githubUrl: "...",
    ...
  }
PUT /api/projects/{id}
  Body: {
    translations: [...],
    ...
  }
```

### Blog Posts

```
GET /api/blogposts?lang=tr
GET /api/blogposts?lang=en
POST /api/blogposts
  Body: {
    translations: [
      { languageCode: "tr", title: "...", content: "...", slug: "..." },
      { languageCode: "en", title: "...", content: "...", slug: "..." }
    ],
    ...
  }
```

## Frontend Yönetim Arayüzü

Admin panelinde form şu şekilde olmalı:

```
┌─────────────────────────────────────┐
│ Proje Oluştur / Düzenle             │
├─────────────────────────────────────┤
│ [TR] [EN]  ← Dil sekmeleri          │
├─────────────────────────────────────┤
│ Türkçe İçerik:                      │
│ ┌─────────────────────────────────┐ │
│ │ Başlık: [____________]          │ │
│ │ Açıklama: [____________]         │ │
│ │ Teknolojiler: [____________]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Ortak Bilgiler:                    │
│ ┌─────────────────────────────────┐ │
│ │ GitHub URL: [____________]      │ │
│ │ Live URL: [____________]        │ │
│ │ Görsel URL: [____________]      │ │
│ │ Yayınlandı: [ ]                 │ │
│ │ Sıra: [__]                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Veritabanı İlişkileri

```
Project (1) ──< (N) ProjectTranslation
BlogPost (1) ──< (N) BlogPostTranslation
```

Her Project/BlogPost için her dilde (tr, en) bir translation kaydı olabilir.

## Migration

Yeni migration oluşturmak için:

```bash
dotnet ef migrations add AddTranslationTables --project Portfolio.Infrastructure --startup-project Portfolio.Api
```

## Notlar

- Mevcut Project ve BlogPost kayıtları için migration script'i gerekebilir
- Eski `Title`, `Description` alanları migration ile `ProjectTranslation` tablosuna taşınabilir
- Veya yeni sistemde sadece translation tablosu kullanılabilir (eski alanlar deprecated olur)
