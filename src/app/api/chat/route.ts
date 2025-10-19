import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const baseUrl = process.env.PY_CHATBOT_URL || 'http://127.0.0.1:8001';

    const parseRes = await fetch(`${baseUrl}/nlp/parse`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: message }),
      cache: 'no-store',
    });
    const parse = await parseRes.json();

    const ragRes = await fetch(`${baseUrl}/rag/answer`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: message }),
      cache: 'no-store',
    });
    const rag = await ragRes.json();

    return NextResponse.json({ intent: parse.intent, entities: parse.entities, ...rag });
  } catch (err) {
    console.error('Chat API error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
