import { NextRequest, NextResponse } from 'next/server';
import { requireAnyRole } from '@/utils/auth';
import { promises as fs } from 'fs';
import path from 'path';
import { KnowledgeItem } from '@/types/knowledge';

// Simple sentence chunking by punctuation and length
function chunkText(text: string, maxLen = 300): string[] {
  const parts = text
    .replace(/\r\n/g, ' ')
    .split(/(?<=[\.!?。！？])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let buf: string[] = [];
  let bufLen = 0;
  for (const s of parts) {
    if (bufLen + s.length + 1 > maxLen && bufLen > 0) {
      chunks.push(buf.join(' '));
      buf = [];
      bufLen = 0;
    }
    buf.push(s);
    bufLen += s.length + 1;
  }
  if (bufLen > 0) chunks.push(buf.join(' '));
  return chunks.length ? chunks : [text];
}

export async function POST(req: NextRequest) {
  try {
    try {
      await requireAnyRole(['admin', 'technician']);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file = 'knowledge.vi.json' } = await req.json().catch(() => ({}));
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, String(file));
    const content = await fs.readFile(filePath, 'utf-8');
    const items: KnowledgeItem[] = JSON.parse(content);

    const baseUrl = process.env.PY_CHATBOT_URL || 'http://127.0.0.1:8001';

    let totalChunks = 0;
    for (const item of items) {
      const chunks = chunkText(item.content, 400);
      totalChunks += chunks.length;
      
      // Use 'role' field from the new format, fallback to default roles
      const rolesAllowed = item.role || ['teacher', 'technician', 'admin'];
      
      const res = await fetch(`${baseUrl}/embed`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          docId: item.docId, 
          chunks, 
          rolesAllowed,
          title: item.title,
          intent: item.intent,
          keywords: item.keywords
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: 'Embed failed', detail: errText }, { status: 502 });
      }
    }

    // Save index after training
    await fetch(`${baseUrl}/index/save`, { method: 'POST' }).catch(() => undefined);

    return NextResponse.json({ ok: true, docs: items.length, totalChunks });
  } catch (e: any) {
    return NextResponse.json({ error: 'Train failed', detail: String(e?.message || e) }, { status: 500 });
  }
}
