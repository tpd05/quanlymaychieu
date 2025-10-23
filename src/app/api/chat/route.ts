import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const role = user?.role ?? 'teacher';
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const baseUrl = process.env.PY_CHATBOT_URL || 'http://127.0.0.1:8001';

    let parse: any = { intent: 'unknown', entities: {} };
    try {
      const parseRes = await fetch(`${baseUrl}/nlp/parse`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: message }),
        cache: 'no-store',
      });
      if (!parseRes.ok) {
        const detail = await parseRes.text();
        return NextResponse.json({ error: 'AI parse failed', detail }, { status: 502 });
      }
      parse = await parseRes.json();
    } catch (e: any) {
      return NextResponse.json({ error: 'AI service unavailable', detail: String(e?.message || e) }, { status: 503 });
    }

    try {
      const ragRes = await fetch(`${baseUrl}/rag/answer?role=${encodeURIComponent(role)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: message, top_k: 5 }),
        cache: 'no-store',
      });
      if (!ragRes.ok) {
        const detail = await ragRes.text();
        return NextResponse.json({ error: 'AI answer failed', detail }, { status: 502 });
      }
      const rag = await ragRes.json();
      return NextResponse.json({ intent: parse.intent, entities: parse.entities, ...rag });
    } catch (e: any) {
      return NextResponse.json({ error: 'AI service unavailable', detail: String(e?.message || e) }, { status: 503 });
    }

  } catch (err) {
    console.error('Chat API error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
