import { NextRequest, NextResponse } from 'next/server';

const SMALLEST_API_KEY = process.env.SMALLEST_API_KEY?.replace(/^["']|["']$/g, '').trim();

export async function POST(request: NextRequest) {
  if (!SMALLEST_API_KEY) {
    return NextResponse.json(
      { error: 'Smallest AI API key not configured. Please set SMALLEST_API_KEY in your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://waves-api.smallest.ai/api/v1/lightning/get_speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SMALLEST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.slice(0, 1000), // Limit text length
        voice_id: 'emily',
        sample_rate: 24000,
        speed: 1.0,
        add_wav_header: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Smallest AI TTS error:', response.status, errorText);
      return NextResponse.json(
        { error: `Text-to-speech error: ${response.status}` },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
