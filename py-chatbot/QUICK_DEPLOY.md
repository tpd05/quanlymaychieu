# 🚀 DEPLOY PYTHON BACKEND LÊN RENDER - HƯỚNG DẪN NHANH

## ✅ Các File Đã Được Chuẩn Bị Sẵn

1. ✅ `Procfile` - Start command cho Render
2. ✅ `runtime.txt` - Python version
3. ✅ `.python-version` - Python version
4. ✅ `.gitignore` - Bỏ qua files không cần
5. ✅ `requirements.txt` - Đã thêm torch và numpy
6. ✅ `app/main.py` - Đã cập nhật CORS cho Vercel
7. ✅ `RENDER_DEPLOY.md` - Hướng dẫn chi tiết đầy đủ
8. ✅ `README.md` - Documentation

---

## 📋 CÁC BƯỚC THỰC HIỆN (5 PHÚT)

### BƯỚC 1: PUSH LÊN GITHUB (2 phút)

```powershell
# Chuyển vào thư mục py-chatbot
cd py-chatbot

# Khởi tạo Git
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - Python AI Backend for Render"

# Tạo repository trên GitHub:
# 1. Mở: https://github.com/new
# 2. Tên: qlmc-python-backend
# 3. Visibility: Private
# 4. KHÔNG chọn Initialize với README
# 5. Click Create repository

# Connect và push (thay <YOUR_USERNAME> bằng username GitHub của bạn)
git remote add origin https://github.com/<YOUR_USERNAME>/qlmc-python-backend.git
git branch -M main
git push -u origin main
```

---

### BƯỚC 2: DEPLOY LÊN RENDER (2 phút)

**2.1. Tạo tài khoản Render:**
1. Truy cập: https://render.com/
2. Click **Sign up with GitHub**
3. Authorize Render

**2.2. Tạo Web Service:**
1. Click **New +** (góc trên phải)
2. Chọn **Web Service**
3. Tìm repository: `qlmc-python-backend`
4. Click **Connect**

**2.3. Cấu hình:**

| Field | Giá trị |
|-------|---------|
| **Name** | `qlmc-python-backend` |
| **Region** | `Singapore` hoặc `Oregon` |
| **Branch** | `main` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

**2.4. Environment Variables:**

Click **Advanced** → **Add Environment Variable**:

| Variable | Value |
|----------|-------|
| `CHATBOT_DATA_DIR` | `/opt/render/project/src/store` |
| `FRONTEND_URL` | `https://qlmc.vercel.app` |
| `AUTOSAVE_SECONDS` | `300` |

**2.5. Deploy:**
1. Click **Create Web Service**
2. Đợi 5-7 phút (downloading ML models)
3. Status sẽ chuyển sang **Live** (màu xanh)

---

### BƯỚC 3: LẤY URL VÀ CẬP NHẬT VERCEL (1 phút)

**3.1. Copy URL từ Render:**
```
https://qlmc-python-backend.onrender.com
```

**3.2. Thêm vào Vercel:**
1. Vào: https://vercel.com/
2. Chọn project **qlmc**
3. **Settings** → **Environment Variables**
4. Add variable:
   - Name: `NEXT_PUBLIC_PYTHON_BACKEND_URL`
   - Value: `https://qlmc-python-backend.onrender.com`
5. Click **Save**

**3.3. Redeploy Vercel:**
1. Tab **Deployments**
2. Click **...** trên latest deployment
3. Click **Redeploy**

---

### BƯỚC 4: KIỂM TRA (30 giây)

**Test backend:**
```powershell
curl https://qlmc-python-backend.onrender.com/health
```

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "device": "cpu",
  "index_size": 0,
  ...
}
```

**Test ChatWidget:**
1. Vào: https://qlmc.vercel.app
2. Login
3. Click ChatWidget góc dưới phải
4. Gõ câu hỏi

---

## 🎉 HOÀN TẤT!

Backend Python của bạn đã live tại:
```
https://qlmc-python-backend.onrender.com
```

### API Documentation (Swagger UI):
```
https://qlmc-python-backend.onrender.com/docs
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Free Tier Render:
- ✅ **Miễn phí mãi mãi**
- ⚠️ Service **sleep sau 15 phút** không dùng
- ⏱️ Request đầu tiên sau khi sleep mất **30-60 giây** để wake up
- 💾 **512MB RAM** (đủ cho ML models)

### Cách Tránh Sleep:
**Option 1: Upgrade Starter ($7/tháng)**
- Không sleep
- Unlimited hours

**Option 2: Keep-alive Ping (Miễn phí)**
Dùng dịch vụ như cron-job.org:
1. Tạo cron job ping mỗi 10 phút:
   ```
   https://qlmc-python-backend.onrender.com/health
   ```
2. Service sẽ không bao giờ sleep

---

## 🐛 TROUBLESHOOTING

### ❌ Build Failed
→ Xem logs trong Render Dashboard
→ Thường là lỗi dependencies không tương thích

### ❌ Application Failed to Respond
→ Kiểm tra logs
→ Thường là lỗi code trong `main.py`

### ❌ CORS Error
→ Kiểm tra `FRONTEND_URL` trong Render Environment Variables
→ Phải đúng domain Vercel (không có trailing slash)

### ❌ Service Sleeping
→ Đây là tính năng Free tier
→ Request đầu tiên sẽ mất 30-60s
→ Upgrade hoặc dùng keep-alive ping

---

## 📚 TÀI LIỆU CHI TIẾT

Xem **[RENDER_DEPLOY.md](./RENDER_DEPLOY.md)** để biết thêm:
- Giải thích các file cấu hình
- API endpoints đầy đủ
- Troubleshooting chi tiết
- Bảo mật và performance tuning

---

## 🔗 LINKS HỮU ÍCH

- **Render Dashboard**: https://dashboard.render.com/
- **API Documentation**: https://qlmc-python-backend.onrender.com/docs
- **Health Check**: https://qlmc-python-backend.onrender.com/health
- **Vercel Dashboard**: https://vercel.com/dashboard

---

Made with ❤️ - Deploy in 5 minutes!
