# 🏗️ Kiến Trúc Nâng Cấp Hệ Thống Chatbot

## 📋 Tổng Quan

Hệ thống đã được nâng cấp để tối ưu hóa performance và tránh cold start delays từ Render server.

---

## 🎯 Chiến Lược Mới

### 1. **Chat Bot cho Người Dùng** (User-facing)
- ✅ **Nguồn dữ liệu**: Local/Git/Vercel (không gọi Render)
- ✅ **File**: `py-chatbot/prebuilt/meta.json` và `faiss.index`
- ✅ **Lợi ích**: 
  - Không có cold start delay
  - Response time: 50-200ms
  - Không phụ thuộc Render server

### 2. **Train/Load Model** (Admin/Technician)
- ✅ **Khi train**: Gọi Render server → Train → Save vào MongoDB + Local
- ✅ **Khi load**: Gọi Render server → Load → Save vào MongoDB + Local
- ✅ **Lợi ích**:
  - Model được train trên Render (có GPU/CPU mạnh)
  - Sau khi train/load, model được lưu về local để dùng ngay

### 3. **Hiển Thị Stats** (Admin Dashboard)
- ✅ **Nguồn dữ liệu**: Local metadata (không gọi Render)
- ✅ **Fallback**: MongoDB nếu local không có
- ✅ **Lợi ích**:
  - Load nhanh, không cần đợi Render
  - Luôn có data để hiển thị

### 4. **AI Tự Học** (Daily Learning)
- ✅ **00:00 hàng ngày**: Tự động wake up Render server
- ✅ **Quy trình**:
  1. Wake up Render (30-60s)
  2. Phân tích feedback
  3. Update scores
  4. Save index vào MongoDB
- ✅ **Lợi ích**:
  - Tự động học từ feedback
  - Model được cập nhật hàng ngày

---

## 📊 Data Flow

### Chat Flow (User)
```
User → ChatWidget → /api/chat
  ↓
Load metadata từ py-chatbot/prebuilt/meta.json (local)
  ↓
Keyword search (in-memory)
  ↓
Return answer (50-200ms)
```

### Train Flow (Admin)
```
Admin → /api/chatbot-train
  ↓
Wake up Render server (nếu cần)
  ↓
POST /embed → Render (train từng document)
  ↓
POST /index/save → Render (save local)
  ↓
POST /index/save-to-mongodb → Render (save MongoDB)
  ↓
Return success
```

### Load Flow (Admin)
```
Admin → /api/python/load
  ↓
Wake up Render server
  ↓
POST /index/load → Render (load từ MongoDB/prebuilt)
  ↓
POST /index/save-to-mongodb → Render (save lại MongoDB)
  ↓
Return success
```

### Daily Learning Flow (Cron)
```
Vercel Cron (00:00) → /api/cron/daily-ai-learning
  ↓
Wake up Render server (30-60s)
  ↓
Phân tích feedback 24h qua
  ↓
POST /feedback/update → Render (update scores)
  ↓
POST /index/save-to-mongodb → Render (save updated index)
  ↓
Save learning log vào MongoDB
```

---

## 🔧 Implementation Details

### 1. Chat API (`/api/chat`)

**File**: `src/app/api/chat/route.ts`

```typescript
// Chỉ dùng local, không gọi Render
const metadata = loadFAISSMetadata(); // Từ prebuilt/meta.json
const results = keywordSearch(query, metadata, role);
return generateAnswer(query, results);
```

**Không gọi Render** → Fast response, no cold start

---

### 2. Stats API (`/api/python/stats`)

**File**: `src/app/api/python/stats/route.ts`

```typescript
// Đọc từ local metadata
const metadata = loadFAISSMetadata();
return {
  index_size: metadata.texts.length,
  emb_dim: 384,
  source: 'local'
};
```

**Fallback**: MongoDB nếu local không có

---

### 3. Train API (`/api/chatbot-train`)

**File**: `src/app/api/chatbot-train/route.ts`

```typescript
// Gọi Render để train
for (const item of items) {
  await fetch(`${renderUrl}/embed`, { ... });
}

// Save sau khi train
await fetch(`${renderUrl}/index/save`, { ... });
await fetch(`${renderUrl}/index/save-to-mongodb`, { ... });
```

**Lưu vào**: MongoDB + Render local storage

---

### 4. Load API (`/api/python/load`)

**File**: `src/app/api/python/load/route.ts`

```typescript
// Wake up Render trước
await withRenderServer(renderUrl, async () => {
  await fetch(`${renderUrl}/index/load`, { ... });
  await fetch(`${renderUrl}/index/save-to-mongodb`, { ... });
});
```

**Wake up**: Tự động wake up Render server

---

### 5. Daily Learning (`/api/cron/daily-ai-learning`)

**File**: `src/app/api/cron/daily-ai-learning/route.ts`

```typescript
// Wake up Render server
await wakeUpRenderServer(renderUrl, 6, 15000);

// Phân tích feedback
const feedbackData = await prisma.chatbotFeedback.findMany({ ... });

// Update scores
for (const [docId, data] of documentScores) {
  await fetch(`${renderUrl}/feedback/update`, { ... });
}

// Save updated index
await fetch(`${renderUrl}/index/save-to-mongodb`, { ... });
```

**Tự động**: Wake up Render vào 00:00 hàng ngày

---

## 🛠️ Render Server Wake-up Utility

**File**: `src/lib/render-utils.ts`

```typescript
// Wake up Render server
export async function wakeUpRenderServer(
  baseUrl: string,
  maxRetries: number = 5,
  retryDelay: number = 10000
): Promise<boolean>

// Check if server is awake
export async function isRenderServerAwake(baseUrl: string): Promise<boolean>

// Execute with wake-up
export async function withRenderServer<T>(
  baseUrl: string,
  fn: () => Promise<T>,
  options?: { ... }
): Promise<T>
```

**Strategy**:
- Retry với exponential backoff
- Timeout protection
- Health check trước khi thực hiện

---

## 📁 File Structure

```
qlmc/
├── src/
│   ├── app/api/
│   │   ├── chat/route.ts              # Chat (local only)
│   │   ├── python/
│   │   │   ├── stats/route.ts         # Stats (local)
│   │   │   ├── load/route.ts          # Load (Render + save)
│   │   │   └── save/route.ts          # Save (Render)
│   │   ├── chatbot-train/route.ts     # Train (Render + save)
│   │   └── cron/
│   │       └── daily-ai-learning/     # Learning (Render wake-up)
│   └── lib/
│       ├── faiss-search.ts            # Local search
│       └── render-utils.ts            # Render wake-up utilities
│
└── py-chatbot/
    └── prebuilt/                      # Git-committed index
        ├── faiss.index
        └── meta.json
```

---

## ✅ Benefits

### Performance
- ✅ **Chat response**: 50-200ms (không cần Render)
- ✅ **Stats load**: < 100ms (local)
- ✅ **No cold start**: User không phải đợi Render wake up

### Reliability
- ✅ **Fallback strategies**: Local → MongoDB → Error
- ✅ **Auto wake-up**: Daily learning tự động wake up Render
- ✅ **Error handling**: Graceful degradation

### Cost
- ✅ **Render usage**: Chỉ khi train/load/learning (minimal)
- ✅ **Vercel usage**: Chat và stats dùng local (free tier friendly)

---

## 🔄 Update Flow

### Khi Train Model Mới

1. Admin train → Render train → Save MongoDB
2. Index có trong MongoDB
3. Next deployment → Index được commit vào Git
4. User chat → Dùng index từ Git (fast)

### Khi Daily Learning

1. 00:00 → Wake up Render
2. Phân tích feedback → Update scores
3. Save updated index vào MongoDB
4. Next deployment → Updated index vào Git
5. User chat → Dùng updated index (better quality)

---

## 📝 Environment Variables

```env
# Render server URL (chỉ dùng cho train/load/learning)
NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-backend.onrender.com

# Cron secret (cho daily learning)
CRON_SECRET=your-secret-key
```

---

## 🚀 Deployment Notes

### Vercel
- ✅ Prebuilt index được commit vào Git
- ✅ Chat API dùng local index (fast)
- ✅ Cron job chạy daily learning (00:00)

### Render
- ✅ Chỉ wake up khi cần (train/load/learning)
- ✅ Index được save vào MongoDB
- ✅ Free tier friendly (minimal usage)

---

## 🐛 Troubleshooting

### Issue: Chat không hoạt động

**Check**:
1. `py-chatbot/prebuilt/meta.json` có tồn tại?
2. Index đã được train chưa?
3. Git có commit prebuilt files?

**Solution**:
```bash
# Train model
npm run train

# Commit prebuilt files
git add py-chatbot/prebuilt/
git commit -m "Update FAISS index"
git push
```

### Issue: Daily learning không chạy

**Check**:
1. Vercel Cron config trong `vercel.json`
2. CRON_SECRET environment variable
3. Render server URL

**Solution**:
```bash
# Test manually
curl -X POST https://your-app.vercel.app/api/cron/daily-ai-learning \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

**Last Updated**: 2024-01-XX
**Version**: 2.0.0

