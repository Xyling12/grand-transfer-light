"use client";

import {
    Zap,
    UserCheck,
    Sparkles,
    Baby,
    Map,
    UsersRound
} from 'lucide-react';
import styles from './WhyChooseUs.module.css';

const features = [
    {
        icon: Zap,
        title: "Подача от 15 минут",
        description: "Моментальное назначение водителя. Машина будет у вас максимально быстро, без долгих ожиданий."
    },
    {
        icon: UserCheck,
        title: "Проверенные водители",
        description: "Строгий отбор в штат: только профессионалы с отличным знанием трасс и безаварийным стажем."
    },
    {
        icon: Sparkles,
        title: "Идеальная чистота",
        description: "Все автомобили проходят регулярную мойку. В салоне свежо, нет посторонних запахов и мусора."
    },
    {
        icon: Map,
        title: "От двери до двери",
        description: "Заберем вас прямо от подъезда и довезем до нужного адреса в другом городе без лишних пересадок."
    },
    {
        icon: UsersRound,
        title: "Без попутчиков",
        description: "Вы оплачиваете автомобиль целиком. Никаких чужих людей в салоне — едете только вы и ваш водитель."
    },
    {
        icon: Baby,
        title: "Детские кресла",
        description: "По предварительному запросу бесплатно предоставим чистое автокресло или бустер по возрасту ребенка."
    }
];

export default function WhyChooseUs() {
    return (
        <section className={`${styles.section} animate-on-scroll`} id="why-choose-us">
            <div id="about" style={{ position: 'absolute', top: '-100px' }}></div>
            <div className="container">
                <h2 className="section-title">Почему выбирают нас</h2>
                <p className="section-subtitle">
                    Надежно, быстро и недорого — идеальный вариант для поездок по России.
                </p>

                <div className={styles.grid}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className={styles.card}>
                                <div className={styles.iconWrapper}>
                                    <Icon size={32} />
                                </div>
                                <h3 className={styles.cardTitle}>{feature.title}</h3>
                                <p className={styles.cardDescription}>{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
