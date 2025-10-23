# Scripts Directory

## 📁 Available Scripts

### `generate_knowledge.py` - Generate Knowledge Base JSON

**Mục đích:** Tạo file `data/knowledge.vi.json` với cấu trúc metadata đầy đủ.

**Cách sử dụng:**

```bash
cd scripts
python generate_knowledge.py
```

**Output:**
```
✅ Created knowledge.vi.json with 30 documents
Each document has: docId, title, role, intent, keywords, content
```

**Chỉnh sửa:**

Mở file `generate_knowledge.py` và thêm/sửa documents trong list `knowledge_base`:

```python
{
    "docId": "new-document",
    "title": "Tiêu đề mới",
    "role": ["teacher"],  # or ["technician"], ["admin"], ["teacher", "admin"]
    "intent": "new_intent",
    "keywords": ["từ", "khóa", "liên", "quan"],
    "content": "Nội dung chi tiết..."
}
```

Sau đó chạy lại script để generate file JSON mới.

---

## 🔧 Future Scripts

### Planned:
- `validate_knowledge.py` - Validate JSON structure
- `analyze_keywords.py` - Analyze keyword distribution
- `merge_duplicates.py` - Find and merge duplicate docs
- `generate_intents.py` - Auto-generate intent list

---

**Note:** Always retrain AI after updating knowledge.vi.json!
