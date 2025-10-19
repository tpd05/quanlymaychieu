# QLMC Chatbot (PyTorch, FastAPI, GPU)

This service provides NLP parsing and RAG answers using PyTorch. It is designed to run with GPU (CUDA) when available.

## Prerequisites
- Python 3.10+
- NVIDIA GPU + CUDA 12.1 drivers (matching torch 2.4.1+cu121)

## Setup (Windows PowerShell)

```powershell
# 1) Create venv and activate (use 'python' instead of 'py')
python -m venv .venv; .\.venv\Scripts\Activate.ps1

# If activation is blocked by policy, run this in the same PowerShell:
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 2) Upgrade pip
python -m pip install --upgrade pip

# 3) Install CUDA-enabled PyTorch (CUDA 12.1). If you don't have CUDA, skip to step 4.
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# 4) Install remaining dependencies
pip install -r requirements.txt

# 5) Run the service
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Check health:
```powershell
curl http://127.0.0.1:8001/health
```

Expected JSON includes: `cuda_available: true` and `device: cuda:0` if GPU is used.

## Environment in Next.js
Set the Python service URL:
```
PY_CHATBOT_URL=http://127.0.0.1:8001
```

## Next steps
- Add FAISS index build and retrieval pipeline
- Add intent classifier and NER models (PhoBERT/XLM-R)
- Implement extractive QA model for Vietnamese
- Secure endpoints and rate-limit

## Troubleshooting
- 'py' not found: Use `python` instead of `py` on Windows.
- Python 3.13 wheels for PyTorch may not be available yet. If install fails:
	- Option A (recommended): Use Conda
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
