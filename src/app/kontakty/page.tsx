import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Контакты Такси «Межгород Ру» — телефоны, адрес и связь',
    description: 'Такси «Межгород Ру» контакты: Адрес — г. Ижевск, Воткинское шоссе. Телефон +7 (993) 528-78-78. Работаем круглосуточно 24/7 по всей России.',
    alternates: {
        canonical: 'https://taximezhgorod777.ru/kontakty',
    },
};

export default function KontaktyPage() {
    return (
        <>
            <Header />
            <main>
                <div className="container" style={{ paddingTop: '110px', paddingBottom: '60px' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: '12px', color: 'var(--color-foreground)' }}>
                        Контакты
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '50px' }}>
                        Принимаем заявки круглосуточно. Позвоните, напишите или оставьте заявку на сайте.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '50px' }}>
                        {/* Phone */}
                        <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📞</div>
                            <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Телефон</h2>
                            <a
                                href="tel:+79935287878"
                                style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111', textDecoration: 'none', display: 'block', marginBottom: '6px' }}
                            >
                                +7 (993) 528-78-78
                            </a>
                            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Круглосуточно, 24/7</p>
                        </div>

                        {/* WhatsApp / Telegram */}
                        <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                            <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Мессенджеры</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <a
                                    href="https://wa.me/79935287878"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#25D366', fontWeight: 600, textDecoration: 'none' }}
                                >
                                    WhatsApp →
                                </a>
                                <a
                                    href="https://t.me/+79935287878"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#229ED9', fontWeight: 600, textDecoration: 'none' }}
                                >
                                    Telegram →
                                </a>
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✉️</div>
                            <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Email</h2>
                            <a
                                href="mailto:romanbatkovic1@yandex.ru"
                                style={{ color: '#111', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}
                            >
                                romanbatkovic1@yandex.ru
                            </a>
                        </div>

                        {/* Address */}
                        <div style={{ background: 'var(--card-bg, #ffffff)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📍</div>
                            <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Адрес</h2>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>
                                г. Ижевск, Воткинское шоссе<br />
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Удмуртская Республика</span>
                            </p>
                        </div>
                    </div>

                    {/* Legal info */}
                    <section style={{ background: 'var(--card-bg, #f8f9fa)', borderRadius: '20px', padding: '32px', marginBottom: '50px', border: '1px solid var(--glass-border)' }}>
                        <h2 style={{ marginTop: 0 }}>Реквизиты</h2>
                        <div style={{ display: 'grid', gap: '8px', fontSize: '0.95rem', lineHeight: 1.8 }}>
                            <p style={{ margin: 0 }}><strong>Правовой статус:</strong> НПД (Самозанятый)</p>
                            <p style={{ margin: 0 }}><strong>ФИО:</strong> Панкратов Роман Борисович</p>
                            <p style={{ margin: 0 }}><strong>ИНН:</strong> 500107263479</p>
                            <p style={{ margin: 0 }}><strong>Вид деятельности:</strong> Водитель (Оказание транспортно-информационных услуг)</p>
                            <p style={{ margin: 0 }}><strong>Регион деятельности:</strong> Удмуртская Республика, территория РФ и СНГ</p>
                        </div>
                    </section>

                    <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            href="/#booking"
                            style={{
                                display: 'inline-block', padding: '14px 32px',
                                backgroundColor: '#111', color: '#fff',
                                borderRadius: '50px', fontWeight: 600, textDecoration: 'none',
                            }}
                        >
                            Заказать такси
                        </Link>
                        <Link
                            href="/"
                            style={{
                                display: 'inline-block', padding: '14px 28px',
                                backgroundColor: 'white', border: '1px solid var(--glass-border)',
                                borderRadius: '50px', color: '#111111', fontWeight: 600, textDecoration: 'none',
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
