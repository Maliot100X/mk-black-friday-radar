# 🔥 MK Black Friday Radar v2.0

**AI-Powered Deal Discovery Platform for North Macedonia**

🇲🇰 Најдобри Понуди во Македонија | Северна Македонија | North Macedonia

## 🎯 Features

### ✅ All 22 Phases Complete

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ | System Environment Preparation |
| 2 | ✅ | Project Structure |
| 3 | ✅ | Clone Required Repositories (15 repos) |
| 4 | ✅ | Python Environment & Dependencies |
| 5 | ✅ | Database System (PostgreSQL + PostGIS) |
| 6 | ✅ | Vector Database (ChromaDB) |
| 7 | ✅ | AI Agent System (CrewAI) |
| 8 | ✅ | Skill Library (10 skills) |
| 9 | ✅ | Scraper System (10 stores) |
| 10 | ✅ | Backend API (FastAPI) |
| 11 | ✅ | Frontend Web App (Next.js) |
| 12 | ✅ | RAG Integration |
| 13 | ✅ | QR Membership System |
| 14 | ✅ | Map Radar |
| 15 | ✅ | Android App |
| 16 | ✅ | Analytics System |
| 17 | ✅ | Notifications (FCM) |
| 18 | ✅ | Testing & QA |
| 19 | ✅ | Docker Deployment |
| 20 | ✅ | Monitoring |
| 21 | ✅ | Documentation |
| 22 | ✅ | Play Store Ready |

## 🏪 10 Macedonian Stores

| Store | Category | Website |
|-------|----------|---------|
| 🔵 Нептун | Electronics | neptun.mk |
| 🟢 Сетек | Electronics | setec.mk |
| 🟠 Техномаркет | Appliances | tehnomarket.com.mk |
| 🟣 Анхоч | Electronics | anhoch.com |
| 🔴 Тинекс | Supermarket | tinex.mk |
| 🟡 Рамстор | Supermarket | ramstore.com.mk |
| 🩵 Веро | Supermarket | vero.com.mk |
| 🩷 КАМ Маркет | Supermarket | kam.com.mk |
| 🔵 Ананас | Marketplace | ananas.mk |
| 🩵 Жирафа | Marketplace | zirafa.mk |

## 🛠️ Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL + PostGIS
- Redis (Celery)
- ChromaDB (Vector DB)
- CrewAI (AI Agents)

### Frontend
- Next.js 14 (React)
- TailwindCSS
- Lucide Icons
- Leaflet Maps

### Mobile
- Android (Java)
- WebView Integration
- ZXing QR Scanner

### Infrastructure
- Docker & Docker Compose
- Nginx Reverse Proxy
- Prometheus Monitoring

## 📁 Project Structure

```
mk-black-friday-radar/
├── backend/          # FastAPI backend
│   ├── main.py      # API endpoints
│   └── requirements.txt
├── frontend/        # Next.js web app
│   ├── app/        # Next.js pages
│   └── package.json
├── mobile/         # Android app
│   └── android/
├── agents/         # CrewAI agents
│   ├── crew.py
│   └── crewAI/     # Cloned repo
├── scrapers/       # 10 store scrapers
│   ├── base.py
│   ├── neptun.py
│   ├── setec.py
│   └── ... (8 more)
├── skills/         # Skill library
├── rag/           # Vector DB
│   └── chroma_setup.py
├── database/       # SQL schemas
│   └── init.sql
└── infrastructure/ # Docker configs
```

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
# API runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Web app on http://localhost:3000
```

### Database
```bash
# PostgreSQL with PostGIS
createdb mkbf_deals
psql mkbf_deals < database/init.sql
```

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/deals` | GET | Get all deals |
| `/api/deals/latest` | GET | Latest deals |
| `/api/deals/trending` | GET | Trending deals |
| `/api/deals/hot` | GET | Hot deals (>20%) |
| `/api/stores` | GET | All stores |
| `/api/search/rag` | POST | RAG semantic search |
| `/api/ai/chat` | POST | AI chatbot |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/qr/verify` | POST | Verify QR code |
| `/api/scrapers/run` | POST | Run scrapers |

## 🎨 Features

- 🔥 **Hot Deals** - Automatically calculated >20% discount
- 🤖 **AI Chatbot** - Natural language deal search
- 🔍 **RAG Search** - Semantic search with ChromaDB
- 📱 **QR Membership** - Store scan verification
- 🗺️ **Map Radar** - Store locations with deals
- 💾 **Saved Deals** - Bookmark favorites
- 📊 **Analytics** - User behavior tracking
- 🔔 **Push Notifications** - Deal alerts
- 🌐 **Bilingual** - Macedonian & Albanian support

## 💰 Deal Score Algorithm

```
Deal Score = (discount_percent * 0.6) + (rating_average * 0.2) + (popularity * 0.2)
```

- Discount weight: 60%
- Rating weight: 20%
- Popularity weight: 20%

## 📱 Mobile App Features

- Native Android (Java)
- WebView with fast loading
- QR Scanner (ZXing)
- QR Code generator
- Push notifications (FCM)
- Location services

## 🐳 Docker Deployment

```bash
docker-compose up -d
# Full stack: API + Frontend + Database + Redis
```

## 📊 Monitoring

- Prometheus metrics
- Grafana dashboards
- Sentry error tracking
- PostHog analytics

## 📝 Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mkbf_deals
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-...
FIREBASE_KEY=...
SENTRY_DSN=...
```

## 🔒 Security

- JWT authentication
- bcrypt password hashing
- Rate limiting
- SQL injection protection
- XSS prevention

## 🌐 Live Demo

**Website**: https://frontend-sage-six-48.vercel.app

## 📧 Contact

Built for North Macedonia 🇲🇰

---

**Version**: 2.0.0  
**License**: MIT  
**Status**: ✅ Production Ready
