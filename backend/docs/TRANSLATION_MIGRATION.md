# Translation Migration Rehberi

## Migration Oluşturma

Translation tablolarını eklemek için migration oluşturun:

```bash
cd backend/src/Portfolio.Api
dotnet ef migrations add AddTranslationTables --project ../Portfolio.Infrastructure --startup-project .
```

## Migration Sonrası

### 1. Mevcut Verileri Taşıma (Opsiyonel)

Eğer mevcut Project ve BlogPost kayıtlarınız varsa, bunları translation tablolarına taşımak için bir migration script'i oluşturulabilir.

**Örnek SQL Script:**

```sql
-- Mevcut Project kayıtlarını translation tablosuna taşı
INSERT INTO "ProjectTranslations" ("Id", "ProjectId", "LanguageCode", "Title", "Description", "Technologies", "CreatedAt", "UpdatedAt")
SELECT 
    gen_random_uuid(),
    "Id",
    'tr', -- Varsayılan dil Türkçe
    "Title",
    "Description",
    "Technologies",
    "CreatedAt",
    "UpdatedAt"
FROM "Projects";

-- Mevcut BlogPost kayıtlarını translation tablosuna taşı
INSERT INTO "BlogPostTranslations" ("Id", "BlogPostId", "LanguageCode", "Title", "Content", "Excerpt", "Slug", "CreatedAt", "UpdatedAt")
SELECT 
    gen_random_uuid(),
    "Id",
    'tr', -- Varsayılan dil Türkçe
    "Title",
    "Content",
    "Excerpt",
    "Slug",
    "CreatedAt",
    "UpdatedAt"
FROM "BlogPosts";
```

### 2. Eski Alanları Kaldırma (Gelecek Migration)

Bir sonraki migration'da eski `Title`, `Description`, `Technologies`, `Content`, `Excerpt`, `Slug` alanlarını kaldırabilirsiniz (deprecated olarak işaretlenmişler).

## Notlar

- Migration çalıştıktan sonra mevcut verileriniz korunur
- Eski alanlar şu an deprecated olarak işaretlenmiş, gelecekte kaldırılabilir
- Yeni kayıtlar sadece translation tablolarını kullanacak
