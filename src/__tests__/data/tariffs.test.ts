/**
 * tariffs.test.ts — Tests for src/data/tariffs.ts
 * grand-transfer-light version
 * Skill: javascript-testing-patterns — data integrity, test.each
 */
import { describe, it, expect } from 'vitest';
import { cityTariffs, type CityTariffs } from '@/data/tariffs';

describe('cityTariffs data integrity', () => {
    const cities = Object.keys(cityTariffs);

    it('has at least 50 cities', () => {
        expect(cities.length).toBeGreaterThanOrEqual(50);
    });

    it('every city has all required tariff fields with positive numbers', () => {
        const requiredFields: (keyof CityTariffs)[] = [
            'econom', 'standart', 'comfort', 'comfortPlus',
            'business', 'minivan', 'soberDriver',
        ];
        for (const city of cities) {
            const tariff = cityTariffs[city];
            for (const field of requiredFields) {
                expect(tariff[field], `City "${city}" field "${field}"`).toBeDefined();
                expect(typeof tariff[field]).toBe('number');
                expect(tariff[field]).toBeGreaterThan(0);
            }
        }
    });

    it('tariff order: econom ≤ standart ≤ comfort ≤ business for all cities', () => {
        for (const city of cities) {
            const t = cityTariffs[city];
            expect(t.econom).toBeLessThanOrEqual(t.standart);
            expect(t.standart).toBeLessThanOrEqual(t.comfort);
            expect(t.comfort).toBeLessThanOrEqual(t.business);
        }
    });

    it('contains Ижевск with expected base tariffs', () => {
        expect(cityTariffs['Ижевск']).toBeDefined();
        expect(cityTariffs['Ижевск'].econom).toBe(28);
        expect(cityTariffs['Ижевск'].standart).toBe(30);
    });
});

describe('New territory elevated rates', () => {
    it.each(['Мариуполь', 'Мелитополь'])('city "%s" has econom ≥ 80', (city) => {
        if (!(city in cityTariffs)) return;
        expect(cityTariffs[city].econom).toBeGreaterThanOrEqual(80);
    });

    it.each(['Мариуполь', 'Мелитополь'])('city "%s" has business ≥ 100', (city) => {
        if (!(city in cityTariffs)) return;
        expect(cityTariffs[city].business).toBeGreaterThanOrEqual(100);
    });
});
