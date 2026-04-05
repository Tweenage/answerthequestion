const PREFERRED_VOICES = [
  'Google UK English Female',
  'Google UK English Male',
  'Daniel',
  'Kate',
];

let cachedVoice: SpeechSynthesisVoice | null = null;

function getUKVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = speechSynthesis.getVoices();

  // Try preferred voices first
  for (const name of PREFERRED_VOICES) {
    const match = voices.find(v => v.name === name);
    if (match) { cachedVoice = match; return match; }
  }

  // Fall back to any en-GB voice
  const enGB = voices.find(v => v.lang === 'en-GB');
  if (enGB) { cachedVoice = enGB; return enGB; }

  // Fall back to any English voice
  const en = voices.find(v => v.lang.startsWith('en'));
  if (en) { cachedVoice = en; return en; }

  return null;
}

function speak(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    speechSynthesis.cancel(); // stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = 'en-GB';

    const voice = getUKVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      resolve(); // don't block on TTS failure
    };

    speechSynthesis.speak(utterance);
  });
}

export async function speakWord(word: string): Promise<void> {
  await speak(word, 0.8);
}

export async function speakDefinition(definition: string): Promise<void> {
  await speak(`It means: ${definition}`, 0.85);
}

export async function speakSentence(sentence: string): Promise<void> {
  await speak(sentence, 0.85);
}

export async function speakWordFull(word: string, definition: string, sentence: string): Promise<void> {
  await speakWord(word);
  await new Promise(r => setTimeout(r, 500));
  await speakDefinition(definition);
  await new Promise(r => setTimeout(r, 500));
  await speakSentence(sentence);
}

/**
 * Pre-warm the voices list. Call once on app load.
 * Some browsers (Chrome) load voices asynchronously.
 */
export function preloadVoices(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoice = null; // re-select on voice list change
    });
  }
}
