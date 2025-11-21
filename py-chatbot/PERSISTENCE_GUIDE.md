# Giải Pháp Persistence cho Python Chatbot trên Render

## Vấn Đề
Render tắt server sau khi không hoạt động → mất FAISS index trong RAM → phải train lại.

## Giải Pháp
**Lưu index vào Git (prebuilt directory)** để load lại khi server restart.

---

## Cách Hoạt Động

### 1. Khi Train/Embed Lần Đầu
- Index được lưu vào **2 nơi**:
  - `py-chatbot/store/` (ephemeral - mất khi Render restart)
  - `py-chatbot/prebuilt/` (persistent - commit vào Git)

### 2. Khi Server Restart (Render)
- **Priority 1**: Load từ `prebuilt/` (đã commit)
- **Priority 2**: Load từ `store/` (nếu có)
- **Priority 3**: Bootstrap từ `data/knowledge.vi.json`

### 3. Autosave
- Mỗi 5 phút (hoặc config) tự động lưu index
- Lưu vào cả `store/` và `prebuilt/`

---

## Cách Sử Dụng

### Bước 1: Train Lần Đầu (Local hoặc Render)

1. **Đảm bảo có file knowledge:**
   ```
   data/knowledge.vi.json
   ```

2. **Set environment variable:**
   ```bash
   BOOTSTRAP_KNOWLEDGE=1
   ```

3. **Start server:**
   ```bash
   cd py-chatbot
   python -m uvicorn app.main:app --reload --port 8001
   ```

4. **Xem log:**
   ```
   [startup] No existing index found. Bootstrapping from data/knowledge.vi.json...
   [startup] Encoding 150 chunks...
   [startup] ✅ Bootstrapped 150 chunks and saved to prebuilt/
   [startup] 📝 IMPORTANT: Commit py-chatbot/prebuilt/ to Git for persistence!
   ```

### Bước 2: Commit Index vào Git

```bash
git add py-chatbot/prebuilt/faiss.index
git add py-chatbot/prebuilt/meta.json
git commit -m "Add prebuilt FAISS index for persistence"
git push origin main
```

### Bước 3: Deploy lên Render

Render sẽ:
1. Clone repo (có `prebuilt/` directory)
2. Start server
3. Load index từ `prebuilt/` → **không cần train lại!**

---

## Kiểm Tra Hoạt Động

### Local Test

```bash
# Terminal 1: Start server lần đầu (bootstrap)
cd py-chatbot
python -m uvicorn app.main:app --reload --port 8001

# Kiểm tra log:
# [startup] ✅ Bootstrapped X chunks and saved to prebuilt/

# Terminal 2: Test chat
curl -X POST http://localhost:8001/rag/answer \
  -H "Content-Type: application/json" \
  -d '{"question": "Máy chiếu là gì?"}'

# Terminal 1: Stop server (Ctrl+C)
# Start lại:
python -m uvicorn app.main:app --reload --port 8001

# Kiểm tra log:
# [startup] Found prebuilt index, loading...
# [startup] ✅ Successfully loaded prebuilt index with X documents
```

### Render Logs

Sau khi deploy, check Render logs:
```
[startup] Found prebuilt index, loading...
[startup] ✅ Successfully loaded prebuilt index with 150 documents
[startup] Index status: {'index_size': 150, 'emb_dim': 384, 'loaded': 150, 'source': 'prebuilt (Git)'}
```

---

## Cập Nhật Index (Thêm Dữ Liệu Mới)

### Option 1: Qua API (Recommended)

```bash
# Thêm documents mới
curl -X POST https://your-render-url.onrender.com/embed \
  -H "Content-Type: application/json" \
  -d '{
    "docId": "doc_new_001",
    "chunks": ["Nội dung mới 1", "Nội dung mới 2"],
    "title": "Tài liệu mới",
    "keywords": ["keyword1", "keyword2"]
  }'

# Lưu index (autosave sẽ tự động lưu sau 5 phút)
curl -X POST https://your-render-url.onrender.com/index/save
```

**Lưu ý:** Sau khi thêm qua API, phải **pull prebuilt từ Render về local** rồi commit:

```bash
# SSH vào Render hoặc dùng script download
# (Render không có shell access miễn phí)
# Hoặc chạy local, thêm data, rồi commit
```

### Option 2: Update Local & Commit

1. **Local: Update `data/knowledge.vi.json`**
2. **Xóa prebuilt cũ:**
   ```bash
   rm -rf py-chatbot/prebuilt/*
   ```
3. **Restart server để bootstrap lại:**
   ```bash
   BOOTSTRAP_KNOWLEDGE=1 python -m uvicorn app.main:app --reload --port 8001
   ```
4. **Commit prebuilt mới:**
   ```bash
   git add py-chatbot/prebuilt/
   git commit -m "Update chatbot knowledge base"
   git push
   ```
5. **Render sẽ auto-deploy** và load index mới

---

## Cấu Hình Environment Variables

### Local (.env)
```env
BOOTSTRAP_KNOWLEDGE=1
CHATBOT_DATA_DIR=./store
PREBUILT_INDEX_DIR=./prebuilt
KNOWLEDGE_JSON_PATH=../data/knowledge.vi.json
AUTOSAVE_SECONDS=300
```

### Render
```env
BOOTSTRAP_KNOWLEDGE=1
AUTOSAVE_SECONDS=300
```

---

## Troubleshooting

### Index không được lưu vào prebuilt/

**Kiểm tra permissions:**
```bash
ls -la py-chatbot/prebuilt/
# Phải có quyền write
```

**Kiểm tra log:**
```
[persistence] Warning: Could not save to prebuilt/: [Errno X] ...
```

### Server vẫn bootstrap mỗi lần restart

**Nguyên nhân:** Chưa commit `prebuilt/` vào Git.

**Giải pháp:**
```bash
git add py-chatbot/prebuilt/
git commit -m "Add prebuilt index"
git push
```

### Index size = 0 sau khi load

**Nguyên nhân:** File `meta.json` hoặc `faiss.index` bị corrupt.

**Giải pháp:**
```bash
rm py-chatbot/prebuilt/*
# Restart để bootstrap lại
```

---

## Best Practices

1. **Commit prebuilt sau mỗi lần update knowledge base**
2. **Backup prebuilt định kỳ** (Git history)
3. **Monitor autosave logs** để đảm bảo lưu thành công
4. **Test local trước khi deploy** lên Render
5. **Sử dụng MongoDB** cho index lớn (>100MB):
   - Lưu embeddings vào MongoDB collection
   - Load từ MongoDB khi startup
   - Faster & scalable hơn Git

---

## MongoDB Alternative (Cho Index Lớn)

Nếu index > 50MB, nên dùng MongoDB thay vì Git:

```python
# TODO: Implement MongoDB persistence
# - Store embeddings in MongoDB collection
# - Load on startup
# - Better for large datasets
```

---

## Summary

✅ **Train 1 lần** → Lưu vào `prebuilt/` → Commit Git  
✅ **Render restart** → Load từ `prebuilt/` → Không cần train lại  
✅ **Autosave** → Tự động lưu mọi thay đổi  
✅ **Scale** → MongoDB cho index lớn  

🎯 **Kết quả:** Người dùng luôn có thể chat ngay sau khi Render restart!
