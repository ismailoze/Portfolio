# GitHub Actions – Workflow Kılavuzu

Bu projede **Backend CI**, **Frontend CI** ve **Deploy** işleri GitHub Actions ile çalışır. Nasıl tetikleneceği, gerekli secrets ve opsiyonel adımlar aşağıda.

---

## Workflow'lar

| Workflow        | Dosya            | Amaç                                      |
|-----------------|------------------|-------------------------------------------|
| **Backend CI**  | `ci-backend.yml` | Backend build + test (PostgreSQL servisi) |
| **Frontend CI** | `ci-frontend.yml`| Frontend install, lint, build, test       |
| **Deploy**      | `cd.yml`         | Backend Docker image + Frontend production build; opsiyonel push/deploy |

---

## 1. Backend CI (`ci-backend.yml`)

**Ne zaman çalışır:**
- `main` veya `develop` branch’ine **push** veya **pull request**.
- Her push/PR'da tetiklenir (path filtresi yok).

**Adımlar:**
1. PostgreSQL 16 service container.
2. `dotnet restore` → `dotnet build` (Release).
3. `dotnet test`; connection string ortam değişkeni ile verilir.

**Ortam:**
- `ConnectionStrings__DefaultConnection`: test DB (postgres/postgres, portfoliodb_test).
- `ASPNETCORE_ENVIRONMENT`: `Testing`.

**Gerekli secret:** Yok.

---

## 2. Frontend CI (`ci-frontend.yml`)

**Ne zaman çalışır:**
- `main` veya `develop` branch’ine **push** veya **pull request**.
- Her push/PR'da tetiklenir (path filtresi yok).

**Adımlar:**
1. Node 22, `npm ci` (cache: `frontend/portfolio/package-lock.json`).
2. `npm run lint`.
3. `npm run build` (production).
4. `npm test -- --watch=false --browsers=ChromeHeadless`.

**Gerekli secret:** Yok.

---

## 3. Deploy (`cd.yml`)

**Ne zaman çalışır:**

| Tetikleyici         | Backend job | Frontend job |
|---------------------|------------|--------------|
| `main`’e push + commit mesajında `[deploy-backend]` | Evet | Hayır |
| `main`’e push + commit mesajında `[deploy-frontend]` | Hayır | Evet |
| `v*` tag (örn. `v1.0.0`) push | Evet | Evet |
| **Manuel (Actions → Deploy → Run workflow)** | Seçime göre | Seçime göre |

**Manuel çalıştırma:**
1. Repo → **Actions** → **Deploy**.
2. **Run workflow**.
3. **Deploy target:** `backend` | `frontend` | `both`.
4. **Run workflow** ile başlat.

**Backend job adımları:**
1. `dotnet build` (Release).
2. `dotnet publish` (Portfolio.Api → `./publish`).
3. `docker build -f Dockerfile.backend` → `portfolio-api:latest`.

**Frontend job adımları:**
1. `npm ci` → `npm run build -- --configuration production`.
2. Çıktı: `frontend/portfolio/dist/portfolio/browser/` (Angular varsayılanı).

**Şu an yorumda olan adımlar (opsiyonel):**
- Backend: GHCR / ACR / ECR’a `docker push`.
- Frontend: Vercel / Netlify / Azure Static Web Apps deploy.

Bu adımları açıp ilgili **Secrets**’ları tanımladıktan sonra otomatik push/deploy devreye girer.

---

## 4. Secrets ve Deploy’u Açma

### 4.1 GitHub’da Secret ekleme

1. Repo → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret** ile ekleyin.

### 4.2 Backend: Docker image’ı GHCR’a push

`cd.yml` içinde ilgili adımların yorumunu kaldırın:

```yaml
- name: Login to GHCR
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
- name: Tag and Push
  run: |
    docker tag portfolio-api:latest ghcr.io/${{ github.repository_owner }}/portfolio-api:latest
    docker push ghcr.io/${{ github.repository_owner }}/portfolio-api:latest
```

**GITHUB_TOKEN** otomatik verilir; ekstra secret gerekmez.  
İlk push’tan sonra paket: `ghcr.io/ismailoze/portfolio-api:latest` (repo adı `Portfolio` ise küçük harfle `portfolio-api` olabilir; `github.repository` ile uyumlu isim kullanılabilir).

### 4.3 Frontend: Vercel deploy

- **Secrets:** `VERCEL_TOKEN`, isteğe bağlı `VERCEL_ORG`, `VERCEL_PROJECT_ID`.
- Vercel’de proje oluşturup token alın: https://vercel.com/account/tokens.

`cd.yml`’de örnek:

```yaml
- name: Deploy to Vercel
  run: npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
  working-directory: ./frontend/portfolio
```

### 4.4 Frontend: Netlify deploy

- **Secrets:** `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.
- Netlify: **Site settings** → **Build & deploy** → **Continuous deployment**; **Site ID** ve **Personal access token** alın.

Örnek adım:

```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v3
  with:
    publish-dir: 'frontend/portfolio/dist/portfolio/browser'
    production-branch: main
    production-deploy: true
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 5. Branch’ler

- CI: `main`, `develop`.
- Deploy (push/tag): sadece `main` ve `v*` tag’leri.

`master` veya başka branch kullanıyorsanız, ilgili workflow’lardaki `branches:` listesine ekleyin.

---

## 6. Durum (status) badge’leri

README’ye ekleyebileceğiniz örnekler (`OWNER` ve `REPO`’yu kendi reponuzla değiştirin, örn. `ismailoze/Portfolio`):

```markdown
[![Backend CI](https://github.com/OWNER/REPO/actions/workflows/ci-backend.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci-backend.yml)
[![Frontend CI](https://github.com/OWNER/REPO/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci-frontend.yml)
```

---

## 7. Yerel ile uyum

- **Backend:** `backend/` altında `dotnet build` ve `dotnet test`; CI da aynı yapıyı kullanır.
- **Frontend:** `frontend/portfolio/` altında `npm ci`, `npm run build`, `npm test`; CI da `frontend/portfolio` için tanımlı.
- **Docker:** `Dockerfile.backend` repo kökünden `docker build -f Dockerfile.backend .` ile çalışacak şekilde yazıldı.

---

## 8. Sorun giderme

| Belirti | Olası neden | Çözüm |
|--------|--------------|-------|
| Backend CI: test bağlantı hatası | PostgreSQL service başlamadan test koşuyor | `services.postgres.options` health check’e bırakıldı; bazen 1–2 dakika sürebilir. |
| Frontend CI: lint/test fail | Kurallar veya testler kırık | Pipeline kırmızı olur; yerde `npm run lint` ve `npm test` ile düzeltin. |
| Deploy: Docker build fail | Context veya yol hatası | `docker build -f Dockerfile.backend .` repo kökünden çalıştığından emin olun; `Actions` log’unda `working-directory`’i kontrol edin. |
| `inputs` / `workflow_dispatch` hatası | Eski runner / sözdizimi | `actions/checkout@v4`, `setup-dotnet@v4`, `setup-node@v4` kullanıldığını ve `workflow_dispatch` blokunun doğru girintide olduğunu kontrol edin. |

---

## 9. Özet: İlk kullanım

1. Projeyi GitHub’a push edin (`main` veya `develop`).
2. **Actions** sekmesinden Backend CI ve Frontend CI’ın otomatik çalıştığını doğrulayın.
3. Deploy’u yalnızca build için kullanmak: `cd.yml`’deki mevcut hali yeterli; Docker image ve frontend build üretilir.
4. Gerçek deploy için: `cd.yml` içindeki ilgili push/deploy adımlarının yorumunu kaldırıp gerekli **Secrets**’ları ekleyin.
5. İsteğe bağlı: README’ye yukarıdaki badge’leri ekleyin.
