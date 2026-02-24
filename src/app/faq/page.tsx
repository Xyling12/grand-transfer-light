"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const faqs = [
    {
        question: "Как узнать точную стоимость поездки?",
        answer: "Стоимость рассчитывается заранее в форме на сайте или оператором по телефону. Она фиксируется и не меняется из-за пробок или погодных условий. Вы платите ровно ту сумму, которая была озвучена при заказе."
    },
    {
        question: "За какое время лучше заказывать машину?",
        answer: "Рекомендуем оформлять заказ минимум за 2–3 часа до или за сутки до поездки, особенно для ранних утренних выездов или классов Минивэн/Бизнес. Однако мы принимаем и срочные заявки — подача от 15 минут в зависимости от наличия свободных машин."
    },
    {
        question: "Вы встречаете в аэропортах с табличкой?",
        answer: "Да, услуга встречи с табличкой предоставляется бесплатно. Водитель будет ждать вас в зоне прилета с табличкой, на которой написано ваше имя, и поможет донести багаж до машины."
    },
    {
        question: "Что делать, если рейс или поезд задержали?",
        answer: "Наши диспетчеры отслеживают статусы рейсов и поездов. Водитель приедет именно к моменту вашего фактического прибытия. За ожидание при задержке рейса доплачивать не нужно."
    },
    {
        question: "Предоставляете ли вы детские кресла?",
        answer: "Да, безопасность детей — наш приоритет. При оформлении заказа укажите возраст и вес ребенка, и мы бесплатно предоставим подходящее автокресло, люльку или бустер."
    },
    {
        question: "Можно ли перевозить домашних животных?",
        answer: "Перевозка питомцев разрешена при наличии переноски (для мелких животных) или специальной подстилки и намордника (для крупных собак). Услуга бесплатна, но обязательно предупредите диспетчера при заказе."
    },
    {
        question: "Выдаете ли вы документы для командировки?",
        answer: "Да, мы предоставляем полный пакет отчетных документов для бухгалтерии: электронный чек с QR-кодом или бумажную квитанцию строгой отчетности (БСО). Скажите об этом диспетчеру или водителю."
    },
    {
        question: "Обязательно ли вносить предоплату?",
        answer: "В большинстве случаев предоплата не требуется, вы оплачиваете поездку напрямую водителю наличными или переводом. Предоплата может понадобиться только при заказах минивэнов или автобусов на дальние расстояния."
    },
    {
        question: "Могу ли я сделать остановку в пути?",
        answer: "Да, кратковременные остановки в пути (например, на заправке, в туалет или перекусить до 15 минут) уже включены в стоимость тарифа. За длительные отклонения от маршрута может взиматься небольшая доплата по договоренности с водителем."
    },
    {
        question: "Какие машины приезжают на заказ?",
        answer: "В нашем автопарке только иномарки не старше 5–7 лет (для тарифа Эконом допускаются ухоженные отечественные авто). Все машины чистые, без курения в салоне и без посторонних запахов. Перед каждым рейсом проводится мойка и технический осмотр."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": faqs.map(faq => ({
                                "@type": "Question",
                                "name": faq.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.answer
                                }
                            }))
                        })
                    }}
                />
                <div className={styles.container}>
                    <h1 className={styles.title}>Частые вопросы</h1>
                    <p className={styles.subtitle}>
                        Собрали для вас ответы на самые популярные вопросы о наших междугородних поездках.
                    </p>

                    <div className={styles.faqList}>
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={index} className={styles.faqItem}>
                                    <button
                                        className={styles.questionButton}
                                        onClick={() => toggleFaq(index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                            className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
                                            size={20}
                                            strokeWidth={2.5}
                                        />
                                    </button>
                                    <div className={`${styles.answerWrapper} ${isOpen ? styles.answerWrapperOpen : ''}`}>
                                        <div className={styles.answerInner}>
                                            <p className={styles.answer}>{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
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
