import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/voice/morgott
 * Proxies text → ElevenLabs TTS so the API key stays server-side.
 * Body: { text: string }
 * Returns: audio/mpeg stream
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId =
    process.env.ELEVENLABS_MORGOTT_VOICE_ID ?? 'pNInz6obpgDQGcFmaJgB'; // Adam fallback

  if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
    // No key configured — return a 204 so the modal still shows silently
    return new NextResponse(null, { status: 204 });
  }

  let text: string;
  try {
    const body = await req.json();
    text = body?.text ?? "PUT THESE FOOLISH AMBITIONS TO REST!";
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.25,        // low stability = more dramatic variation
            similarity_boost: 0.85,
            style: 0.95,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error('[Morgott API] ElevenLabs error:', elevenRes.status, errText);
      return NextResponse.json(
        { error: 'ElevenLabs API error', detail: errText },
        { status: elevenRes.status },
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[Morgott API] Fetch failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
