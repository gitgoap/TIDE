import { NextRequest, NextResponse } from 'next/server';

const SMALLEST_API_KEY = process.env.SMALLEST_API_KEY?.replace(/^"|"$/g, '').trim();

export async function POST(request: NextRequest) {
  if (!SMALLEST_API_KEY) {
    return NextResponse.json(
      { error: 'Smallest AI API key not configured. Please check SMALLEST_API_KEY in .env.local.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = audioFile.type || 'audio/webm';

    // Smallest AI Pulse STT endpoint
    const response = await fetch('https://api.smallest.ai/waves/v1/stt/?model=pulse&language=en', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SMALLEST_API_KEY}`,
        'Content-Type': contentType,
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Smallest AI STT API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Smallest AI STT error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const transcribedText = data.transcription || data.text || '';

    return NextResponse.json({ text: transcribedText });
  } catch (error) {
    console.error('STT API internal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
