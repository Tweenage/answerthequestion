import { describe, it, expect } from 'vitest';
import { getLearningCard, LEARNING_CARDS } from './learningCards';

describe('getLearningCard', () => {
  it('returns null for undefined input', () => {
    expect(getLearningCard(undefined)).toBeNull();
  });

  it('returns null for unknown category', () => {
    expect(getLearningCard('not-a-real-category')).toBeNull();
    expect(getLearningCard('')).toBeNull();
  });

  it('returns a card for logic-grid', () => {
    const card = getLearningCard('logic-grid');
    expect(card).not.toBeNull();
    expect(card?.title).toContain('Grid logic');
    expect(card?.tip.toLowerCase()).toContain('grid');
    expect(card?.example).toBeDefined();
  });

  it('returns a card for comprehension-inference', () => {
    const card = getLearningCard('comprehension-inference');
    expect(card).not.toBeNull();
    expect(card?.title).toContain('Inference');
  });

  it('returns a card for percentages', () => {
    const card = getLearningCard('percentages');
    expect(card).not.toBeNull();
    expect(card?.tip).toContain('100');
  });

  it('returns a card for logic-deduction', () => {
    const card = getLearningCard('logic-deduction');
    expect(card).not.toBeNull();
    expect(card?.tip.toLowerCase()).toContain('eliminat');
  });

  it('returns a card for vocabulary-antonyms', () => {
    const card = getLearningCard('vocabulary-antonyms');
    expect(card).not.toBeNull();
    expect(card?.tip.toLowerCase()).toContain('opposite');
  });

  it('returns a card for figurative-language', () => {
    const card = getLearningCard('figurative-language');
    expect(card).not.toBeNull();
  });

  it('logic-grid card example mentions Charles or Veronica', () => {
    const card = getLearningCard('logic-grid');
    expect(card?.example).toMatch(/Charles|Veronica/);
  });

  it('every card in LEARNING_CARDS has a non-empty title and tip', () => {
    for (const [key, card] of Object.entries(LEARNING_CARDS)) {
      expect(card.title.length, `${key} title is empty`).toBeGreaterThan(0);
      expect(card.tip.length, `${key} tip is empty`).toBeGreaterThan(0);
    }
  });

  it('covers all major subject areas', () => {
    // English
    expect(getLearningCard('comprehension-inference')).not.toBeNull();
    expect(getLearningCard('figurative-language')).not.toBeNull();
    expect(getLearningCard('summarising')).not.toBeNull();
    // Maths
    expect(getLearningCard('fractions')).not.toBeNull();
    expect(getLearningCard('percentages')).not.toBeNull();
    expect(getLearningCard('bodmas')).not.toBeNull();
    // Reasoning
    expect(getLearningCard('logic-grid')).not.toBeNull();
    expect(getLearningCard('logic-code')).not.toBeNull();
    expect(getLearningCard('logic-venn')).not.toBeNull();
  });
});
