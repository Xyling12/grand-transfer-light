import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'О компании | Такси Межгород',
    description: 'Информация о сервисе междугородних поездок Такси Межгород. Наши гарантии, автопарк, контакты и юридическая информация.',
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
                    <h1 className={styles.title}>О сервисе Такси Межгород</h1>

                    <section className={styles.contentBlock}>
                        <h2>Современный сервис междугородних перевозок</h2>
                        <p>
                            Добро пожаловать в «Такси Межгород» — надежный Трансфер до аэропортов, вокзалов и любых населенных пунктов без пересадок. Мы предлагаем комфортные условия по доступным ценам, без непредсказуемых алгоритмов и динамического ценообразования.
                        </p>
                        <p>
                            Главная цель нашей компании — обеспечить вас спокойствием в дороге. Стоимость фиксируется в момент заказа, что исключает любые доплаты из-за непогоды, пробок или ночного времени суток. Вы получаете прозрачный и честный сервис.
                        </p>
                    </section>

                    <section className={styles.contentBlock}>
                        <h2>Почему нам доверяют тысячи пассажиров</h2>
                        <ul className={styles.list}>
                            <li><strong>Строгий отбор водителей:</strong> За рулем сидят только профессионалы с безаварийным профилем и многолетним опытом міжгородних поездок.</li>
                            <li><strong>Гарантия исправности машинного парка:</strong> Транспорт регулярно проходит ТО. В рейс выходят только полностью готовые и чистые автомобили.</li>
                            <li><strong>Отсутствие скрытых платежей:</strong> Цена, которую назвал диспетчер, будет окончательной. Багаж и базовое ожидание уже включены в тариф.</li>
                        </ul>
                    </section>

                    <section className={styles.contentBlock}>
                        <h2>Наш автопарк и руководство</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '30px', marginBottom: '40px', padding: '0 10px' }}>
                            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <div style={{ position: 'relative', width: '100%', height: '350px', maxHeight: '45vh' }}>
                                    <Image src="/images/director_new.jpg" alt="Панкратов Роман Борисович - руководитель" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                                </div>
                                <div style={{ padding: '20px', background: '#F9FAFB' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-foreground)' }}>Панкратов Р. Б.</h3>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>Основатель компании</p>
                                </div>
                            </div>
                            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <div style={{ position: 'relative', width: '100%', height: '350px', maxHeight: '45vh' }}>
                                    <Image src="/images/car_new.png" alt="Автомобиль такси после мойки KIA" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                                </div>
                                <div style={{ padding: '20px', background: '#F9FAFB' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-foreground)' }}>Чистота и комфорт</h3>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>Подготовка каждого автомобиля перед выездом</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={styles.contentBlock}>
                        <h2>Юридическая информация и контакты</h2>
                        <div className={styles.contactCard}>
                            <p><strong>Правовой статус:</strong> НПД (Самозанятый)</p>
                            <p><strong>Вид деятельности:</strong> Водитель (Оказание транспортно-информационных услуг)</p>
                            <p><strong>ФИО:</strong> ПАНКРАТОВ РОМАН БОРИСОВИЧ</p>
                            <p><strong>ИНН:</strong> 500107263479</p>
                            <p><strong>СНИЛС:</strong> 113-486-079 48</p>
                            <p><strong>Регион деятельности:</strong> Удмуртская Республика, территория РФ и СНГ</p>
                            <hr style={{ margin: '15px 0', borderColor: 'var(--glass-border)' }} />
                            <p><strong>Телефон:</strong> <a href="tel:+79935287878">+7 (993) 528-78-78</a></p>
                            <p><strong>Email:</strong> <a href="mailto:romanbatkovic1@gmail.com">romanbatkovic1@gmail.com</a></p>
                            <p><strong>Режим работы:</strong> Круглосуточно, 24/7</p>
                        </div>
                    </section>

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <Link href="/" style={{
                            display: 'inline-block',
                            padding: '14px 28px',
                            backgroundColor: 'white',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '50px',
                            color: '#111111',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                        }}>
                            Вернуться на главную
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
