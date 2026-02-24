import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ответы на частые вопросы (FAQ) | Такси Межгород 777',
    description: 'Часто задаваемые вопросы о междугородних перевозках: цены, багаж, ожидание, отчетные документы и перевозка животных. Узнайте все подробности перед заказом!',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
