import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cities } from '@/data/cities';
import type { Metadata } from 'next';

interface Props {
    params: { city: string };
}

export async function generateStaticParams() {
    return cities.map((c) => ({ city: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const city = cities.find((c) => c.id === params.city);
    if (!city) return {};

    return {
        title: `Междугороднее такси из ${city.namePrepositional} — круглосуточно по России | Такси Межгород Ру`,
        description: `Такси Межгород Ру — поездки из ${city.namePrepositional} в любой город России. Удобно, быстро и по фиксированной цене. Звоните: +7 (993) 528-78-78.`,
        alternates: {
            canonical: `https://taximezhgorod777.ru/${city.id}`,
        },
    };
}

export default function CityPage({ params }: Props) {
    const city = cities.find((c) => c.id === params.city);
    if (!city) notFound();

    return (
        <>
            <Header />
            <main>
                <div className="container" style={{ paddingTop: '110px', paddingBottom: '60px' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                        Такси из {city.namePrepositional} — междугородние перевозки
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '680px' }}>
                        Комфортные поездки из {city.namePrepositional} по всей России. Фиксированная цена, опытные водители, работаем круглосуточно.
                    </p>

                    {/* CTA */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '56px' }}>
                        <a
                            href={`tel:${city.phone.replace(/\s/g, '')}`}
                            style={{
                                display: 'inline-block', padding: '14px 32px',
                                backgroundColor: '#111', color: '#fff',
                                borderRadius: '50px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem',
                            }}
                        >
                            Позвонить {city.phone}
                        </a>
                        <Link
                            href="/#booking"
                            style={{
                                display: 'inline-block', padding: '14px 28px',
                                backgroundColor: 'white', border: '1px solid var(--glass-border)',
                                borderRadius: '50px', color: '#111111', fontWeight: 600, textDecoration: 'none',
                            }}
                        >
                            Рассчитать стоимость
                        </Link>
                    </div>

                    {/* Popular routes */}
                    {city.popularRoutes.length > 0 && (
                        <section style={{ marginBottom: '56px' }}>
                            <h2 style={{ marginBottom: '24px' }}>Популярные маршруты из {city.namePrepositional}</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                                {city.popularRoutes.map((route) => (
                                    <div
                                        key={route.toId || route.to}
                                        style={{
                                            background: 'var(--card-bg, #ffffff)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '16px',
                                            padding: '20px 24px',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                                                {city.name} → {route.to}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '18px', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                                            <span>🕐 {route.duration}</span>
                                            <span>📍 {route.distance} км</span>
                                        </div>
                                        <div style={{ marginTop: '12px', fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>
                                            от {route.price.toLocaleString('ru-RU')} ₽
                                        </div>
                                        {route.toId && (
                                            <Link
                                                href={`/routes/${city.id}/${route.toId}`}
                                                style={{ display: 'block', marginTop: '10px', fontSize: '0.88rem', color: '#555', textDecoration: 'underline' }}
                                            >
                                                Подробнее о маршруте →
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Why us */}
                    <section style={{ background: 'var(--card-bg, #f8f9fa)', borderRadius: '20px', padding: '36px', marginBottom: '50px', border: '1px solid var(--glass-border)' }}>
                        <h2 style={{ marginTop: 0 }}>Почему выбирают нас</h2>
                        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', padding: 0, listStyle: 'none', margin: 0 }}>
                            {[
                                '✅ Фиксированная цена без скрытых доплат',
                                '✅ Опытные водители с GPS',
                                '✅ Работаем 24/7, включая праздники',
                                '✅ Бесплатное ожидание при задержке рейса',
                                '✅ Детские кресла по запросу',
                                '✅ Оплата наличными или переводом',
                            ].map((item) => (
                                <li key={item} style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px', border: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Schema.org */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "TaxiService",
                                "name": `Такси Межгород Ру — из ${city.namePrepositional}`,
                                "telephone": city.phone,
                                "areaServed": city.name,
                                "url": `https://taximezhgorod777.ru/${city.id}`,
                                "openingHours": "Mo-Su 00:00-24:00",
                            })
                        }}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}
