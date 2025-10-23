# 🚀 Hướng Dẫn Deploy Lên Vercel - Nhanh

## Bước 1: Deploy Python Backend (BẮT BUỘC TRƯỚC)

⚠️ **Vercel chỉ hỗ trợ Next.js, KHÔNG hỗ trợ Python. Backend phải deploy riêng!**

### Option 1: Deploy lên Railway (Khuyến nghị)

1. Truy cập: https://railway.app/
2. Sign up với GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Chọn repository Python backend
5. Railway sẽ tự động detect Python và build
6. Thêm Environment Variables:
   - `GOOGLE_API_KEY`: API key của Gemini AI
7. Copy **Public URL** (ví dụ: `https://your-app.railway.app`)

### Option 2: Deploy lên Render

1. Truy cập: https://render.com/
2. Sign up → **New** → **Web Service**
3. Connect GitHub repository
4. Thiết lập:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Thêm Environment Variables:
   - `GOOGLE_API_KEY`: API key
6. Deploy và copy **URL**

---

## Bước 2: Push Code Lên GitHub

```powershell
# 1. Khởi tạo Git (nếu chưa có)
git init

# 2. Add tất cả files
git add .

# 3. Commit
git commit -m "Initial commit - Ready for deployment"

# 4. Tạo repository trên GitHub
# Truy cập: https://github.com/new
# Tên: qlmc (hoặc tên bạn muốn)
# Visibility: Private (khuyến nghị)

# 5. Connect và push
git remote add origin https://github.com/<YOUR_USERNAME>/qlmc.git
git branch -M main
git push -u origin main
```

---

## Bước 3: Deploy Next.js Lên Vercel

### 3.1. Import Project

1. Truy cập: https://vercel.com/
2. Sign up/Login với GitHub
3. Click **Add New...** → **Project**
4. Import repository **qlmc**
5. Vercel tự động detect Next.js

### 3.2. Configure Environment Variables

Click **Environment Variables** và thêm:

| Variable | Value | Ghi chú |
|----------|-------|---------|
| `DATABASE_URL` | `mongodb+srv://admin:<PASSWORD>@qlmc-cluster...` | MongoDB Atlas URL |
| `JWT_SECRET` | `your-super-secret-jwt-key` | Key mã hóa JWT |
| `CRON_SECRET` | `your-cron-secret-key` | Key bảo vệ cron endpoint |
| `NEXT_PUBLIC_PYTHON_BACKEND_URL` | `https://your-app.railway.app` | URL Python backend từ Bước 1 |
| `GEMINI_API_KEY` | `your-gemini-api-key` | (Optional) Nếu dùng trong Next.js |

⚠️ **Lưu ý:**
- Copy `DATABASE_URL` từ file `.env` local
- Thay `<PASSWORD>` bằng password thật
- `NEXT_PUBLIC_PYTHON_BACKEND_URL` phải là URL public từ Railway/Render

### 3.3. Deploy

1. Click **Deploy**
2. Đợi 2-3 phút để build
3. Vercel sẽ cung cấp URL: `https://qlmc.vercel.app`

---

## Bước 4: Seed Database Production (Chỉ chạy 1 lần)

```powershell
# Chạy seed với production DATABASE_URL
npm run seed
```

Hoặc chạy trực tiếp trên Vercel:
1. Vào **Project Settings** → **Functions**
2. Tạo temporary API route để seed:

```typescript
// src/app/api/seed-once/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Seed code here (copy from seed.ts)
  // ...
  
  return Response.json({ message: 'Seeded!' });
}
```

Sau đó truy cập: `https://qlmc.vercel.app/api/seed-once?key=CRON_SECRET`

**Xóa route này sau khi seed xong!**

---

## Bước 5: Kiểm Tra

### 5.1. Test Frontend
- Truy cập: `https://qlmc.vercel.app`
- Login với: `admin@qlmc.com` / `Admin123!`
- Kiểm tra dashboard hiển thị đúng

### 5.2. Test API
```powershell
# Test API endpoint
curl https://qlmc.vercel.app/api/auth/check
```

### 5.3. Test ChatWidget
- Click vào ChatWidget góc dưới phải
- Gõ câu hỏi về máy chiếu
- Kiểm tra có trả lời từ AI

### 5.4. Kiểm Tra Python Backend
```powershell
# Test Python API
curl https://your-app.railway.app/health
```

---

## Bước 6: Cấu Hình Cron Job (Tùy chọn)

File `vercel.json` đã có cấu hình sẵn cron chạy mỗi ngày 00:00:

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

Vercel sẽ tự động chạy cron job này. Kiểm tra logs:
1. Vào **Deployments** → Click latest deployment
2. Vào **Functions** → Tìm `/api/cron/daily-ai-learning`
3. Xem logs

---

## Troubleshooting

### ❌ Lỗi: "Cannot find module 'prisma'"
**Giải pháp**: Đảm bảo `postinstall` script trong `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### ❌ Lỗi: "ChatWidget không hoạt động"
**Giải pháp**: Kiểm tra `NEXT_PUBLIC_PYTHON_BACKEND_URL` đã đúng chưa:
- Phải là URL public từ Railway/Render
- Không có trailing slash `/` ở cuối
- Test URL: `curl https://your-backend.railway.app/health`

### ❌ Lỗi: "Database connection failed"
**Giải pháp**: 
1. Kiểm tra MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (Allow from anywhere)
3. Kiểm tra Database User có đúng password

### ❌ Lỗi: "Cron job không chạy"
**Giải pháp**:
1. Vercel Cron chỉ hoạt động trên **Production** deployment
2. Kiểm tra `CRON_SECRET` environment variable
3. Xem logs trong Vercel dashboard

---

## Các Bước Tiếp Theo

✅ **Domain riêng** (Optional):
- Vào Project Settings → Domains
- Add custom domain: `qlmc.yourdomain.com`

✅ **Monitoring**:
- Vercel Analytics đã tự động bật
- Xem trong tab **Analytics**

✅ **CI/CD**:
- Vercel tự động deploy khi push code mới lên GitHub
- Preview deployment cho mỗi Pull Request

---

## 🎉 Hoàn Tất!

Website của bạn đã live tại:
- **Frontend**: `https://qlmc.vercel.app`
- **Backend**: `https://your-app.railway.app`

**Login credentials:**
- Admin: `admin@qlmc.com` / `Admin123!`
- Teacher: `teacher@qlmc.com` / `Teacher123!`
- Technician: `technician@qlmc.com` / `Tech123!`

