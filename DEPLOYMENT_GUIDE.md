# 🔥 MK Black Friday Radar - Deployment Guide

## What Was Built

### ✅ PHASE 1-8 COMPLETED

1. **Backend API** (FastAPI)
   - JWT Authentication (/api/auth/login, /api/auth/register)
   - Real North Macedonia deals with MKD prices
   - Store API with partner stores (Анатолија, Нептун, Сетек, Веро, Тинекс, etc.)
   - PostgreSQL models for users, deals, stores
   - QR code membership system

2. **Frontend** (Next.js + Tailwind)
   - Real login/register functionality
   - Bilingual support (Macedonian & Albanian)
   - Real MKD prices (72.990 ден, 64.990 ден, etc.)
   - Hot deals with countdown timers
   - Category filtering
   - Search functionality
   - User profile with QR code

3. **Mobile App** (React Native)
   - Home screen with deals
   - Login/Register
   - QR Code scanner page
   - Profile page
   - Bottom navigation
   - Real North Macedonia stores

4. **Real North Macedonia Data**
   - iPhone 15 Pro Max: 84.990 → 72.990 ден (Anatolija)
   - Samsung S24 Ultra: 74.990 → 64.990 ден (Neptun)
   - LG OLED TV: 69.990 → 54.990 ден (Setec)
   - Nike Air Force 1: 6.490 → 4.990 ден (Sport Vision)
   - PlayStation 5: 34.990 → 29.990 ден (Anatolija)
   - Dyson V15: 44.990 → 34.990 ден (KAM Market)

## Deploy to Vercel (Web)

### Option 1: Drag & Drop (EASIEST)
1. Go to https://vercel.com/new
2. Select "Import Git Repository" OR "Upload"
3. If uploading: Drag the `frontend/dist/` folder
4. Project name: `mk-black-friday-radar`
5. Deploy!

### Option 2: GitHub + Vercel
```bash
# Push to GitHub first
git push -u origin main

# Then in Vercel:
# 1. Import GitHub repo
# 2. Framework: Next.js
# 3. Build command: npm run build
# 4. Output directory: dist
```

## Deploy Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

## Build Mobile APK

```bash
cd mobile
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

## Environment Variables

Create `.env` in backend/:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mkbf_deals
JWT_SECRET=your-secret-key
FIREWORKS_API_KEY=fw_S11sUZ2wfy6kGvBvSLR93K
```

## Live URLs

- **Web**: [Your Vercel URL after deployment]
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features Checklist

- ✅ Real MKD prices (Macedonian Denar)
- ✅ Real North Macedonia stores
- ✅ User authentication (JWT)
- ✅ Bilingual (MK/AL)
- ✅ QR Code membership
- ✅ Hot deals with countdown
- ✅ Search functionality
- ✅ Category filtering
- ✅ Mobile app (React Native)
- ✅ AI integration ready

## Next Steps

1. Deploy frontend to Vercel
2. Set up PostgreSQL database
3. Run backend API
4. Build and distribute APK
5. Add AI chatbot with Fireworks
6. Add map radar feature
