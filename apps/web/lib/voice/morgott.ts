/**
 * Client-side utility to call our /api/voice/morgott route and play the audio.
 * The API key stays safely on the server; the client only receives an audio stream.
 */
export async function playMorgottVoice(): Promise<void> {
  try {
    const response = await fetch('/api/voice/morgott', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text:
          "PUT THESE FOOLISH AMBITIONS TO REST! " +
          "Thou art not yet worthy to walk this path. " +
          "Your coffers are bare. Return when you have gathered more gold, " +
          "lest you perish in the streets of your folly.",
      }),
    });

    if (!response.ok) {
      console.warn('[Morgott] Voice API returned', response.status, '— playing silently');
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;
    audio.play().catch(() => {
      // Browser may block autoplay — that's fine, the visual modal is still shown
      console.warn('[Morgott] Autoplay blocked by browser policy');
    });
  } catch (err) {
    // Network error — voice is optional, let it fail silently
    console.error('[Morgott] Failed to fetch voice audio:', err);
  }
}
