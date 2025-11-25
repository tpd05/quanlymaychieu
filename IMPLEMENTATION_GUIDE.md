# 📘 Hướng Dẫn Triển Khai Các Cải Thiện

## 🎯 Tổng Quan

Tài liệu này hướng dẫn chi tiết cách triển khai các cải thiện đã đề xuất trong `IMPROVEMENTS.md`.

---

## 1. Semantic Search với Python Backend

### Bước 1: Cài đặt dependencies

```bash
# Frontend - đã có sẵn, không cần cài thêm
# Python backend - đã có sẵn
```

### Bước 2: Cập nhật Chat API

1. **Backup file hiện tại:**
```bash
cp src/app/api/chat/route.ts src/app/api/chat/route.ts.backup
```

2. **Thay thế bằng enhanced version:**
```bash
cp src/app/api/chat/route.enhanced.ts src/app/api/chat/route.ts
```

3. **Cài đặt cache library:**
```bash
npm install lru-cache
npm install --save-dev @types/lru-cache
```

### Bước 3: Kiểm tra environment variables

Đảm bảo có trong `.env`:
```env
NEXT_PUBLIC_PYTHON_BACKEND_URL=http://127.0.0.1:8001
# hoặc production URL
NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-backend.onrender.com
```

### Bước 4: Test

```bash
# Start development servers
npm run dev

# Test semantic search
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your-token" \
  -d '{"message": "Cách đặt máy chiếu", "useSemantic": true}'
```

**Expected response:**
```json
{
  "answer": "...",
  "sources": ["doc1", "doc2"],
  "confidence": 0.85,
  "method": "semantic"
}
```

---

## 2. LLM Generation với Google Gemini

### Bước 1: Cài đặt Google Generative AI

```bash
cd py-chatbot
pip install google-generativeai
```

### Bước 2: Cập nhật Python backend

1. **Thêm vào `py-chatbot/app/main.py`:**

```python
# Import enhanced RAG
from app.rag_enhanced import generate_with_context

# Update rag_answer endpoint
@app.post("/rag/answer", response_model=RagOut)
async def rag_answer(inp: RagIn, context: Optional[List[Dict]] = None):
    # Search for relevant passages
    hits = await search(SearchIn(query=inp.question, top_k=inp.top_k))
    
    if not hits.hits:
        return RagOut(
            answer="Hiện chưa có tài liệu phù hợp để trả lời câu hỏi này.",
            sources=[],
            passages=[],
            confidence=0.2,
        )
    
    # Generate with Gemini
    search_hits = [
        SearchHit(docId=h.docId, text=h.text, score=h.score) 
        for h in hits.hits
    ]
    
    result = generate_with_context(
        question=inp.question,
        hits=search_hits,
        context=context
    )
    
    sources = [{"docId": h.docId, "title": h.docId} for h in hits.hits[:3]]
    
    return RagOut(
        answer=result["answer"],
        sources=sources,
        passages=[h.text for h in hits.hits],
        confidence=result["confidence"]
    )
```

### Bước 3: Cấu hình API Key

Thêm vào `py-chatbot/.env`:
```env
GOOGLE_API_KEY=your-gemini-api-key-here
```

### Bước 4: Test

```bash
# Test Gemini generation
curl -X POST http://127.0.0.1:8001/rag/answer \
  -H "Content-Type: application/json" \
  -d '{"question": "Cách đặt máy chiếu", "top_k": 3}'
```

---

## 3. Conversation Context & Memory

### Bước 1: Cập nhật ChatWidget

Trong `src/components/ChatWidget/ChatWidget.tsx`:

```typescript
const sendMessage = async () => {
  // Build conversation context (last 5 messages)
  const recentMessages = messages.slice(-5).map(m => ({
    role: m.role,
    content: m.content
  }));
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: inputValue.trim(),
      context: recentMessages, // Send context
      useSemantic: true
    }),
  });
  
  // ... rest of code
};
```

### Bước 2: Cập nhật API để nhận context

API đã được cập nhật trong `route.enhanced.ts` để xử lý context.

### Bước 3: Test

1. Mở ChatWidget
2. Hỏi: "Cách đặt máy chiếu?"
3. Hỏi follow-up: "Cần những gì?" (AI sẽ hiểu context)

---

## 4. Caching Mechanism

### Bước 1: Cài đặt LRU Cache

```bash
npm install lru-cache
npm install --save-dev @types/lru-cache
```

### Bước 2: Sử dụng cache utilities

File `src/lib/cache.ts` đã được tạo sẵn. Chỉ cần import:

```typescript
import { getCachedAnswer, setCachedAnswer, shouldCache } from '@/lib/cache';
```

### Bước 3: Test caching

```bash
# First request (cache miss)
curl -X POST http://localhost:3000/api/chat \
  -d '{"message": "Cách đặt máy chiếu"}'

# Second request (cache hit - should be faster)
curl -X POST http://localhost:3000/api/chat \
  -d '{"message": "Cách đặt máy chiếu"}'
```

**Expected:** Response có field `cached: true` ở lần 2.

---

## 5. Error Handling & Retry Logic

### Bước 1: Sử dụng retry utilities

File `src/lib/retry.ts` đã được tạo sẵn. API enhanced đã tích hợp retry logic.

### Bước 2: Test retry

1. Tắt Python backend
2. Gửi request → Should fallback to keyword search
3. Bật Python backend
4. Gửi request → Should use semantic search

---

## 📊 Testing Checklist

### Unit Tests

```bash
# Test cache
npm test -- cache.test.ts

# Test retry
npm test -- retry.test.ts
```

### Integration Tests

```bash
# Test chat API
npm test -- chat.test.ts

# Test Python backend
cd py-chatbot
pytest tests/test_rag.py
```

### Manual Testing

- [ ] Semantic search works
- [ ] Fallback to keyword search works
- [ ] Caching works (check response time)
- [ ] Retry logic works (simulate backend down)
- [ ] Context-aware responses work
- [ ] Gemini generation works
- [ ] Error handling works

---

## 🚀 Deployment

### Frontend (Vercel)

1. **Commit changes:**
```bash
git add .
git commit -m "feat: Enhanced chatbot with semantic search and Gemini"
git push origin main
```

2. **Vercel sẽ auto-deploy**

3. **Verify:**
```bash
curl https://your-app.vercel.app/api/chat \
  -d '{"message": "test"}'
```

### Python Backend (Render)

1. **Update requirements.txt:**
```txt
google-generativeai==0.8.3
```

2. **Update environment variables:**
```
GOOGLE_API_KEY=your-key
```

3. **Deploy:**
```bash
git push origin main
# Render auto-deploys
```

---

## 🐛 Troubleshooting

### Issue: Python backend not responding

**Solution:**
- Check `NEXT_PUBLIC_PYTHON_BACKEND_URL` in `.env`
- Verify Python backend is running
- Check network connectivity

### Issue: Gemini API errors

**Solution:**
- Verify `GOOGLE_API_KEY` is set
- Check API quota
- Verify API key permissions

### Issue: Cache not working

**Solution:**
- Check cache size limits
- Verify cache key generation
- Check TTL settings

---

## 📈 Performance Monitoring

### Metrics to track:

1. **Response time:**
   - Semantic search: ~1-3s
   - Keyword search: ~50-200ms
   - Cached: ~10-50ms

2. **Cache hit rate:**
   - Target: > 30%

3. **Error rate:**
   - Target: < 1%

### Monitoring tools:

- Vercel Analytics
- Render Metrics
- Custom logging

---

## 📝 Notes

- **Backward compatibility:** Enhanced API vẫn tương thích với code cũ
- **Gradual rollout:** Có thể enable/disable features qua feature flags
- **Testing:** Luôn test trên staging trước khi deploy production

---

**Last Updated:** 2024-01-XX
**Version:** 1.0.0

