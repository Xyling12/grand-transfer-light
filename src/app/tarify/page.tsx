import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Тарифы такси — Эконом, Стандарт, Комфорт, Бизнес | Такси Межгород Ру',
    description: 'Тарифы такси для любых поездок: эконом, стандарт, комфорт, бизнес. Фиксированные цены без скрытых доплат. Такси Межгород Ру — межгородские перевозки по всей России.',
    alternates: {
        canonical: 'https://taximezhgorod777.ru/tarify',
    },
};

const tariffs = [
    {
        name: 'Эконом',
        icon: '🚗',
        description: 'Доступные перевозки для небольших групп или одиночных пассажиров с обычным багажом.',
        features: ['До 3 пассажиров', 'Багаж до 40 кг', 'Отечественные авто и иномарки эконом-класса', 'Кондиционер'],
        rate: 'от 20 ₽/км',
        color: '#4CAF50',
    },
    {
        name: 'Стандарт',
        icon: '🚙',
        description: 'Оптимальное соотношение цены и качества. Комфортный современный автомобиль для поездки любой дальности.',
        features: ['До 4 пассажиров', 'Багаж до 60 кг', 'Иномарки 2018+ года', 'Кондиционер, USB-зарядка'],
        rate: 'от 25 ₽/км',
        color: '#2196F3',
    },
    {
        name: 'Комфорт',
        icon: '🚘',
        description: 'Повышенный уровень комфорта для деловых и дальних поездок. Просторный салон, тишина в дороге.',
        features: ['До 4 пассажиров', 'Большой багажник', 'Иномарки бизнес-класса', 'Вода, USB, климат-контроль'],
        rate: 'от 30 ₽/км',
        color: '#FF9800',
    },
    {
        name: 'Бизнес',
        icon: '🏎',
        description: 'Представительский класс. Идеально для встреч клиентов, переговоров и поездок VIP-уровня.',
        features: ['До 3 пассажиров', 'Премиум-авто', 'Опрятный водитель', 'Встреча с табличкой, кожаный салон'],
        rate: 'от 40 ₽/км',
        color: '#9C27B0',
    },
    {
        name: 'Минивэн',
        icon: '🚐',
        description: 'Просторный минивэн для больших компаний, семей с детьми или крупного багажа.',
        features: ['До 7 пассажиров', 'Большой luggage space', 'Ford Galaxy, VW Multivan и аналоги', 'Детские кресла по запросу'],
        rate: 'от 35 ₽/км',
        color: '#00BCD4',
    },
];

export default function TarifyPage() {
    return (
        <>
            <Header />
            <main>
                <div className="container" style={{ paddingTop: '110px', paddingBottom: '60px' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                        Тарифы такси Межгород Ру
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '50px', maxWidth: '640px' }}>
                        Фиксированная цена без сюрпризов. Вы платите ровно столько, сколько озвучил оператор — ни рублём больше.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                        {tariffs.map((t) => (
                            <div
                                key={t.name}
                                style={{
                                    background: 'var(--card-bg, #ffffff)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '20px',
                                    padding: '28px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '2rem' }}>{t.icon}</span>
                                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{t.name}</h2>
                                </div>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{t.description}</p>
                                <ul style={{ margin: 0, padding: '0 0 0 18px', color: 'var(--color-foreground)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                                    {t.features.map((f) => <li key={f}>{f}</li>)}
                                </ul>
                                <div style={{
                                    marginTop: 'auto',
                                    padding: '10px 16px',
                                    background: t.color + '18',
                                    borderRadius: '10px',
                                    color: t.color,
                                    fontWeight: 700,
                                    fontSize: '1.05rem',
                                }}>
                                    {t.rate}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* What's included */}
                    <section style={{ background: 'var(--card-bg, #f8f9fa)', borderRadius: '20px', padding: '36px', marginBottom: '50px', border: '1px solid var(--glass-border)' }}>
                        <h2 style={{ marginTop: 0 }}>Что входит в любой тариф</h2>
                        <ul style={{ columns: 2, gap: '20px', lineHeight: 2, padding: '0 0 0 20px', margin: 0 }}>
                            <li>Фиксированная цена без скрытых доплат</li>
                            <li>Бесплатное ожидание при задержке рейса</li>
                            <li>Кратковременные остановки в пути</li>
                            <li>Детские кресла по запросу</li>
                            <li>Помощь с погрузкой багажа</li>
                            <li>Встреча с именной табличкой (по запросу)</li>
                            <li>Оплата наличными или переводом</li>
                            <li>Отчётные документы для командировки</li>
                        </ul>
                    </section>

                    <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            href="/#booking"
                            style={{
                                display: 'inline-block', padding: '14px 32px',
                                backgroundColor: '#111', color: '#fff',
                                borderRadius: '50px', fontWeight: 600,
                                textDecoration: 'none', fontSize: '1rem',
                            }}
                        >
                            Рассчитать стоимость
                        </Link>
                        <Link
                            href="/"
                            style={{
                                display: 'inline-block', padding: '14px 28px',
                                backgroundColor: 'white', border: '1px solid var(--glass-border)',
                                borderRadius: '50px', color: '#111111', fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            На главную
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
