# QLMC Python AI Backend

🤖 Backend AI cho hệ thống Quản Lý Máy Chiếu (QLMC) sử dụng FastAPI, PyTorch, FAISS và Transformers.

## 🌟 Features

- **RAG (Retrieval-Augmented Generation)**: Trả lời câu hỏi dựa trên knowledge base
- **Vector Search**: FAISS với multilingual embedding model
- **Extractive QA**: XLM-RoBERTa cho câu trả lời chính xác
- **Feedback Learning**: Cải thiện ranking dựa trên user feedback
- **Persistent Storage**: Auto-save FAISS index và metadata
- **CORS Support**: Tích hợp với Next.js frontend

## 🚀 Tech Stack

- **FastAPI** 0.115.0 - Web framework
- **PyTorch** 2.4.1 - Deep learning
- **Transformers** 4.46.1 - NLP models
- **FAISS** 1.12.0 - Vector similarity search
- **Uvicorn** 0.30.6 - ASGI server

## 📦 Local Setup

### Prerequisites
- Python 3.11+
- pip

### Installation

```powershell
# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Activate (Linux/Mac)
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### Test

```powershell
curl http://127.0.0.1:8001/health
```

## ☁️ Deploy to Render

Xem hướng dẫn chi tiết tại: **[RENDER_DEPLOY.md](./RENDER_DEPLOY.md)**

### Quick Start

1. Push code lên GitHub (repository riêng)
2. Tạo Web Service trên Render
3. Connect repository
4. Cấu hình Environment Variables:
   - `CHATBOT_DATA_DIR=/opt/render/project/src/store`
   - `FRONTEND_URL=https://qlmc.vercel.app`
5. Deploy!

## 📚 API Endpoints

### Health Check
```
GET /health
```

### RAG Answer
```
POST /rag/answer
{
  "question": "Máy chiếu bị mờ hình phải làm sao?",
  "top_k": 5
}
```

### Vector Search
```
POST /search
{
  "query": "bảo trì máy chiếu",
  "top_k": 5,
  "role": "teacher"
}
```

### Embed Documents
```
POST /embed
{
  "docId": "doc-001",
  "chunks": ["Nội dung chunk 1", "Nội dung chunk 2"],
  "rolesAllowed": ["teacher", "admin"],
  "title": "Hướng dẫn bảo trì",
  "intent": "maintenance",
  "keywords": ["bảo trì", "vệ sinh"]
}
```

### Index Stats
```
GET /index/stats
```

### Save/Load Index
```
POST /index/save
POST /index/load
```

### Feedback Learning
```
POST /feedback/update
{
  "docId": "doc-001",
  "feedbackScore": 1.0  // Positive for like, negative for dislike
}
```

## 🧪 API Documentation

Swagger UI: `http://localhost:8001/docs`

## 📁 Project Structure

```
py-chatbot/
├── app/
│   └── main.py           # FastAPI application
├── build_static_index.py # Offline build of FAISS index (commit output in prebuilt/)
├── prebuilt/             # OPTIONAL committed index (faiss.index, meta.json)
├── store/                # FAISS index và metadata (gitignored)
│   ├── faiss.index
│   └── meta.json
├── requirements.txt      # Python dependencies
├── Procfile              # Render start command
├── runtime.txt           # Python version for Render
├── .python-version       # Python version
├── .gitignore
├── README.md
└── RENDER_DEPLOY.md      # Deploy guide
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EMBED_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | Embedding model |
| `QA_MODEL_NAME` | `deepset/xlm-roberta-base-squad2` | QA model |
| `CHATBOT_DATA_DIR` | `./store` | Path to FAISS index |
| `PREBUILT_INDEX_DIR` | `./prebuilt` | Directory containing committed prebuilt index |
| `BOOTSTRAP_KNOWLEDGE` | `0` | If `1`, auto-embed knowledge.vi.json on startup when empty |
| `KNOWLEDGE_JSON_PATH` | `../data/knowledge.vi.json` | Knowledge base file for bootstrap/build |
| `FRONTEND_URL` | - | Frontend URL for CORS |
| `AUTOSAVE_SECONDS` | `300` | Auto-save interval (0 to disable) |
| `QA_TOP_CONTEXTS` | `3` | Number of contexts for QA |

## 📊 Performance

- **Embedding**: ~100ms/query
- **Search**: ~10ms with 1000 documents
- **RAG Answer**: ~300ms (embedding + search + QA)
- **Memory**: ~500MB with models loaded

## 🔐 Security

⚠️ **Production Recommendations**:
- Add API key authentication
- Rate limiting
- Input validation
- HTTPS only

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. Contact project owner for contribution guidelines.

## 📧 Support

For issues and questions, contact: admin@qlmc.com

---

Made with ❤️ for QLMC Project
 - Automatic periodic save is enabled via `AUTOSAVE_SECONDS` (default 300 seconds). Set `AUTOSAVE_SECONDS=0` to disable.

Endpoints:

The service also attempts to auto-load the index on startup.

Quick test (PowerShell):
```powershell
# After adding some chunks via /embed
curl -Method POST http://127.0.0.1:8001/index/save

# Restart the service, then
curl -Method POST http://127.0.0.1:8001/index/load
curl http://127.0.0.1:8001/index/stats
```

## 🗄️ Persistent Pre-Trained Index
Render (free tier) puts services to sleep; on restart the Python process must reload embeddings. To avoid re-training manually each time, you can COMMIT a prebuilt FAISS index.

### Option A: Commit Prebuilt Files
1. Activate venv & install deps.
2. Run the offline build script:
  ```powershell
  python py-chatbot/build_static_index.py
  ```
3. This creates `py-chatbot/prebuilt/faiss.index` and `py-chatbot/prebuilt/meta.json`.
4. Commit those two files:
  ```powershell
  git add py-chatbot/prebuilt/faiss.index py-chatbot/prebuilt/meta.json
  git commit -m "chore(ai): add prebuilt faiss index"
  git push
  ```
5. On startup the service copies them into `store/` automatically.

### Option B: Auto Bootstrap From Knowledge
Set `BOOTSTRAP_KNOWLEDGE=1` (and ensure `knowledge.vi.json` exists). On cold start if index empty it will embed all documents.

### Updating Knowledge
After editing `data/knowledge.vi.json` re-run build:
```powershell
python py-chatbot/build_static_index.py
git add py-chatbot/prebuilt/*
git commit -m "feat(ai): refresh prebuilt index"
git push
```

### Verifying
```powershell
curl http://127.0.0.1:8001/index/stats
```
Fields:
- `index_size` > 0 and `files.index_exists=true` means load success.

### Notes
- Do NOT commit virtualenv or large HF model weights; only the small `faiss.index` + `meta.json`.
- If embedding model changes, rebuild index (dimension must match or it will auto-rebuild).

## Extractive QA (Vietnamese-friendly)
- The service uses a multilingual QA model by default: `deepset/xlm-roberta-base-squad2`.
- Configure via environment variable `QA_MODEL_NAME`.
- Control how many retrieved passages are sent to QA with `QA_TOP_CONTEXTS` (default 3).

Example environment variables (PowerShell):
```powershell

## Troubleshooting
- 'py' not found: Use `python` instead of `py` on Windows.
- Python 3.13 wheels for PyTorch may not be available yet. If install fails:
	- Option A (recommended): Use Conda
```
		```powershell
		conda create -n qlmc-chatbot python=3.10 -y; conda activate qlmc-chatbot
		pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
		pip install -r requirements.txt
		```
	- Option B: Install Python 3.10/3.11 from python.org and recreate venv using that version.
		```powershell
		"C:\\Path\\To\\Python310\\python.exe" -m venv .venv; .\.venv\Scripts\Activate.ps1
		python -m pip install --upgrade pip
		pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
		pip install -r requirements.txt
		```
