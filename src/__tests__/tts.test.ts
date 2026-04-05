import { describe, it, expect } from 'vitest';

// TTS depends on browser APIs not available in jsdom.
// We test the module can be imported without errors.
describe('tts module', () => {
  it('exports speakWord function', async () => {
    const tts = await import('../utils/tts');
    expect(typeof tts.speakWord).toBe('function');
  });

  it('exports preloadVoices function', async () => {
    const tts = await import('../utils/tts');
    expect(typeof tts.preloadVoices).toBe('function');
  });

  it('exports speakWordFull function', async () => {
    const tts = await import('../utils/tts');
    expect(typeof tts.speakWordFull).toBe('function');
  });
});
