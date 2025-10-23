# 🐍 Deploy Python AI Backend lên Render

## 📋 Tổng Quan

Backend Python FastAPI này cung cấp:
- **RAG (Retrieval-Augmented Generation)**: Trả lời câu hỏi dựa trên tài liệu
- **Vector Search**: FAISS với embedding model đa ngôn ngữ
- **Extractive QA**: XLM-RoBERTa cho câu trả lời chính xác
- **Feedback Learning**: Cải thiện kết quả dựa trên phản hồi người dùng

---

## 🚀 Bước 1: Chuẩn Bị Repository

### 1.1. Tạo Repository GitHub Riêng Cho Python Backend

```powershell
# Chuyển vào thư mục py-chatbot
cd py-chatbot

# Khởi tạo Git
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - Python AI Backend"

# Tạo repository trên GitHub
# Truy cập: https://github.com/new
# Tên: qlmc-python-backend
# Visibility: Private hoặc Public

# Connect và push
git remote add origin https://github.com/<YOUR_USERNAME>/qlmc-python-backend.git
git branch -M main
git push -u origin main
```

⚠️ **Lưu ý**: Backend Python cần repository **RIÊNG** vì Render chỉ build từ root directory.

---

## 🎯 Bước 2: Deploy Lên Render

### 2.1. Tạo Tài Khoản Render

1. Truy cập: **https://render.com/**
2. Click **Get Started** hoặc **Sign Up**
3. Chọn **Sign up with GitHub** (khuyến nghị)
4. Authorize Render truy cập GitHub

### 2.2. Tạo Web Service Mới

1. Trong Render Dashboard, click **New +** (góc trên phải)
2. Chọn **Web Service**
3. Connect repository:
   - Click **Connect account** nếu chưa connect GitHub
   - Tìm repository: `qlmc-python-backend`
   - Click **Connect**

### 2.3. Cấu Hình Web Service

Điền thông tin sau:

| Field | Value | Ghi chú |
|-------|-------|---------|
| **Name** | `qlmc-python-backend` | URL sẽ là: `qlmc-python-backend.onrender.com` |
| **Region** | `Singapore` hoặc `Oregon` | Chọn gần Việt Nam nhất |
| **Branch** | `main` | Branch chính |
| **Root Directory** | _(để trống)_ | Build từ root |
| **Runtime** | `Python 3` | Tự động detect |
| **Build Command** | `pip install -r requirements.txt` | Tự động điền |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` | Copy từ `Procfile` |
| **Instance Type** | **Free** | 512MB RAM, sleep sau 15 phút không dùng |

### 2.4. Thêm Environment Variables

Click **Advanced** → **Add Environment Variable**:

| Variable | Value | Bắt buộc |
|----------|-------|----------|
| `EMBED_MODEL` | `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` | ❌ (Mặc định) |
| `QA_MODEL_NAME` | `deepset/xlm-roberta-base-squad2` | ❌ (Mặc định) |
| `CHATBOT_DATA_DIR` | `/opt/render/project/src/store` | ✅ (Path lưu FAISS) |
| `FRONTEND_URL` | `https://qlmc.vercel.app` | ✅ (CORS) |
| `AUTOSAVE_SECONDS` | `300` | ❌ (Auto-save index) |
| `QA_TOP_CONTEXTS` | `3` | ❌ (Number of contexts) |

⚠️ **Quan trọng**: 
- `CHATBOT_DATA_DIR`: Render dùng `/opt/render/project/src` là working directory
- `FRONTEND_URL`: URL của Next.js frontend trên Vercel (thêm sau khi deploy frontend)

### 2.5. Deploy

1. Kéo xuống dưới, click **Create Web Service**
2. Render sẽ bắt đầu build:
   - Installing dependencies (2-3 phút)
   - Downloading ML models (5-7 phút - models lớn ~500MB)
   - Starting service
3. Đợi status chuyển sang **Live** (màu xanh)

---

## 🧪 Bước 3: Kiểm Tra Backend

### 3.1. Test Health Endpoint

```powershell
# Thay <your-service-name> bằng tên service của bạn
curl https://qlmc-python-backend.onrender.com/health
```

**Kết quả mong đợi**:
```json
{
  "status": "ok",
  "torch_version": "2.4.1+cpu",
  "cuda_available": false,
  "device": "cpu",
  "st_device": "cpu",
  "embed_model": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
  "qa_model": "deepset/xlm-roberta-base-squad2",
  "index_size": 0,
  "emb_dim": 384,
  "data_dir": "/opt/render/project/src/store",
  "autosave_seconds": 300
}
```

### 3.2. Test RAG Answer

```powershell
curl -X POST "https://qlmc-python-backend.onrender.com/rag/answer" `
  -H "Content-Type: application/json" `
  -d '{"question": "Máy chiếu bị mờ hình phải làm sao?", "top_k": 5}'
```

**Kết quả ban đầu** (chưa có data):
```json
{
  "answer": "Hiện chưa có tài liệu phù hợp để trả lời câu hỏi này.",
  "sources": [],
  "passages": [],
  "confidence": 0.2
}
```

### 3.3. Test Index Stats

```powershell
curl https://qlmc-python-backend.onrender.com/index/stats
```

---

## 🔗 Bước 4: Cập Nhật Frontend Vercel

### 4.1. Lấy URL Backend

Copy URL từ Render Dashboard:
```
https://qlmc-python-backend.onrender.com
```

### 4.2. Thêm Environment Variable Vào Vercel

1. Vào Vercel Dashboard: https://vercel.com/
2. Chọn project **qlmc**
3. Vào **Settings** → **Environment Variables**
4. Add variable mới:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_PYTHON_BACKEND_URL` | `https://qlmc-python-backend.onrender.com` |

5. Click **Save**
6. **Redeploy** project:
   - Vào tab **Deployments**
   - Click **...** (3 dots) trên latest deployment
   - Click **Redeploy**

### 4.3. Test ChatWidget

1. Truy cập: `https://qlmc.vercel.app`
2. Login với tài khoản teacher/admin
3. Click vào **ChatWidget** góc dưới phải
4. Gõ câu hỏi: "Máy chiếu bị mờ hình phải làm sao?"
5. Kiểm tra phản hồi

---

## 📊 Bước 5: Seed AI Knowledge (Tùy chọn)

### 5.1. Chạy Cron Job Từ Next.js

Sau khi deploy xong cả frontend và backend, trigger daily AI learning:

```powershell
# Thay CRON_SECRET bằng giá trị trong Vercel Environment Variables
curl -X POST "https://qlmc.vercel.app/api/cron/daily-ai-learning" `
  -H "Authorization: Bearer <CRON_SECRET>"
```

Hoặc đợi Vercel Cron tự động chạy vào 00:00 hàng ngày.

### 5.2. Kiểm Tra Index Size

```powershell
curl https://qlmc-python-backend.onrender.com/index/stats
```

Sau khi seed, `index_size` sẽ > 0.

---

## ⚙️ Giải Thích Các File Đã Tạo

### 1. `Procfile`
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
- Định nghĩa start command cho Render
- `$PORT`: Biến môi trường Render tự inject

### 2. `runtime.txt` và `.python-version`
```
python-3.11.10
```
- Chỉ định Python version cho Render
- Đảm bảo compatibility với dependencies

### 3. `.gitignore`
- Bỏ qua `store/` (FAISS index và metadata)
- Bỏ qua `.venv/`, `__pycache__/`
- Index sẽ tự động tạo mới khi seed

### 4. Updated `requirements.txt`
- Thêm `torch==2.4.1` và `numpy==1.26.4` để đảm bảo version compatibility
- Dùng `faiss-cpu` thay vì `faiss-gpu` (Render Free không có GPU)

### 5. Updated CORS in `main.py`
```python
allow_origins=[
    ...,
    "https://*.vercel.app",
    os.getenv("FRONTEND_URL", ""),
]
```
- Cho phép tất cả Vercel preview deployments
- Cho phép custom domain từ `FRONTEND_URL`

---

## 🐛 Troubleshooting

### ❌ Error: "Build failed - pip install failed"

**Nguyên nhân**: Dependencies không tương thích

**Giải pháp**:
1. Kiểm tra `requirements.txt` có đầy đủ versions
2. Thử build local:
   ```powershell
   cd py-chatbot
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
3. Fix lỗi local rồi commit lại

### ❌ Error: "Application failed to respond"

**Nguyên nhân**: Service không start được do lỗi code

**Giải pháp**:
1. Vào Render Dashboard → **Logs**
2. Tìm error message (thường là Python traceback)
3. Fix lỗi trong code
4. Push code mới, Render sẽ auto-redeploy

### ❌ Error: "CORS policy blocked"

**Nguyên nhân**: Frontend URL không có trong `allow_origins`

**Giải pháp**:
1. Vào Render → **Environment** → Thêm/sửa `FRONTEND_URL`
2. Giá trị: `https://qlmc.vercel.app` (không có trailing slash)
3. Click **Manual Deploy** → **Deploy latest commit**

### ❌ Warning: "Service sleeping after 15 minutes"

**Đây là tính năng Free tier**:
- Service sẽ sleep sau 15 phút không có request
- Request đầu tiên sau khi sleep sẽ mất 30-60s để wake up
- **Giải pháp**: Upgrade lên Starter plan ($7/tháng) để tránh sleep

### ❌ Error: "FAISS index not found"

**Nguyên nhân**: Chưa seed knowledge base

**Giải pháp**:
1. Chạy cron job từ Next.js (xem Bước 5.1)
2. Hoặc manual seed bằng cách call `/embed` API

---

## 🎉 Hoàn Tất!

Backend Python của bạn đã live tại:
```
https://qlmc-python-backend.onrender.com
```

### Các API Endpoints Chính:

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/health` | GET | Kiểm tra service health |
| `/rag/answer` | POST | Trả lời câu hỏi (RAG) |
| `/search` | POST | Vector search |
| `/embed` | POST | Add documents to index |
| `/index/stats` | GET | Thống kê index |
| `/index/save` | POST | Lưu index xuống disk |
| `/index/load` | POST | Load index từ disk |
| `/feedback/update` | POST | Update feedback scores |

### API Documentation (Swagger UI):
```
https://qlmc-python-backend.onrender.com/docs
```

---

## 📝 Các Bước Tiếp Theo

1. ✅ **Test ChatWidget** trên frontend Vercel
2. ✅ **Monitor Logs** trong Render Dashboard
3. ✅ **Seed Knowledge** bằng cron job
4. 🔄 **Auto-deploy**: Mỗi lần push code mới lên GitHub, Render tự động build và deploy

---

## 💰 Chi Phí

**Render Free Tier**:
- ✅ **0đ/tháng** (miễn phí mãi mãi)
- ⚠️ Giới hạn:
  - 512MB RAM
  - Service sleep sau 15 phút không dùng
  - 750 hours/tháng (đủ dùng cho 1 service)

**Render Starter ($7/tháng)**:
- 512MB RAM
- **KHÔNG sleep**
- Unlimited hours
- Custom domain

---

## 🔐 Bảo Mật

**Lưu ý quan trọng**:
- ⚠️ Backend hiện **KHÔNG có authentication**
- API endpoints public, ai cũng có thể gọi
- **Khuyến nghị**: Thêm API key hoặc JWT verification cho production
- File `.env` và `.venv` đã được gitignore (an toàn)

**Để thêm bảo mật**:
1. Thêm `API_KEY` vào Render Environment Variables
2. Validate header `Authorization: Bearer <API_KEY>` trong mỗi endpoint
3. Hoặc dùng JWT từ Next.js frontend

---

## 📚 Tài Liệu Tham Khảo

- **Render Docs**: https://render.com/docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **FAISS**: https://github.com/facebookresearch/faiss
- **Transformers**: https://huggingface.co/docs/transformers

