import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Страница не найдена | Такси 777',
    description: 'Запрашиваемая страница не существует. Вернитесь на главную страницу Такси 777 для заказа междугороднего такси.',
};

export default function NotFound() {
    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center',
        }}>
            <h1 style={{
                fontSize: '6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FFD700, #111)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px',
                lineHeight: 1,
            }}>
                404
            </h1>
            <h2 style={{
                fontSize: '1.5rem',
                marginBottom: '16px',
                color: 'var(--color-foreground)',
            }}>
                Страница не найдена
            </h2>
            <p style={{
                color: 'var(--color-text-muted)',
                marginBottom: '32px',
                maxWidth: '400px',
                lineHeight: 1.6,
            }}>
                Возможно, страница была перемещена или удалена. Попробуйте вернуться на главную и найти нужную информацию.
            </p>
            <Link
                href="/"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    background: '#FFD700',
                    color: '#111',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'opacity 0.2s',
                }}
            >
                На главную
            </Link>
        </main>
    );
}
