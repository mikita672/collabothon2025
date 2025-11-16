# BetterThenNever team's project
# PowerPoint presentation:
- Presentation_BetterThanNever_Novideo.pptx
- video for presentation: https://youtu.be/e_svtYdGUvY
# OpenInvest – Dev Setup and Run

Monorepo layout:
- backend/ – FastAPI service
- frontend/ – Web app (Node.js)
- application/ – Flutter app

## Prerequisites
- Windows 10/11
- Python 3.13.9 + pip
- Node.js 18+ and npm
- Flutter SDK (stable) + Android/iOS tooling (for mobile)

---

## Backend (FastAPI)

1) Create and activate venv (PowerShell)
```powershell
cd backend
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2) Install deps
```powershell
pip install -r requirements.txt
```

3) (Optional) Environment variables
- Create backend/.env for your keys (kept out of git):
```
NEWS_API_KEY=your-key
GOOGLE_API_KEY=your-key
```

4) Run dev server
```powershell
uvicorn app:app --reload
```
- Default: http://127.0.0.1:8000
- API docs: http://127.0.0.1:8000/docs

---

## Frontend (Web)

1) Install deps
```powershell
cd frontend
npm install
```

2) Run dev
```powershell
npm run dev
```
- Default (Vite): http://127.0.0.1:5173

---

## Mobile App (Flutter)

1) Install Flutter
- Official guide: https://docs.flutter.dev/get-started/install

2) Verify setup
```powershell
flutter doctor
```

3) Open project
```powershell
cd EcoPoint
```

4) Get dependencies
```powershell
flutter pub get
```

5) Configure Firebase
- Firebase config files (e.g., android/app/google-services.json) are .gitignored.
- Set up your Firebase project (Android/iOS as needed): https://firebase.google.com/docs/flutter/setup
- Create a `.env` in EcoPoint root if your app reads DB URL:
```
FIREBASE_DB_URL=YOUR_URL
```

6) Run app
```powershell
flutter run
```

Select a device (emulator or physical).

---

## Notes
- Do not commit secrets. .env and service keys are ignored by git.
- If uvicorn hot-reload causes double imports, run without `--reload`.
- For Windows PowerShell execution policy, you may need:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
