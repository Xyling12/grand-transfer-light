"use client";

import { useRef } from 'react';
import styles from './Reviews.module.css';
import { Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
    {
        name: "Алексей С.",
        date: "12 февраля 2026",
        rating: 5,
        text: "Заказывал эконом для поездки с семьей в аэропорт Казани. Машина приехала вовремя, чистая Гранта. Доехали быстро и без проблем, цена очень порадовала. Рекомендую!",
        initial: "А"
    },
    {
        name: "Сергей Г.",
        date: "20 января 2026",
        rating: 5,
        text: "Ехали из Ижевска в Сарапул. Заказывали Стандарт. Машина теплая, водитель ехал очень аккуратно. Никаких доплат за багаж не взяли, цена фиксированная как и обещали.",
        initial: "С"
    },
    {
        name: "Елена П.",
        date: "5 февраля 2026",
        rating: 4,
        text: "Заказывала Комфорт из аэропорта до дома. Водитель встретил, помог с чемоданом. Единственный минус - на выезде была небольшая пробка, но в салоне было тепло и комфортно. Довольна.",
        initial: "Е"
    },
    {
        name: "Марина В.",
        date: "28 января 2026",
        rating: 5,
        text: "Отличный междугородний сервис. Всегда всё быстро: диспетчер перезвонил через минуту, назначили машину, цены адекватные. Намного дешевле, чем у агрегаторов на дальние расстояния.",
        initial: "М"
    },
    {
        name: "Владимир М.",
        date: "10 февраля 2026",
        rating: 5,
        text: "Нужно было срочно уехать ночью в соседний город. Машина была подана ровно в срок, водитель не гнал, ехал уверенно. Буду пользоваться снова.",
        initial: "В"
    },
    {
        name: "Игорь Т.",
        date: "15 января 2026",
        rating: 4,
        text: "Хорошее такси на межгород. Доехали безопасно, цена устроила. Снял одну звезду просто за то, что водитель немного заблудился в наших дворах при подаче, пришлось выходить на дорогу.",
        initial: "И"
    },
    {
        name: "Дмитрий К.",
        date: "22 февраля 2026",
        rating: 5,
        text: "Пользовался услугой доставки - нужно было срочно отправить запчасть в Глазов. Ребята организовали всё день в день. Очень выручили! Цена отличная за такую скорость.",
        initial: "Д"
    },
    {
        name: "Юля С.",
        date: "2 февраля 2026",
        rating: 5,
        text: "Бронировали минивэн на большую компанию. Диспетчер вежливый, машина приехала большая и вместительная. Доехали с комфортом всей семьей и кучей вещей.",
        initial: "Ю"
    },
    {
        name: "Олег Р.",
        date: "18 февраля 2026",
        rating: 5,
        text: "Заказывал услугу 'трезвый водитель' после праздника загородом. Водитель приехал быстро, довез мою машину очень аккуратно до самого дома. Большое спасибо!",
        initial: "О"
    }
];

// Placeholder link - user can change this later
const REVIEWS_LINK = "https://yandex.ru/maps";

export default function Reviews() {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const firstCard = carouselRef.current.firstElementChild as HTMLElement;
            const cardWidth = firstCard?.offsetWidth || 320;
            const scrollAmount = cardWidth + 30; // Card width + CSS gap

            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className={`${styles.section} animate-on-scroll`} id="reviews">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h2 className="section-title">Отзывы клиентов</h2>
                        <p className="section-subtitle">Нам доверяют свои поездки более 5000 клиентов</p>
                    </div>

                    <div className={styles.navButtons}>
                        <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Предыдущие отзывы">
                            <ChevronLeft size={24} />
                        </button>
                        <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Следующие отзывы">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className={styles.carouselContainer}>
                    <div className={styles.grid} ref={carouselRef}>
                        {REVIEWS.map((review, index) => (
                            <div key={index} className={styles.card}>
                                <div className={styles.quoteIcon}>“</div>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>{review.initial}</div>
                                    <div className={styles.meta}>
                                        <span className={styles.name}>{review.name}</span>
                                        <span className={styles.date}>{review.date}</span>
                                    </div>
                                </div>
                                <div className={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < review.rating ? "currentColor" : "none"}
                                            strokeWidth={i < review.rating ? 0 : 2}
                                        />
                                    ))}
                                </div>
                                <p className={styles.text}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.actions}>
                    <a href={REVIEWS_LINK} target="_blank" rel="noopener noreferrer" className={styles.button}>
                        Читать все отзывы <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
}
