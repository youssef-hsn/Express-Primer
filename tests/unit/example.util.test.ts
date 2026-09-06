import { describe, expect, it } from 'vitest';
import { toSlug } from '@/utils/example.util.js';

describe('toSlug', () => {
  it('lowercases and hyphenates words', () => {
    expect(toSlug('Express Primer')).toBe('express-primer');
  });

  it('strips diacritics', () => {
    expect(toSlug('Crème Brûlée')).toBe('creme-brulee');
  });

  it('collapses runs of punctuation into one hyphen', () => {
    expect(toSlug('a  --  b')).toBe('a-b');
  });

  it('trims leading and trailing hyphens', () => {
    expect(toSlug('  !hello!  ')).toBe('hello');
  });

  it('returns an empty string when nothing survives', () => {
    expect(toSlug('!!!')).toBe('');
  });
});
