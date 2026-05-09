# 🤝 Saathi App

**On-demand local helper service platform** — Thake hue logo ke liye apne area ke Saathi ki madad lo.

---

## Tech Stack
- **Backend**: Python + Flask + SQLAlchemy + PyMySQL
- **Database**: MySQL on Aiven
- **Frontend**: React + Vite
- **Deploy**: Render

---

## Features

### Users (Customers)
- Account banao ya bina account ke bhi service book karo
- Area + service ke hisaab se Saathi dhundo
- Phone/email se directly contact karo

### Agents (Saathi)
- Profile banao, apni services list karo
- Availability toggle karo
- Bookings accept/complete/cancel karo

### Services & Fixed Pricing
| Service | Price |
|---|---|
| Saman Uthana | ₹100/trip |
| Saman Pahunchana | ₹100/trip |
| Saath Chalna (Safar) | ₹200/hr |
| Body Guard | ₹300/hr |
| Ghar Ka Kaam | ₹150/hr |
| Khaana Lana | ₹80/trip |
| Dawa Lana | ₹80/trip |
| Cab Book Karna | ₹100/task |

---

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# .env file banao
cp .env.example .env
# Aiven credentials fill karo

python app.py
# API runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install

# .env file banao
cp .env.example .env
# Local me VITE_API_URL set mat karo (proxy use hoga)

npm run dev
# App runs on http://localhost:5173
```

---

## Render Deployment

### Step 1: Aiven MySQL Setup
1. [aiven.io](https://aiven.io) pe free MySQL service banao
2. Connection details note karo (host, user, password, database)

### Step 2: Render Backend Deploy
1. GitHub pe code push karo
2. Render Dashboard → New Web Service
3. **Root Directory**: `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `gunicorn "app:create_app()" --bind 0.0.0.0:$PORT --workers 2`
6. Environment Variables add karo:
   ```
   DB_USER=avnadmin
   DB_PASSWORD=<aiven password>
   DB_HOST=<aiven host>
   DB_PORT=3306
   DB_NAME=defaultdb
   SECRET_KEY=<kuch bhi random>
   JWT_SECRET_KEY=<kuch bhi random>
   ```

### Step 3: Render Frontend Deploy
1. Render Dashboard → New Static Site
2. **Root Directory**: `frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. Environment Variable:
   ```
   VITE_API_URL=https://saathi-api.onrender.com  (aapka backend URL)
   ```
6. Redirect Rule: `/* → /index.html` (200)

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Profile (JWT)
- `PUT /api/auth/me` — Update Profile (JWT)

### Services
- `GET /api/services/categories` — Sabhi categories
- `GET /api/services/agents?city=&area=&category_id=` — Agents dhundo
- `GET /api/services/agent-services` — My services (JWT)
- `POST /api/services/agent-services` — Add service (JWT)
- `PUT /api/services/agent-services/:id` — Update (JWT)
- `DELETE /api/services/agent-services/:id` — Delete (JWT)

### Bookings
- `POST /api/bookings` — Book (guest ya JWT)
- `GET /api/bookings/my` — My bookings (JWT)
- `PUT /api/bookings/:id/status` — Status update (agent JWT)

### Reviews
- `GET /api/reviews/agent/:id` — Agent reviews
- `POST /api/reviews` — Review do (guest ya JWT)
