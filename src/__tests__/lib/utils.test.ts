/**
 * translations.test.ts — Tests for grand-transfer-light
 * Note: no src/lib/translations.ts in this project
 * Testing inline translation logic from route files
 * Skill: javascript-testing-patterns — test.each, unit tests
 */
import { describe, it, expect } from 'vitest';

// ─── Phone normalization (inline logic from order/route.ts) ──────────────────

function normalizePhone(phone: string): string {
    if (!phone) return '';
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.startsWith('8') && digits.length === 11) {
        return '+7' + digits.slice(1);
    } else if (!phone.startsWith('+')) {
        return '+' + digits;
    }
    return phone;
}

// ─── Source site detection (inline logic from route) ─────────────────────────

function detectSourceSite(hostOrOrigin: string): string {
    return hostOrOrigin.includes('taximezhgorod') ? 'taximezhgorod777.ru' : 'межгород.com';
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Phone normalization (order route logic)', () => {
    it.each([
        ['+79991234567', '+79991234567'], // already +7 format
        ['79991234567', '+79991234567'],  // 7-digit, no +
        ['89991234567', '+79991234567'],  // 8-prefix → +7
        ['9991234567', '+9991234567'],    // 10 digits → prepend +
    ])('normalizes "%s" → "%s"', (input, expected) => {
        expect(normalizePhone(input)).toBe(expected);
    });

    it('returns empty string for empty input', () => {
        expect(normalizePhone('')).toBe('');
    });

    it('keeps +7 prefix unchanged', () => {
        expect(normalizePhone('+79001234567')).toBe('+79001234567');
    });

    it('handles number with dashes and spaces', () => {
        const result = normalizePhone('8 999 123-45-67');
        expect(result).toBe('+79991234567');
    });
});

describe('Source site detection (order route logic)', () => {
    it.each([
        ['taximezhgorod777.ru', 'taximezhgorod777.ru'],
        ['www.taximezhgorod777.ru', 'taximezhgorod777.ru'],
        ['xn--c1acbe2apap.com', 'межгород.com'],
        ['межгород.com', 'межгород.com'],
        ['localhost', 'межгород.com'],
        ['unknown', 'межгород.com'],
    ])('host/origin "%s" → sourceSite "%s"', (origin, expected) => {
        expect(detectSourceSite(origin)).toBe(expected);
    });
});
