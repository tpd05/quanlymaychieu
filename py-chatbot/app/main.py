import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List, Dict

import torch

def device_str() -> str:
    if torch.cuda.is_available():
        return f"cuda:{torch.cuda.current_device()}"
    return "cpu"

app = FastAPI(title="QLMC Chatbot Service", version="0.1.0")


class ParseIn(BaseModel):
    text: str
    user: Optional[Dict] = None


class ParseOut(BaseModel):
    intent: str
    confidence: float
    entities: Dict


class RagIn(BaseModel):
    question: str
    top_k: int = 5


class RagOut(BaseModel):
    answer: str
    sources: List[Dict]
    passages: List[str]
    confidence: float


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "torch_version": torch.__version__,
        "cuda_available": torch.cuda.is_available(),
        "device": device_str(),
    }


@app.post("/nlp/parse", response_model=ParseOut)
async def parse(inp: ParseIn):
    # TODO: replace with intent classifier + NER
    intent = "faq_general"
    entities: Dict = {}
    return ParseOut(intent=intent, confidence=0.6, entities=entities)


@app.post("/rag/answer", response_model=RagOut)
async def rag_answer(inp: RagIn):
    # TODO: FAISS retrieval + extractive QA
    return RagOut(
        answer="Đây là trả lời mẫu từ dịch vụ chatbot.",
        sources=[{"docId": "doc_1", "title": "Quy định sử dụng", "snippet": "..."}],
        passages=["..."],
        confidence=0.7,
    )
