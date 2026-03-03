/**
 * checkpoints.test.ts — Tests for src/data/checkpoints.ts
 * grand-transfer-light version
 * Skill: javascript-testing-patterns — test.each, false-positive detection
 */
import { describe, it, expect } from 'vitest';
import { checkpoints, requiresCheckpoint, NEW_TERRITORY_CITIES } from '@/data/checkpoints';

describe('checkpoints data integrity', () => {
    it('has at least 5 checkpoints', () => {
        expect(checkpoints.length).toBeGreaterThanOrEqual(5);
    });

    it('every checkpoint has id, name, and coords [lat, lon]', () => {
        for (const cp of checkpoints) {
            expect(cp.id).toBeTruthy();
            expect(cp.name).toBeTruthy();
            expect(cp.coords).toHaveLength(2);
            expect(cp.coords[0]).toBeGreaterThan(0);
            expect(cp.coords[1]).toBeGreaterThan(0);
        }
    });

    it('all checkpoint ids are unique', () => {
        const ids = checkpoints.map(cp => cp.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('contains КПП Успенка', () => {
        expect(checkpoints.some(cp => cp.name.includes('Успенка'))).toBe(true);
    });
});

describe('NEW_TERRITORY_CITIES', () => {
    it('is a non-empty lowercase array', () => {
        expect(Array.isArray(NEW_TERRITORY_CITIES)).toBe(true);
        expect(NEW_TERRITORY_CITIES.length).toBeGreaterThan(0);
        for (const city of NEW_TERRITORY_CITIES) {
            expect(city).toBe(city.toLowerCase());
        }
    });

    it('contains key cities', () => {
        expect(NEW_TERRITORY_CITIES).toContain('мариуполь');
        expect(NEW_TERRITORY_CITIES).toContain('симферополь');
        expect(NEW_TERRITORY_CITIES).toContain('херсон');
    });
});

describe('requiresCheckpoint', () => {
    it.each([
        ['Мариуполь'],
        ['мариуполь'],
        ['ДОНЕЦК'],
        ['Симферополь'],
        ['Херсон'],
        ['Луганск'],
        ['Ялта'],
        ['Горловка'],
    ])('returns true for new territory city "%s"', (city) => {
        expect(requiresCheckpoint(city)).toBe(true);
    });

    it.each([
        ['Москва'],
        ['Санкт-Петербург'],
        ['Ижевск'],
        ['Казань'],
        ['Пермь'],
        ['Самара'],
        ['Ростов на Дону'],
    ])('returns false for Russian city "%s"', (city) => {
        expect(requiresCheckpoint(city)).toBe(false);
    });

    it('does NOT flag "Свердловская область"', () => {
        expect(requiresCheckpoint('Свердловская область')).toBe(false);
    });

    it('does NOT flag "Северное Бутово" (Moscow district)', () => {
        expect(requiresCheckpoint('Северное Бутово')).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(requiresCheckpoint('')).toBe(false);
    });

    it('handles mixed case correctly', () => {
        expect(requiresCheckpoint('МАРИУПОЛЬ')).toBe(true);
        expect(requiresCheckpoint('мАрИуПоль')).toBe(true);
    });

    it('detects city in a longer address string', () => {
        expect(requiresCheckpoint('ул. Ленина 1, Донецк')).toBe(true);
    });
});
