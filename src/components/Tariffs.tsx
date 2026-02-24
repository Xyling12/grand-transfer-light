"use client";

import styles from './Tariffs.module.css';

import { useCity } from '@/context/CityContext';
import { cityTariffs, CityTariffs } from '@/data/tariffs';

const tariffDefs = [
    {
        id: "econom" as keyof CityTariffs,
        name: "Эконом",
        description: "Низкая цена на поездки. Подача авто до 15 минут в черте города.",
        image: "/images/tariffs/econom_ai.png",
        features: ["Гранта, Логан, Лачетти", "Отличная цена", "Детское кресло по запросу"]
    },
    {
        id: "standart" as keyof CityTariffs,
        name: "Стандарт",
        description: "Оптимальный выбор для межгорода. Кондиционер и чистый салон.",
        image: "/images/tariffs/standard_ai.png",
        features: ["Рио, Солярис, Поло", "Кондиционер", "Вместительный багажник"]
    },
    {
        id: "comfort" as keyof CityTariffs,
        name: "Комфорт",
        description: "Автомобили C-класса для комфортных поездок на дальние расстояния.",
        image: "/images/tariffs/comfort_ai.png",
        features: ["Октавия, Элантра, Церато", "Тихий салон", "Плавный ход"]
    },
    {
        id: "comfortPlus" as keyof CityTariffs,
        name: "Комфорт+",
        description: "Седаны D-класса. Максимум комфорта для длительных поездок.",
        image: "/images/tariffs/comfort_plus_ai.png",
        features: ["К5, Камри, Соната", "Много места сзади", "Мягкая подвеска"]
    },
    {
        id: "business" as keyof CityTariffs,
        name: "Бизнес",
        description: "Автомобили премиум-сегмента. Для встреч VIP-гостей и важных поездок.",
        image: "/images/tariffs/business_ai.png",
        features: ["Мерседес, БМВ, Ауди", "Кожаный салон", "Вода в салоне"]
    },
    {
        id: "minivan" as keyof CityTariffs,
        name: "Минивэн",
        description: "Для больших компаний до 8 человек и объемного багажа.",
        image: "/images/tariffs/minivan_ai.png",
        features: ["Карнивал, Старекс", "Огромный багажник", "Климат для заднего ряда"]
    },
    {
        id: "soberDriver" as keyof CityTariffs,
        name: "Трезвый водитель",
        description: "Аккуратно доставим вас и ваш автомобиль домой.",
        image: "/images/tariffs/sober_ai.png",
        features: ["Опытные водители", "Аккуратное вождение", "Безопасность"]
    },
    {
        id: "delivery" as keyof CityTariffs,
        name: "Доставка",
        description: "Срочная курьерская доставка документов и посылок.",
        image: "/images/tariffs/delivery_ai.png",
        features: ["От двери до двери", "Надежно", "Быстро"]
    }
];

// Tariffs.tsx partial update
import { Check } from 'lucide-react';

// ... imports

export default function Tariffs() {
    const { currentCity, setSelectedTariff } = useCity();

    // Safe fallback to 'Москва' if city is somehow completely missing
    const activeTariffs = cityTariffs[currentCity?.name] || cityTariffs['Москва'];

    // Adjust individual scales to visually align cars with different intrinsic bounds
    const getStyleProps = (id: string) => {
        return {
            '--base-scale': 1.1,
            '--hover-scale': 1.2,
            '--base-translate': '0px',
            '--hover-translate': '-8px'
        } as React.CSSProperties;
    };

    return (
        <section className={`${styles.section} animate-on-scroll`} id="tariffs">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": `Тарифы на межгородское такси из города ${currentCity?.name || 'Москва'}`,
                        "itemListElement": tariffDefs.map((t, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "item": {
                                "@type": "Service",
                                "name": `Тариф ${t.name}`,
                                "description": t.description,
                                "provider": {
                                    "@type": "Organization",
                                    "name": "GrandTransfer"
                                },
                                "offers": {
                                    "@type": "Offer",
                                    "price": activeTariffs[t.id] || 25,
                                    "priceCurrency": "RUB",
                                    "description": t.id === 'delivery' ? 'Фиксированная цена от' : 'Цена за километр'
                                }
                            }
                        }))
                    })
                }}
            />
            <div className="container">
                <div className={styles.titleWrapper}>
                    <h2 className="section-title">Наши Тарифы</h2>
                    <p className="section-subtitle">Выберите автомобиль, подходящий именно вам</p>
                </div>

                <div className={styles.grid}>
                    {tariffDefs.map((tariff, index) => {
                        const price = activeTariffs[tariff.id] || 25;

                        return (
                            <div key={index} className={styles.card}>
                                {/* Dark Header */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={tariff.image}
                                            alt={`Автомобиль класса ${tariff.name} для междугороднего такси и трансфера: ${tariff.features[0]}`}
                                            className={styles.image}
                                            style={getStyleProps(tariff.id)}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className={styles.nameRow}>
                                        <h3 className={styles.name}>{tariff.name}</h3>
                                        <div className={styles.cars}>{tariff.features[0]}</div>
                                    </div>
                                </div>

                                {/* Light Body */}
                                <div className={styles.cardBody}>
                                    <div className={styles.headerRow}>
                                        <h4 className={styles.nameAlt}>{tariff.name}</h4>
                                        <div className={styles.priceBadge}>
                                            {(tariff.id === 'delivery' || tariff.id === 'soberDriver') ? 'от 1500 ₽*' : `от ${price} ₽/км`}
                                        </div>
                                    </div>

                                    <p className={styles.description}>{tariff.description}</p>

                                    <ul className={styles.features}>
                                        {tariff.features.map((feature, i) => (
                                            <li key={i} className={styles.feature}>
                                                <Check size={16} className={styles.featureIcon} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={styles.bookButton}
                                        onClick={() => {
                                            setSelectedTariff(tariff.id);
                                            const element = document.getElementById('booking-form');
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        Заказать
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
