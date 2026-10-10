import { NextRequest, NextResponse } from 'next/server';

let rawKey = (process.env.OPENAI_API_KEY || '').replace(/^["']|["']$/g, '').trim();
// Automatically fix if missing leading 's' (e.g. k-proj- -> sk-proj-)
if (rawKey.startsWith('k-proj-')) {
  rawKey = 's' + rawKey;
}
const OPENAI_API_KEY = rawKey;
const OPENAI_MODEL = (process.env.OPENAI_MODEL || 'gpt-5-nano').replace(/^["']|["']$/g, '').trim();

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const { messages, mode } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const isGpt5OrReasoning = OPENAI_MODEL.startsWith('gpt-5') || OPENAI_MODEL.startsWith('o1') || OPENAI_MODEL.startsWith('o3');

    const requestBody: Record<string, unknown> = {
      model: OPENAI_MODEL,
      messages,
      max_completion_tokens: mode === 'insight-extraction' ? 1500 : 800,
    };

    if (!isGpt5OrReasoning) {
      requestBody.temperature = mode === 'insight-extraction' ? 0.3 : 0.8;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
