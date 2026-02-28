# Uprsoft News - Deployment Checklist

## Durum: Backend hazır, deployment bekliyor

---

## 1. GitHub Repo Oluştur
- [ ] GitHub'da `uprsoft-news` adında PRIVATE repo oluştur
- [ ] README ekleme, boş bırak

## 2. Git Push
- [ ] `git init`
- [ ] `git add .`
- [ ] `git commit -m "Initial commit"`
- [ ] `git remote add origin https://github.com/KULLANICI/uprsoft-news.git`
- [ ] `git push -u origin main`

## 3. Coolify Kurulumu

### 3.1 Database Servisleri
- [ ] PostgreSQL ekle (Coolify'dan one-click)
- [ ] Redis ekle (Coolify'dan one-click)
- [ ] Database credentials'ları not al

### 3.2 Backend API
- [ ] GitHub repo bağla
- [ ] Dockerfile path: `docker/Dockerfile.backend`
- [ ] Port: 3001
- [ ] Environment variables ekle:
  ```
  DATABASE_URL=postgresql://postgres:SIFRE@postgres-container:5432/newsdb
  REDIS_URL=redis://redis-container:6379
  GEMINI_API_KEY=your_key
  FRONTEND_URL=https://uprsoft.com
  NODE_ENV=production
  PORT=3001
  ADMIN_API_KEY=random_secure_key
  ```

### 3.3 Workers (Background Jobs)
- [ ] Aynı repo, farklı servis
- [ ] Dockerfile path: `docker/Dockerfile.backend`
- [ ] Command override: `node dist/backend/workers/index.js`
- [ ] Aynı env variables

### 3.4 Frontend
- [ ] GitHub repo bağla
- [ ] Dockerfile path: `docker/Dockerfile.frontend`
- [ ] Port: 80
- [ ] Environment variables:
  ```
  VITE_API_URL=https://api.uprsoft.com
  ```

## 4. Domain Ayarları
- [ ] `uprsoft.com` → Frontend servisine bağla
- [ ] `api.uprsoft.com` → Backend servisine bağla
- [ ] SSL sertifikaları aktif et (Coolify otomatik yapar)

## 5. Database Migration
- [ ] Backend deploy olduktan sonra Coolify terminal'den:
  ```
  npm run migrate
  npm run seed
  ```

## 6. Test
- [ ] `https://api.uprsoft.com/health` kontrol et
- [ ] `https://uprsoft.com` ana sayfa kontrol et
- [ ] Bir makale sayfası aç, SEO kontrol et

## 7. Gemini API Key
- [ ] Google AI Studio'dan API key al: https://aistudio.google.com/apikey
- [ ] Coolify'da backend env'e ekle

---

## Notlar

### Proje Yapısı
- Frontend: React + Vite (port 80)
- Backend: Express API (port 3001)
- Workers: BullMQ + node-cron (RSS scraping, AI generation)
- Database: PostgreSQL
- Cache/Queue: Redis

### Önemli Dosyalar
- `docker/docker-compose.yml` - Local development için
- `docker/Dockerfile.backend` - Backend + Workers image
- `docker/Dockerfile.frontend` - Frontend image
- `scripts/migrate.ts` - Database schema
- `scripts/seed-sources.ts` - RSS kaynakları seed

### RSS Otomasyonu
- Her 15 dakikada RSS feed'ler taranır
- Her 30 dakikada trend'ler kontrol edilir
- AI (Gemini) makale yazar ve yayınlar
- Duplicate kontrolü var (URL + Title hash)

---

Son güncelleme: 2024-02-24
