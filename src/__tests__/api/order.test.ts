/**
 * order.test.ts — Tests for src/app/api/order/route.ts
 * grand-transfer-light version (no rate-limiting in this version)
 * Skill: javascript-testing-patterns — vi.mock, AAA pattern, edge cases
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted() — выполняется ДО всех импортов, поэтому переменная доступна в vi.mock factory
const mockOrderCreate = vi.hoisted(() => vi.fn());

// Mock @prisma/client so every `new PrismaClient()` returns our shared mock
vi.mock('@prisma/client', () => ({
    PrismaClient: vi.fn().mockImplementation(() => ({
        order: { create: mockOrderCreate },
    })),
}));

vi.mock('@/lib/telegram', () => ({
    sendOrderNotification: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
    sendEmailNotification: vi.fn(),
}));

import { POST } from '@/app/api/order/route';
import { sendOrderNotification } from '@/lib/telegram';
import { sendEmailNotification } from '@/lib/email';

function createMockRequest(body: object, headers: Record<string, string> = {}): Request {
    return new Request('http://localhost/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            host: 'xn--c1acbe2apap.com',
            ...headers,
        },
        body: JSON.stringify(body),
    });
}


const validOrderBody = {
    fromCity: 'Ижевск',
    toCity: 'Казань',
    tariff: 'standart',
    passengers: 2,
    priceEstimate: '3500',
    customerName: 'Иванов Иван',
    customerPhone: '+79991234567',
    comments: 'Тестовый заказ',
};

describe('/api/order POST (grand-transfer-light)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockOrderCreate.mockResolvedValue({ id: 99 });
        (sendOrderNotification as ReturnType<typeof vi.fn>).mockResolvedValue(true);
        (sendEmailNotification as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    });

    it('should create an order and return 200 with success', async () => {
        const req = createMockRequest(validOrderBody);
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
    });

    it('should send Telegram notification on order', async () => {
        const req = createMockRequest(validOrderBody);
        await POST(req);
        expect(sendOrderNotification).toHaveBeenCalledTimes(1);
    });

    it('should send Email notification on order', async () => {
        const req = createMockRequest(validOrderBody);
        await POST(req);
        expect(sendEmailNotification).toHaveBeenCalledTimes(1);
    });

    it('should succeed with orderId=N/A when DB fails (graceful degradation)', async () => {
        mockOrderCreate.mockRejectedValue(new Error('DB down'));

        const req = createMockRequest(validOrderBody);
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.orderId).toBe('N/A');
    });

    it('should set telegramFallback=true when TG notification fails', async () => {
        (sendOrderNotification as ReturnType<typeof vi.fn>).mockResolvedValue(false);

        const req = createMockRequest(validOrderBody);
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.telegramFallback).toBe(true);
    });

    it('should set telegramFallback=false when TG notification succeeds', async () => {
        const req = createMockRequest(validOrderBody);
        const res = await POST(req);
        const json = await res.json();
        expect(json.telegramFallback).toBe(false);
    });

    it('should return 500 on invalid JSON body', async () => {
        const req = new Request('http://localhost/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', host: 'xn--c1acbe2apap.com' },
            body: 'not valid json!!!',
        });
        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.success).toBe(false);
    });

    it('normalizes 8-prefix phone to +7 in DB call', async () => {
        const req = createMockRequest({
            ...validOrderBody,
            customerPhone: '89991234567',
        });
        await POST(req);
        expect(mockOrderCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                customerPhone: '+79991234567',
            }),
        });
    });

    it('detects taximezhgorod source from host header', async () => {
        const req = createMockRequest(validOrderBody, {
            host: 'taximezhgorod777.ru',
        });
        await POST(req);
        // sendOrderNotification is called with body that has sourceSite set
        const callArg = (sendOrderNotification as ReturnType<typeof vi.fn>).mock.calls[0][0];
        expect(callArg.sourceSite).toBe('taximezhgorod777.ru');
    });

    it('detects межгород source from default host', async () => {
        const req = createMockRequest(validOrderBody, {
            host: 'xn--c1acbe2apap.com',
        });
        await POST(req);
        const callArg = (sendOrderNotification as ReturnType<typeof vi.fn>).mock.calls[0][0];
        expect(callArg.sourceSite).toBe('межгород.com');
    });
});
