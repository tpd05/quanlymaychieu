# 🚀 Deploy Next.js Frontend Lên Vercel - Hướng Dẫn Nhanh

## ✅ Đã Hoàn Thành

- ✅ Backend Python đã live: `https://qlmc-python-backend.onrender.com`
- ✅ Database MongoDB Atlas đã setup
- ✅ Code đã push lên GitHub: `https://github.com/tpd0905/qlmc`

---

## 📋 CÁC BƯỚC DEPLOY VERCEL (3 PHÚT)

### BƯỚC 1: ĐĂNG NHẬP VERCEL (30 giây)

1. Truy cập: **https://vercel.com/**
2. Click **Sign Up** hoặc **Log In**
3. Chọn **Continue with GitHub**
4. Authorize Vercel truy cập GitHub

---

### BƯỚC 2: IMPORT PROJECT (1 phút)

1. Trong Vercel Dashboard, click **Add New...** (góc trên phải)
2. Chọn **Project**
3. Tìm repository: **qlmc**
4. Click **Import**

---

### BƯỚC 3: CONFIGURE PROJECT (1 phút)

#### 3.1. Project Settings

Vercel tự động detect Next.js, giữ mặc định:

| Field | Value |
|-------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `./` (mặc định) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

#### 3.2. Environment Variables

Click **Environment Variables** và thêm:

| Variable Name | Value | Ghi chú |
|---------------|-------|---------|
| `DATABASE_URL` | `mongodb+srv://admin:<PASSWORD>@qlmc-cluster.hofomok.mongodb.net/qlmc?retryWrites=true&w=majority&appName=qlmc-cluster` | Copy từ `.env` local |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production` | Key mã hóa JWT (tạo random) |
| `CRON_SECRET` | `your-cron-secret-key-change-in-production` | Key bảo vệ cron endpoint |
| `NEXT_PUBLIC_PYTHON_BACKEND_URL` | `https://qlmc-python-backend.onrender.com` | URL Python backend |

⚠️ **LƯU Ý QUAN TRỌNG**:
- **DATABASE_URL**: Thay `<PASSWORD>` bằng password thật của MongoDB Atlas
- **JWT_SECRET & CRON_SECRET**: Tạo random string dài (khuyến nghị dùng: https://randomkeygen.com/)
- Chọn **Environment**: Production, Preview, Development (tất cả)

---

### BƯỚC 4: DEPLOY (30 giây)

1. Click **Deploy**
2. Vercel sẽ:
   - Clone repository
   - Install dependencies (~1-2 phút)
   - Build Next.js (~1 phút)
   - Deploy (~30 giây)
3. Đợi status: **Ready** (màu xanh)

---

## 🧪 BƯỚC 5: KIỂM TRA

### 5.1. Lấy URL Vercel

Sau khi deploy xong, Vercel sẽ cung cấp URL:
```
https://qlmc-<random>.vercel.app
```

Hoặc nếu bạn đã có custom domain:
```
https://qlmc.vercel.app
```

### 5.2. Test Frontend

1. Truy cập URL Vercel
2. Trang chủ hiển thị hero banner với nút **Đăng Nhập**
3. Click **Đăng Nhập**

### 5.3. Test Login

Login với tài khoản đã seed:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@qlmc.com` | `Admin123!` |
| Teacher | `teacher@qlmc.com` | `Teacher123!` |
| Technician | `technician@qlmc.com` | `Tech123!` |

### 5.4. Test Dashboard

Sau khi login:
- ✅ Dashboard hiển thị stats (số lượng máy chiếu, bookings, etc.)
- ✅ Sidebar navigation hoạt động
- ✅ Profile page hiển thị thông tin user

### 5.5. Test ChatWidget

1. Click icon **chat bubble** góc dưới phải
2. Gõ câu hỏi: "Máy chiếu bị mờ hình phải làm sao?"
3. **Lưu ý**: Ban đầu sẽ trả lời "Hiện chưa có tài liệu" vì chưa seed knowledge base

---

## 📊 BƯỚC 6: SEED KNOWLEDGE BASE (1 lần)

### 6.1. Lấy CRON_SECRET

1. Vào Vercel Dashboard
2. Project **qlmc** → **Settings** → **Environment Variables**
3. Copy giá trị của `CRON_SECRET`

### 6.2. Trigger Cron Job Thủ Công

```powershell
# Thay <CRON_SECRET> bằng giá trị thật
curl -X POST "https://qlmc-<your-url>.vercel.app/api/cron/daily-ai-learning" `
  -H "Authorization: Bearer <CRON_SECRET>"
```

**Hoặc đợi Vercel Cron tự động chạy vào 00:00 hàng ngày.**

### 6.3. Kiểm Tra Index Size

```powershell
curl https://qlmc-python-backend.onrender.com/index/stats
```

Sau khi seed, `index_size` sẽ > 0 (ví dụ: 50-100 documents).

### 6.4. Test ChatWidget Lại

Bây giờ ChatWidget sẽ trả lời câu hỏi dựa trên knowledge base!

---

## 🎯 BƯỚC 7: CẤU HÌNH VERCEL CRON (Tùy chọn)

File `vercel.json` đã có sẵn cấu hình:

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

Vercel sẽ **tự động** chạy cron job này mỗi ngày 00:00 UTC để:
- Lấy dữ liệu mới từ database (projectors, bookings, incidents)
- Gửi lên Python backend để embed vào FAISS index
- ChatWidget sẽ luôn có kiến thức mới nhất

**Kiểm tra Cron Logs**:
1. Vào Vercel Dashboard
2. Project **qlmc** → **Deployments**
3. Click vào deployment → **Functions**
4. Tìm `/api/cron/daily-ai-learning`
5. Xem logs để debug nếu cần

---

## 🐛 TROUBLESHOOTING

### ❌ Build Failed: "Type error: Cannot find module 'prisma'"

**Giải pháp**:
1. Đảm bảo `postinstall` script trong `package.json`:
   ```json
   {
     "scripts": {
       "postinstall": "prisma generate"
     }
   }
   ```
2. Redeploy

### ❌ Login Failed: "Database connection error"

**Giải pháp**:
1. Kiểm tra `DATABASE_URL` trong Vercel Environment Variables
2. Vào MongoDB Atlas → **Network Access**
3. Add IP: `0.0.0.0/0` (Allow from anywhere)
4. Redeploy Vercel

### ❌ ChatWidget Không Hoạt Động

**Giải pháp**:
1. Kiểm tra `NEXT_PUBLIC_PYTHON_BACKEND_URL` đã đúng chưa
2. Test Python backend:
   ```powershell
   curl https://qlmc-python-backend.onrender.com/health
   ```
3. Mở DevTools (F12) → Console → Xem lỗi CORS
4. Nếu có CORS error, kiểm tra `FRONTEND_URL` trong Render Environment Variables

### ❌ 404 Not Found trên một số pages

**Nguyên nhân**: Vercel chưa build xong tất cả routes

**Giải pháp**:
1. Vào Vercel → **Deployments**
2. Click **...** → **Redeploy**

### ❌ Cron Job Không Chạy

**Giải pháp**:
1. Cron job chỉ hoạt động trên **Production** deployment
2. Kiểm tra `CRON_SECRET` environment variable
3. Test manual trigger (xem Bước 6.2)
4. Xem logs trong Vercel Functions

---

## 🎉 HOÀN TẤT!

Website của bạn đã live tại:
```
https://qlmc-<your-url>.vercel.app
```

### 🔗 Links Hữu Ích:

- **Frontend**: `https://qlmc-<your-url>.vercel.app`
- **Backend AI**: `https://qlmc-python-backend.onrender.com`
- **API Docs**: `https://qlmc-python-backend.onrender.com/docs`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Render Dashboard**: `https://dashboard.render.com/`
- **MongoDB Atlas**: `https://cloud.mongodb.com/`

### 👥 Default Accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@qlmc.com | Admin123! |
| Teacher | teacher@qlmc.com | Teacher123! |
| Technician | technician@qlmc.com | Tech123! |

---

## 📝 CÁC BƯỚC TIẾP THEO

### 1. Custom Domain (Tùy chọn)

1. Vào Vercel → Project Settings → **Domains**
2. Add domain: `qlmc.yourdomain.com`
3. Update DNS records theo hướng dẫn

### 2. Setup Keep-Alive cho Python Backend

Để tránh Render Free tier sleep:

1. Vào: **https://cron-job.org/**
2. Create free account
3. Create cron job:
   - URL: `https://qlmc-python-backend.onrender.com/health`
   - Schedule: Every 10 minutes
4. Service sẽ không bao giờ sleep

### 3. Monitoring & Analytics

Vercel tự động cung cấp:
- **Analytics**: Xem traffic, performance
- **Logs**: Debug production issues
- **Speed Insights**: Tối ưu performance

---

## 💰 CHI PHÍ TỔNG

- ✅ **Next.js on Vercel**: $0/tháng (Free Hobby plan)
- ✅ **Python Backend on Render**: $0/tháng (Free tier)
- ✅ **MongoDB Atlas**: $0/tháng (M0 Free tier 512MB)

**TỔNG CỘNG: $0/THÁNG** 🎊

---

## 🔐 BẢO MẬT PRODUCTION

**Khuyến nghị trước khi public**:

1. ✅ Thay đổi `JWT_SECRET` và `CRON_SECRET` bằng random string mạnh
2. ✅ MongoDB Atlas: Giới hạn IP access (thay vì `0.0.0.0/0`)
3. ⚠️ Thêm rate limiting cho API endpoints
4. ⚠️ Thêm authentication cho Python backend
5. ⚠️ Enable HTTPS only (Vercel tự động)
6. ✅ Thường xuyên backup MongoDB Atlas

---

Made with ❤️ - Deploy thành công!
