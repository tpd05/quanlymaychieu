# 🚀 HƯỚNG DẪN DEPLOY LÊN VERCEL

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn deploy ứng dụng QLMC lên Vercel với:
- ✅ Next.js frontend
- ✅ MongoDB Atlas database  
- ✅ Environment variables
- ✅ Python AI backend (deploy riêng)

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Python Backend KHÔNG thể deploy cùng Vercel
Vercel chỉ hỗ trợ Next.js/Node.js. Python AI backend cần deploy riêng trên:
- **Railway** (Khuyến nghị - Free tier)
- **Render** (Free tier)
- **Google Cloud Run** (Pay as you go)
- **Heroku** (Paid)

**Giải pháp:** Deploy 2 phần riêng biệt:
1. Next.js app → Vercel
2. Python FastAPI → Railway/Render

---

## 🔧 CHUẨN BỊ

### 1. **Kiểm tra các file cần thiết**

Đảm bảo có các file sau:

#### ✅ `.gitignore`
```gitignore
# dependencies
node_modules/
.pnp
.pnp.js

# testing
coverage/

# next.js
.next/
out/
build/
dist/

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/.env

# python
py-chatbot/.venv/
py-chatbot/__pycache__/
py-chatbot/*.pyc
py-chatbot/.env
py-chatbot/store/

# uploads
public/uploads/avatars/*
!public/uploads/avatars/.gitkeep
```

#### ✅ `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build && npx prisma generate",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "CRON_SECRET": "@cron-secret",
    "NEXT_PUBLIC_PYTHON_BACKEND_URL": "@python-backend-url",
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

---

## 📦 BƯỚC 1: Push Code lên GitHub

### 1.1. Khởi tạo Git (nếu chưa có)

```powershell
# Khởi tạo git
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - QLMC project with MongoDB Atlas"
```

### 1.2. Tạo GitHub Repository

1. Truy cập: https://github.com/new
2. Repository name: `qlmc`
3. Description: `Hệ thống quản lý máy chiếu với AI`
4. **Private** hoặc **Public** (tùy chọn)
5. **KHÔNG chọn** "Initialize with README"
6. Click **"Create repository"**

### 1.3. Push lên GitHub

```powershell
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/qlmc.git

# Push
git branch -M main
git push -u origin main
```

---

## 🌐 BƯỚC 2: Deploy Python Backend lên Railway

### 2.1. Chuẩn bị Python Backend

Tạo file `py-chatbot/requirements.txt` (nếu chưa có):

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
langchain==0.1.0
langchain-google-genai==0.0.6
faiss-cpu==1.7.4
sentence-transformers==2.2.2
python-dotenv==1.0.0
pydantic==2.5.0
```

Tạo file `py-chatbot/Procfile`:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 2.2. Deploy lên Railway

1. Truy cập: https://railway.app
2. Click **"Start a New Project"**
3. Chọn **"Deploy from GitHub repo"**
4. Chọn repository `qlmc`
5. Chọn **"Add variables"**:
   - `GOOGLE_API_KEY`: Your Gemini API key
6. Railway sẽ tự động detect Python và deploy
7. Copy URL được tạo (VD: `https://qlmc-api.up.railway.app`)

**Hoặc sử dụng Render:**

1. Truy cập: https://render.com
2. New → **Web Service**
3. Connect GitHub → Chọn `qlmc`
4. Settings:
   - Name: `qlmc-ai-backend`
   - Root Directory: `py-chatbot`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variable:
   - `GOOGLE_API_KEY`: Your key
6. Click **"Create Web Service"**
7. Copy URL (VD: `https://qlmc-ai-backend.onrender.com`)

---

## ☁️ BƯỚC 3: Deploy Next.js lên Vercel

### 3.1. Import Project

1. Truy cập: https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import Git Repository
4. Chọn repository `qlmc`
5. Click **"Import"**

### 3.2. Cấu hình Project

**Framework Preset:** Next.js (tự động detect)

**Root Directory:** `./` (để trống)

**Build Command:** (để mặc định)
```
npm run build
```

**Output Directory:** (để mặc định)
```
.next
```

### 3.3. Thêm Environment Variables

Click **"Environment Variables"** và thêm:

#### **DATABASE_URL**
```
mongodb+srv://admin:YOUR_PASSWORD@qlmc-cluster.hofomok.mongodb.net/qlmc?retryWrites=true&w=majority
```
- **Environment:** Production, Preview, Development (chọn tất cả)

#### **JWT_SECRET**
```
your-super-secret-jwt-key-change-to-random-string
```
- Tạo random: `openssl rand -base64 32`
- **Environment:** Production, Preview, Development

#### **CRON_SECRET**
```
your-cron-secret-for-daily-ai-learning
```
- Tạo random: `openssl rand -base64 32`
- **Environment:** Production, Preview, Development

#### **NEXT_PUBLIC_PYTHON_BACKEND_URL**
```
https://qlmc-ai-backend.up.railway.app
```
- Thay bằng URL Railway/Render của bạn
- **Environment:** Production, Preview, Development

#### **NEXT_PUBLIC_APP_URL**
```
https://your-app-name.vercel.app
```
- Sẽ được tạo sau khi deploy
- Có thể add sau
- **Environment:** Production

### 3.4. Deploy

1. Click **"Deploy"**
2. Đợi 2-5 phút
3. Vercel sẽ tự động:
   - Install dependencies
   - Generate Prisma Client
   - Build Next.js
   - Deploy

### 3.5. Lấy Production URL

Sau khi deploy thành công:
1. Copy URL (VD: `https://qlmc-abc123.vercel.app`)
2. Quay lại **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` với URL vừa copy

---

## 🔄 BƯỚC 4: Setup Cron Job (Daily AI Learning)

### Option 1: Vercel Cron (Khuyến nghị)

Tạo file `vercel.json` với cron config:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-ai-learning",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Push lên GitHub:
```powershell
git add vercel.json
git commit -m "Add Vercel cron config"
git push
```

Vercel sẽ tự động redeploy.

### Option 2: External Cron Service

Sử dụng https://cron-job.org:

1. Đăng ký tài khoản
2. Create new cron job:
   - Title: `QLMC Daily AI Learning`
   - URL: `https://your-app.vercel.app/api/cron/daily-ai-learning`
   - Schedule: `0 0 * * *` (daily at 00:00)
   - Add Header:
     - Name: `Authorization`
     - Value: `Bearer YOUR_CRON_SECRET`

---

## ✅ BƯỚC 5: Seed Database

Sau khi deploy thành công, seed database:

### Option 1: Local Seed (Khuyến nghị)

```powershell
# Đảm bảo .env có DATABASE_URL production
npm run seed
```

### Option 2: Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Run seed
vercel exec npm run seed
```

---

## 🧪 BƯỚC 6: Test Production

### 6.1. Test Frontend

1. Truy cập: `https://your-app.vercel.app`
2. Login với tài khoản đã seed:
   - Email: `admin@qlmc.com`
   - Password: `Admin123!`

### 6.2. Test API

```bash
curl https://your-app.vercel.app/api/projectors/stats
```

### 6.3. Test ChatWidget

1. Click icon AI ở góc dưới phải
2. Gửi tin nhắn test
3. Kiểm tra response từ Python backend

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Module not found @prisma/client"

**Giải pháp:**
1. Vào Vercel Dashboard → Settings → Build & Development
2. Build Command: 
```
npm run build && npx prisma generate
```

### Lỗi: "Cannot connect to MongoDB"

**Giải pháp:**
1. Kiểm tra MongoDB Atlas → Network Access
2. Ensure **0.0.0.0/0** is whitelisted
3. Check DATABASE_URL trong Vercel Environment Variables

### Lỗi: "ChatWidget không hoạt động"

**Giải pháp:**
1. Kiểm tra Python backend đã deploy chưa
2. Test: `curl https://your-python-backend.railway.app/health`
3. Check `NEXT_PUBLIC_PYTHON_BACKEND_URL` trong Vercel

### Lỗi: Build timeout

**Giải pháp:**
1. Upgrade Vercel plan (Free có limit)
2. Hoặc optimize build:
   - Remove unused dependencies
   - Use production build only

---

## 📊 MONITORING & LOGS

### Vercel Logs

1. Vercel Dashboard → Project → Deployments
2. Click vào deployment → View Function Logs
3. Realtime logs cho API routes

### Railway/Render Logs

1. Dashboard → Service → Logs
2. Xem Python backend logs realtime

### MongoDB Atlas Logs

1. Atlas Dashboard → Database → Monitoring
2. Xem queries, performance

---

## 🔒 SECURITY BEST PRACTICES

### 1. Environment Variables
- ✅ Không commit .env lên GitHub
- ✅ Dùng random strong secrets
- ✅ Rotate secrets định kỳ

### 2. MongoDB Atlas
- ✅ Whitelist only Vercel IPs (nếu có thể)
- ✅ Dùng strong password
- ✅ Enable authentication

### 3. API Routes
- ✅ JWT authentication đã có
- ✅ Rate limiting (thêm nếu cần)
- ✅ CORS headers

---

## 🚀 CI/CD - Auto Deploy

Vercel tự động deploy khi:
- ✅ Push lên `main` branch → Deploy to Production
- ✅ Push lên branch khác → Deploy to Preview
- ✅ Pull Request → Deploy to Preview

**Workflow:**
```
Local changes → git push → Vercel auto deploy → Live in 2-5 minutes
```

---

## 📝 CUSTOM DOMAIN (Optional)

### Thêm domain riêng:

1. Vercel Dashboard → Settings → Domains
2. Add domain: `qlmc.yourdomain.com`
3. Update DNS records theo hướng dẫn:
   - Type: `A` Record
   - Name: `qlmc`
   - Value: `76.76.21.21` (Vercel IP)
4. Đợi DNS propagate (5-30 phút)

---

## 🎉 HOÀN TẤT!

Ứng dụng của bạn đã được deploy thành công!

### Links:
- 🌐 **Frontend:** https://your-app.vercel.app
- 🤖 **AI Backend:** https://your-backend.railway.app
- 📊 **MongoDB:** https://cloud.mongodb.com

### Next Steps:
- [ ] Test tất cả features
- [ ] Setup monitoring/alerts
- [ ] Add custom domain
- [ ] Enable analytics
- [ ] Setup error tracking (Sentry)

---

## 📚 TÀI LIỆU THAM KHẢO

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

---

**Made with ❤️ for QLMC Project**
