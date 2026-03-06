import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Публичная оферта — Такси Межгород Ру (taximezhgorod777.ru)',
    description: 'Публичная оферта на оказание услуг по пассажирским перевозкам от Такси Межгород Ру. Самозанятый Панкратов Роман Борисович, ИНН 500107263479.',
    alternates: {
        canonical: 'https://taximezhgorod777.ru/oferta',
    },
};

const sectionStyle: React.CSSProperties = { marginBottom: '2.5rem' };
const h2Style: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-foreground)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' };
const pStyle: React.CSSProperties = { lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '0.8rem' };
const liStyle: React.CSSProperties = { marginBottom: '0.6rem', lineHeight: '1.8', color: 'var(--color-text-muted)' };

export default function OfertaPage() {
    return (
        <>
            <Header />
            <main>
                <div className="container" style={{ paddingTop: '110px', paddingBottom: '60px', maxWidth: '820px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: '8px', color: 'var(--color-foreground)' }}>
                        Публичная оферта на оказание услуг по пассажирским перевозкам
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
                        Редакция от 01.03.2026 · Вступает в силу с момента акцепта
                    </p>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>1. Общие положения и определения</h2>
                        <p style={pStyle}>Настоящий документ является публичной офертой (далее — <strong>Оферта</strong>) в соответствии со ст. 435 и п. 2 ст. 437 Гражданского кодекса Российской Федерации и содержит все существенные условия договора на оказание транспортно-информационных услуг по пассажирским перевозкам.</p>
                        <p style={pStyle}><strong>Исполнитель</strong> — Панкратов Роман Борисович, плательщик налога на профессиональный доход (НПД/Самозанятый), ИНН 500107263479, сайт: <strong>taximezhgorod777.ru</strong>.</p>
                        <p style={pStyle}><strong>Заказчик</strong> — любое дееспособное физическое лицо, оставившее заявку через сайт и принявшее условия настоящей Оферты.</p>
                        <p style={pStyle}><strong>Услуга</strong> — организация и выполнение пассажирских перевозок на легковом автомобиле/минивэне по маршруту, указанному Заказчиком.</p>
                        <p style={pStyle}><strong>Акцепт</strong> — полное и безоговорочное принятие условий настоящей Оферты путём проставления отметки «Я принимаю условия Публичной оферты» и отправки заявки.</p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>2. Предмет договора</h2>
                        <p style={pStyle}>Исполнитель обязуется по заявке Заказчика организовать и выполнить перевозку пассажира(ов) и их багажа по маршруту, указанному при оформлении заявки, а Заказчик — оплатить услугу согласно условиям настоящей Оферты.</p>
                        <p style={pStyle}>Договор считается заключённым с момента акцепта Оферты — отправки заявки с проставленной отметкой о принятии настоящих условий.</p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>3. Порядок оформления заказа</h2>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}>Заказчик заполняет форму заявки: маршрут, тариф, дату/время, ФИО, телефон.</li>
                            <li style={liStyle}>Заказчик проставляет отметку о принятии настоящей Оферты и обработке персональных данных, после чего отправляет заявку.</li>
                            <li style={liStyle}>Исполнитель связывается с Заказчиком для подтверждения заказа не позднее чем за 1 час до подачи автомобиля.</li>
                            <li style={liStyle}>Договор считается исполненным после доставки пассажира(ов) в конечную точку маршрута.</li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>4. Стоимость услуги и порядок расчётов</h2>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}>Стоимость является фиксированной, определяется тарифом и маршрутом в момент оформления заявки.</li>
                            <li style={liStyle}>Оплата производится наличными водителю по завершении поездки или безналичным переводом по согласованию.</li>
                            <li style={liStyle}>Стоимость проезда по платным дорогам оплачивается Заказчиком отдельно.</li>
                            <li style={liStyle}>Исполнитель — плательщик НПД. НДС не облагается.</li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>5. Права и обязанности Исполнителя</h2>
                        <p style={pStyle}><strong>Исполнитель обязуется:</strong></p>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}>Подать исправный автомобиль заявленного класса в согласованное время и место.</li>
                            <li style={liStyle}>Обеспечить безопасность перевозки в соответствии с ПДД РФ.</li>
                            <li style={liStyle}>При поломке ТС незамедлительно предоставить подменный автомобиль без изменения стоимости.</li>
                        </ul>
                        <p style={pStyle}><strong>Исполнитель вправе:</strong></p>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}>Отказать в перевозке нетрезвому пассажиру, либо при наличии запрещённых предметов.</li>
                            <li style={liStyle}>Требовать компенсации за умышленное загрязнение или повреждение ТС.</li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>6. Права и обязанности Заказчика</h2>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}>Предоставить достоверные контактные данные и точный маршрут.</li>
                            <li style={liStyle}>Находиться в месте подачи автомобиля в указанное время (бесплатное ожидание — 15 минут).</li>
                            <li style={liStyle}>Оплатить услугу в полном объёме.</li>
                            <li style={liStyle}>Пристегнуть ремень безопасности и обеспечить соблюдение этого требования всеми пассажирами.</li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>7. Порядок отмены заказа и возврата</h2>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}><strong>Бесплатная отмена</strong> — не позднее чем за 12 часов до времени подачи.</li>
                            <li style={liStyle}>Отмена менее чем за 12 часов — компенсация 20% от стоимости.</li>
                            <li style={liStyle}>Отмена менее чем за 2 часа или неявка — компенсация 50% от стоимости.</li>
                            <li style={liStyle}>Отмена производится по телефону или в мессенджере с подтверждением от Исполнителя.</li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>8. Ответственность сторон</h2>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}>Исполнитель несёт ответственность за вред жизни и здоровью по его вине в соответствии с законодательством РФ.</li>
                            <li style={liStyle}>Совокупная имущественная ответственность Исполнителя не может превышать стоимости конкретной поездки.</li>
                            <li style={liStyle}>Исполнитель не несёт ответственности за задержку рейсов и иных видов транспорта.</li>
                        </ul>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>9. Форс-мажор</h2>
                        <p style={pStyle}>К обстоятельствам непреодолимой силы относятся: ДТП не по вине водителя, стихийные бедствия, дорожные аварии, действия государственных органов, задержки на КПП. При наступлении форс-мажора Исполнитель обязан уведомить Заказчика и согласовать дальнейшие действия.</p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>10. Порядок разрешения споров</h2>
                        <p style={pStyle}>Все споры разрешаются путём переговоров. При невозможности — в судебном порядке по месту жительства Заказчика в соответствии с законодательством РФ. Претензии принимаются на: <a href="mailto:romanbatkovic1@yandex.ru" style={{ color: 'inherit' }}>romanbatkovic1@yandex.ru</a> или <a href="tel:+79935287878" style={{ color: 'inherit' }}>+7 (993) 528-78-78</a>. Срок рассмотрения — 10 рабочих дней.</p>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={h2Style}>11. Прочие условия</h2>
                        <ul style={{ paddingLeft: '20px' }}>
                            <li style={liStyle}>Исполнитель вправе изменить условия Оферты. Новая редакция вступает в силу с момента публикации и не затрагивает ранее оформленные заказы.</li>
                            <li style={liStyle}>Оферта регулируется законодательством Российской Федерации.</li>
                        </ul>
                    </section>

                    <section style={{ ...sectionStyle, background: 'var(--card-bg, #f8f9fa)', borderRadius: '16px', padding: '24px', border: '1px solid var(--glass-border)' }}>
                        <h2 style={{ ...h2Style, borderBottom: 'none', paddingBottom: 0 }}>12. Реквизиты Исполнителя</h2>
                        <div style={{ display: 'grid', gap: '6px', fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--color-text-muted)', marginTop: '12px' }}>
                            <p style={{ margin: 0 }}><strong>ФИО:</strong> Панкратов Роман Борисович</p>
                            <p style={{ margin: 0 }}><strong>Статус:</strong> Самозанятый (плательщик НПД)</p>
                            <p style={{ margin: 0 }}><strong>ИНН:</strong> 500107263479</p>
                            <p style={{ margin: 0 }}><strong>Сайт:</strong> taximezhgorod777.ru</p>
                            <p style={{ margin: 0 }}><strong>Телефон:</strong> <a href="tel:+79935287878">+7 (993) 528-78-78</a></p>
                            <p style={{ margin: 0 }}><strong>Email:</strong> <a href="mailto:romanbatkovic1@yandex.ru">romanbatkovic1@yandex.ru</a></p>
                            <p style={{ margin: 0 }}><strong>Регион:</strong> Удмуртская Республика, территория РФ и СНГ</p>
                            <p style={{ margin: 0 }}><strong>Дата публикации:</strong> 01.03.2026</p>
                        </div>
                    </section>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Link href="/#booking" style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#111', color: '#fff', borderRadius: '50px', fontWeight: 600, textDecoration: 'none' }}>
                            Заказать такси
                        </Link>
                        <Link href="/" style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid var(--glass-border)', borderRadius: '50px', fontWeight: 600, textDecoration: 'none' }}>
                            На главную
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
