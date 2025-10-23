# ✅ Fix ChatWidget "AI service unavailable" - Summary

## 🐛 Root Cause

**Vấn đề**: ChatWidget báo lỗi `{error: "AI service unavailable", detail: "fetch failed"}`

**Nguyên nhân gốc rễ**:
1. ❌ **Next.js API routes dùng sai env var**: Dùng `PY_CHATBOT_URL` nhưng Vercel được set `NEXT_PUBLIC_PYTHON_BACKEND_URL`
2. ❌ **Python backend CORS chưa đủ**: Wildcard `https://*.vercel.app` không hoạt động đúng với FastAPI

---

## ✅ Đã Fix

### 1. **Backend Python (Render)** - CORS Configuration

**File**: `py-chatbot/app/main.py`

**Thay đổi**:
```python
# Before: Wildcard không work
allow_origins=["...", "https://*.vercel.app", ...]

# After: Dùng regex pattern
allow_origin_regex = r"^https:\/\/.*\\.vercel\.app$"
```

**Thêm mới**:
- ✅ Environment variable `FRONTEND_URL` support
- ✅ Debug endpoint: `GET /debug/origin` để check headers

**Status**: ✅ Pushed to GitHub → Render đang auto-redeploy

---

### 2. **Frontend Next.js (Vercel)** - Env Var Fix

**Files đã sửa**:
- `src/app/api/chat/route.ts`
- `src/app/api/chatbot-train/route.ts`
- `src/app/api/chatbot-train-from-text/route.ts`
- `src/app/api/chatbot-feedback/route.ts`

**Thay đổi**:
```typescript
// Before
const baseUrl = process.env.PY_CHATBOT_URL || 'http://127.0.0.1:8001';

// After
const baseUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || process.env.PY_CHATBOT_URL || 'http://127.0.0.1:8001';
```

**Status**: ✅ Pushed to GitHub → Vercel đang auto-redeploy

---

## 🧪 Kiểm Tra Sau Khi Deploy Xong

### 1. Check Render Backend (1-2 phút)

```powershell
# Test health endpoint
curl https://qlmc-python-backend.onrender.com/health

# Test debug endpoint (xem CORS headers)
curl https://qlmc-python-backend.onrender.com/debug/origin
```

**Expected**: Status 200, JSON response

---

### 2. Check Vercel Frontend (2-3 phút)

1. Đợi Vercel build xong (xem tab Deployments)
2. Truy cập: `https://qlmc-<your-id>.vercel.app`
3. Login: `admin@qlmc.com` / `Admin123!`
4. Click **ChatWidget** (góc dưới phải)
5. Gõ câu hỏi: "Máy chiếu bị mờ hình phải làm sao?"

**Expected**: 
- ✅ Không còn lỗi "fetch failed"
- ✅ AI trả lời (có thể là "Hiện chưa có tài liệu..." nếu chưa seed)

---

### 3. Optional: Set FRONTEND_URL trong Render

Để tăng security, nên set exact URL thay vì wildcard:

1. Vào **Render Dashboard**: https://dashboard.render.com/
2. Chọn service **qlmc-python-backend**
3. **Environment** → Edit `FRONTEND_URL`
4. Set value: `https://qlmc-<your-actual-id>.vercel.app` (URL thật từ Vercel)
5. Save → Manual Deploy

---

## 🔧 Nếu Vẫn Lỗi

### Lỗi: "CORS policy blocked"

**Check**:
1. Mở DevTools (F12) → Console
2. Xem error message chi tiết
3. Copy exact origin bị block

**Fix**:
```powershell
# Test debug endpoint với origin header
curl -H "Origin: https://qlmc-abc123.vercel.app" https://qlmc-python-backend.onrender.com/debug/origin
```

Nếu thấy origin không match, cần update `FRONTEND_URL` trong Render.

---

### Lỗi: "Connection timeout"

**Nguyên nhân**: Render Free tier sleep sau 15 phút

**Giải pháp**:
1. Request đầu tiên sẽ mất 30-60s để wake up
2. Refresh và thử lại
3. Hoặc setup keep-alive ping (xem `QUICK_DEPLOY.md`)

---

### Lỗi: "AI service unavailable" (vẫn còn)

**Check env vars trong Vercel**:
1. Vào Vercel → Project Settings → Environment Variables
2. Kiểm tra: `NEXT_PUBLIC_PYTHON_BACKEND_URL` = `https://qlmc-python-backend.onrender.com`
3. Nếu sai hoặc thiếu: Update và Redeploy

---

## 📊 Timeline Deploy

| Service | Status | Time | URL |
|---------|--------|------|-----|
| **Render** (Python) | 🔄 Building | 1-2 min | https://qlmc-python-backend.onrender.com |
| **Vercel** (Next.js) | 🔄 Building | 2-3 min | https://qlmc-<your-id>.vercel.app |

**Total**: ~3-5 phút để cả 2 services redeploy xong

---

## 🎯 Next Steps

1. ✅ **Đợi Render redeploy** (check https://dashboard.render.com/)
2. ✅ **Đợi Vercel redeploy** (check https://vercel.com/dashboard)
3. ✅ **Test ChatWidget** như hướng dẫn bên trên
4. ⏭️ **Seed knowledge base** nếu ChatWidget chưa có data (xem `VERCEL_QUICK_DEPLOY.md` Bước 6)

---

## 📚 Tài Liệu Liên Quan

- **Render Logs**: https://dashboard.render.com/ → qlmc-python-backend → Logs
- **Vercel Logs**: https://vercel.com/ → qlmc → Deployments → Latest → Functions
- **CORS Debug**: `GET /debug/origin` endpoint
- **Health Check**: `GET /health` endpoint

---

Made with ❤️ - Fix deployed successfully!
