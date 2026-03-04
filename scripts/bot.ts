import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { cities } from '../src/data/cities';
dotenv.config();

const token = (process.env.TELEGRAM_BOT_TOKEN || '').replace(/['"]/g, '').trim();

if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN is missing or invalid! Telegram Bot will NOT start, but the website will continue to run.');
    // We don't exit the process here so Next.js can still run
} else {
    // Proceed with initialization if we have *some* token
    // (Actual verification happens when we call bot.launch)
}

const bot = new Telegraf(token || 'dummy:123456'); // Telegraf needs some token format to initialize the class
const prisma = new PrismaClient();
const adminId = (process.env.TELEGRAM_CHAT_ID || '').replace(/['"]/g, '').trim();

// Helper to generate the main menu keyboard
const getMainMenu = (chatId: string, role: string) => {
    let buttons = [];

    // Admin and Dispatcher gets extra buttons
    if (role === 'ADMIN' || chatId === adminId) {
        buttons.push(['👀 Активные заявки', '💬 Чат']);
        buttons.push(['👥 Пользователи', '📢 Рассылка']);
        buttons.push(['🌐 Панель на сайте', '📥 Выгрузить EXCEL']);
        buttons.push(['📊 Статистика', '🚗 Мои заказы']);
        buttons.push(['🗑 Очистить БД', 'ℹ️ Справка']);
        buttons.push(['⚙️ Настройки']);
    } else if (role === 'DISPATCHER') {
        buttons.push(['👀 Активные заявки', '💬 Чат']);
        buttons.push(['📊 Статистика', '🚗 Мои заказы']);
        buttons.push(['ℹ️ Справка']);
    } else {
        // Regular DRIVER
        buttons.push(['🚗 Мои заказы', '💬 Чат']);
        buttons.push(['📊 Статистика', 'ℹ️ Справка']);
    }

    return Markup.keyboard(buttons).resize();
};

bot.start(async (ctx) => {
    const telegramIdStr = ctx.chat.id.toString();
    const telegramIdBigInt = BigInt(ctx.chat.id);

    try {
        let driver = await prisma.driver.findUnique({
            where: { telegramId: telegramIdBigInt }
        });

        const isInitialAdmin = (telegramIdStr === adminId);

        if (!driver) {
            // Check if this is the designated initial admin from .env
            if (isInitialAdmin) {
                driver = await prisma.driver.create({
                    data: {
                        telegramId: telegramIdBigInt,
                        username: ctx.from.username,
                        firstName: ctx.from.first_name,
                        status: 'APPROVED',
                        role: 'ADMIN'
                    }
                });
                return ctx.reply('Добро пожаловать, Главный Администратор! Вы автоматически зарегистрированы и одобрены.', { ...getMainMenu(telegramIdStr, 'ADMIN'), protect_content: false });
            } else {
                // For regular users, show the registration button instead of auto-creating
                return ctx.reply(
                    'Здравствуйте! Добро пожаловать в Telegram-бот GrandTransfer.\n\nДля получения доступа к заказам необходимо подать заявку на регистрацию.',
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '📝 Подать заявку на регистрацию', callback_data: 'register_driver' }]
                            ]
                        }
                    }
                );
            }
        } else if (isInitialAdmin && (driver.status !== 'APPROVED' || driver.role !== 'ADMIN')) {
            // Rescue admin if they logged in before the fix
            driver = await prisma.driver.update({
                where: { telegramId: telegramIdBigInt },
                data: { status: 'APPROVED', role: 'ADMIN' }
            });
            return ctx.reply('Добро пожаловать, Главный Администратор! Ваши права восстановлены.', { ...getMainMenu(telegramIdStr, 'ADMIN'), protect_content: false });
        }

        if (driver.status === 'PENDING') {
            return ctx.reply('Ваша заявка все еще находится на рассмотрении у администратора.', { reply_markup: { remove_keyboard: true }, protect_content: true });
        } else if (driver.status === 'BANNED') {
            return ctx.reply('Доступ в систему заблокирован.', { reply_markup: { remove_keyboard: true }, protect_content: true });
        } else if (driver.status === 'APPROVED') {
            return ctx.reply('Добро пожаловать в рабочую панель водителя GrandTransfer! Ожидайте новых заказов.', { ...getMainMenu(telegramIdStr, driver.role), protect_content: driver.role !== 'ADMIN' });
        }
    } catch (e) {
        console.error('Error in /start:', e);
        ctx.reply('Произошла ошибка базы данных.');
    }
});

bot.action('register_driver', async (ctx) => {
    const telegramIdBigInt = BigInt(ctx.chat?.id || 0);

    try {
        // Check if already registered
        const existing = await prisma.driver.findUnique({ where: { telegramId: telegramIdBigInt } });
        if (existing) {
            return ctx.answerCbQuery('Вы уже подавали заявку.', { show_alert: true });
        }

        // Create the user
        await prisma.driver.create({
            data: {
                telegramId: telegramIdBigInt,
                username: ctx.from.username,
                firstName: ctx.from.first_name,
                status: 'PENDING',
                role: 'DRIVER'
            }
        });

        await ctx.answerCbQuery('Заявка успешно отправлена!');
        await ctx.editMessageText('✅ Ваша заявка в систему GrandTransfer отправлена администратору. Пожалуйста, дождитесь одобрения доступа. Как только администратор проверит ваши данные, вам придет уведомление.');

        // Notify admins about the new registration
        try {
            const admins = await prisma.driver.findMany({ where: { role: 'ADMIN', status: 'APPROVED' } });
            const userStr = ctx.from.username ? `@${ctx.from.username}` : (ctx.from.first_name || `ID: ${ctx.from.id}`);

            for (const ad of admins) {
                await bot.telegram.sendMessage(
                    Number(ad.telegramId),
                    `🚨 <b>Новая заявка на регистрацию!</b>\n\nПользователь ${userStr} ожидает одобрения.\n\nЗайдите в раздел 👥 <b>Пользователи</b>, чтобы одобрить заявку.`,
                    { parse_mode: 'HTML', protect_content: true }
                ).catch(() => { });
            }
        } catch (adminErr) {
            console.error('Failed to notify admins of new registration:', adminErr);
        }

    } catch (e) {
        console.error('Registration error:', e);
        ctx.answerCbQuery('Произошла ошибка при регистрации. Попробуйте еще раз позже.', { show_alert: true });
    }
});

// Helper to check authorization before executing commands
const checkAuth = async (ctx: any): Promise<{ auth: boolean, role: string, dbId?: string }> => {
    try {
        const id = BigInt(ctx.chat.id);
        const driver = await prisma.driver.findUnique({ where: { telegramId: id } });
        if (!driver || driver.status !== 'APPROVED') {
            ctx.reply('У вас нет доступа (либо вы заблокированы/в ожидании).');
            return { auth: false, role: 'USER' };
        }
        return { auth: true, role: driver.role, dbId: driver.id };
    } catch (e) {
        return { auth: false, role: 'USER' };
    }
};

bot.hears('⚙️ Настройки', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    // Only Main Admin can change global settings
    if (!auth || role !== 'ADMIN') return;

    try {
        let settings = await prisma.botSettings.findUnique({ where: { id: 1 } });
        if (!settings) {
            settings = await prisma.botSettings.create({ data: { id: 1, protectContent: true } });
        }

        const msg = `⚙️ <b>Параметры безопасности бота</b>\n\nТекущая конфигурация:\nЗащита контента (копирование/пересылка сообщений с контактами): <b>${settings.protectContent ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}</b>\n\n<i>Эта настройка применяется с момента переключения ко всем новым заявкам, отправляемым водителям. Если выключить — сообщения можно будет пересылать.</i>`;

        const keyboard = {
            inline_keyboard: [
                [{ text: `🛡 Защита контента: ${settings.protectContent ? 'ВКЛ' : 'ВЫКЛ'}`, callback_data: 'toggle_protection' }]
            ]
        };

        await ctx.replyWithHTML(msg, { reply_markup: keyboard, protect_content: true });

    } catch (e) {
        ctx.reply('❌ Ошибка при получении настроек.', { protect_content: true });
    }
});

bot.action('toggle_protection', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return ctx.answerCbQuery('Нет прав', { show_alert: true });

    try {
        let settings = await prisma.botSettings.findUnique({ where: { id: 1 } });
        if (!settings) {
            settings = await prisma.botSettings.create({ data: { id: 1, protectContent: true } });
        }

        const newValue = !settings.protectContent;
        await prisma.botSettings.update({
            where: { id: 1 },
            data: { protectContent: newValue }
        });

        const msg = `⚙️ <b>Параметры безопасности бота</b>\n\nТекущая конфигурация:\nЗащита контента (копирование/пересылка сообщений с контактами): <b>${newValue ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}</b>\n\n<i>Эта настройка применяется с момента переключения ко всем новым заявкам, отправляемым водителям. Если выключить — сообщения можно будет пересылать.</i>`;

        const keyboard = {
            inline_keyboard: [
                [{ text: `🛡 Защита контента: ${newValue ? 'ВКЛ' : 'ВЫКЛ'}`, callback_data: 'toggle_protection' }]
            ]
        };

        await ctx.editMessageText(msg, { parse_mode: 'HTML', reply_markup: keyboard });
        await ctx.answerCbQuery(`Защита контента теперь ${newValue ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}`, { show_alert: false });
    } catch (e) {
        await ctx.answerCbQuery('Ошибка обновления настроек');
    }
});

bot.hears('📊 Статистика', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || (role !== 'ADMIN' && role !== 'DRIVER')) return;

    try {
        const totalOrders = await prisma.order.count();
        const sumResult = await prisma.order.aggregate({ _sum: { priceEstimate: true } });

        const tariffGroups = await prisma.order.groupBy({
            by: ['tariff'],
            _count: { tariff: true },
            orderBy: { _count: { tariff: 'desc' } }
        });

        let tariffStatsStr = "";
        if (tariffGroups.length > 0) {
            tariffStatsStr = "<b>Заказов по тарифам:</b>\n" + tariffGroups.map((t: any) => {
                const capitalizedName = t.tariff ? t.tariff.charAt(0).toUpperCase() + t.tariff.slice(1) : 'Не указан';
                return `- ${capitalizedName}: ${t._count.tariff} шт.`;
            }).join('\n') + "\n────────────────";
        }

        const msg = `
📊 <b>Статистика сервиса</b>
────────────────
✅ Всего заявок оформлено: ${totalOrders}
💰 Выручка (оценочно): ~${sumResult._sum.priceEstimate || 0} ₽
────────────────
${tariffStatsStr}`.trim();
        await ctx.replyWithHTML(msg, getMainMenu(ctx.chat.id.toString(), role));
    } catch (e) {
        ctx.reply('❌ Ошибка при получении статистики.', { protect_content: role !== 'ADMIN' });
    }
});

bot.hears('ℹ️ Справка', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth) return;

    let msg = `🤖 <b>Справка по боту GrandTransfer</b>\n\n`;
    msg += `<b>Основные функции (для водителей):</b>\n`;
    msg += `• <b>Получение рассылок:</b> Бот будет присылать уведомления о новых заказах с ограниченной информацией. Нажмите «✅ Забрать заявку», чтобы взять её и получить контакты клиента.\n`;
    msg += `• <b>🚗 Мои заказы:</b> Просмотр списка своих взятых заявок с контактами клиента и ссылкой на маршрут.\n`;
    msg += `• <b>💬 Чат:</b> Получение индивидуальной ссылки для вступления в закрытую группу водителей.\n`;
    msg += `• <b>📊 Статистика:</b> Просмотр общей выручки сервиса и заказов по тарифам.\n\n`;

    if (role === 'DISPATCHER' || role === 'ADMIN') {
        msg += `🎧 <b>Функции Диспетчера:</b>\n`;
        msg += `• <b>Прием заказов:</b> Новые заявки с сайта приходят вам с полными данными клиента (ФИО, телефон).\n`;
        msg += `• <b>👀 Активные заявки:</b> Просмотр списка всех заявок, их статусов (в поиске / взята) и исполнителей.\n`;
        msg += `• <b>📤 Отправить водителям:</b> Публикация заказа в общую ленту водителей без контактов.\n\n`;
    }

    if (role === 'ADMIN') {
        msg += `👑 <b>Дополнительные функции (Администратор):</b>\n`;
        msg += `• <b>👥 Пользователи:</b> Поиск людей по ID/@username, одобрение/бан, выдача ролей администраторов, диспетчеров и просмотр чужих заказов.\n`;
        msg += `• <b>📢 Рассылка:</b> Команда <code>/send текст</code> отправляет важное сообщение всем пользователям.\n`;
        msg += `• <b>📥 Выгрузить EXCEL:</b> Скачивание всей базы заявок CSV файлом.\n`;
        msg += `• <b>🗑 Очистить БД:</b> Полное удаление всех заявок.\n`;
        msg += `• <b>🌐 Панель на сайте:</b> Получение ссылки и пин-кода (7878) для доступа к веб-интерфейсу.\n`;
    }

    ctx.replyWithHTML(msg, { protect_content: role !== 'ADMIN' });
});

bot.hears('🚗 Мои заказы', async (ctx) => {
    const { auth, dbId } = await checkAuth(ctx);
    if (!auth || !dbId) return;

    try {
        const myOrders = await prisma.order.findMany({
            where: { driverId: dbId, status: 'TAKEN' },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        if (myOrders.length === 0) {
            return ctx.reply('У вас пока нет активных взятых заявок.', { protect_content: true });
        }

        let msg = '🚗 <b>Ваши активные заявки:</b>\n\n';
        myOrders.forEach((o: any) => {
            const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('ru-RU') : '';

            const fromLower = o.fromCity.toLowerCase();
            const toLower = o.toCity.toLowerCase();
            const fromCityObj = cities.find(c => c.name.toLowerCase() === fromLower)
                ?? cities.find(c => fromLower.includes(c.name.toLowerCase()) && c.name.length > 3);
            const toCityObj = cities.find(c => c.name.toLowerCase() === toLower)
                ?? cities.find(c => toLower.includes(c.name.toLowerCase()) && c.name.length > 3);

            const pt1 = fromCityObj ? `${fromCityObj.lat},${fromCityObj.lon}` : encodeURIComponent(o.fromCity);
            const pt2 = toCityObj ? `${toCityObj.lat},${toCityObj.lon}` : encodeURIComponent(o.toCity);
            const mapLink = `https://yandex.ru/maps/?mode=routes&rtt=auto&rtext=${pt1}~${pt2}`;

            msg += `📋 <b>Заявка № ${o.id}</b> (создана ${dateStr})\n` +
                `📍 <b>Откуда:</b> ${o.fromCity}\n` +
                `🏁 <b>Куда:</b> ${o.toCity}\n` +
                `🚕 <b>Тариф:</b> ${o.tariff}\n` +
                `👥 <b>Пассажиров:</b> ${o.passengers}\n` +
                `💰 <b>Стоимость:</b> ${o.priceEstimate ? o.priceEstimate + ' ₽' : 'Не рассчитана'}\n\n` +
                `📝 <b>Комментарий:</b> ${o.comments || 'Нет'}\n` +
                `🗺 <a href="${mapLink}">📍 Открыть маршрут в Яндекс Картах</a>\n\n` +
                `👤 <b>Клиент:</b> ${o.customerName}\n` +
                `📞 <b>Телефон:</b> ${o.customerPhone}\n` +
                `━━━━━━━━━━━━━━━━━━\n\n`;
        });


        ctx.replyWithHTML(msg, { protect_content: true });
    } catch (err) {
        ctx.reply('❌ Ошибка при получении ваших заказов.', { protect_content: true });
    }
});

bot.hears('👀 Активные заявки', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || (role !== 'ADMIN' && role !== 'DISPATCHER')) return;

    try {
        const activeOrders = await prisma.order.findMany({
            where: { status: { in: ['TAKEN', 'NEW', 'DISPATCHED', 'PROCESSING'] } },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        if (activeOrders.length === 0) {
            return ctx.reply('Сейчас нет активных заявок.', { protect_content: true });
        }

        const allDrivers = await prisma.driver.findMany();
        const driverMap = new Map();
        allDrivers.forEach((d: any) => {
            const name = d.username ? `@${d.username}` : (d.firstName || `ID: ${d.telegramId}`);
            driverMap.set(d.id, name);
        });

        let msg = '👀 <b>Активные заявки (в работе):</b>\n\n';
        activeOrders.forEach((o: any) => {
            const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('ru-RU') : '';
            const driverName = o.driverId ? driverMap.get(o.driverId) || 'Неизвестен' : 'Неизвестен';

            let statusEmoji = o.status === 'NEW' ? '🔵' : (o.status === 'DISPATCHED' ? '🟡' : (o.status === 'PROCESSING' ? '🟣' : '🟢'));
            let driverInfo = '';

            if (o.status === 'TAKEN') {
                driverInfo = `\n👨‍✈️ <b>Исполнитель (Водитель):</b> ${driverName}`;
            } else if (o.status === 'PROCESSING') {
                driverInfo = `\n🎧 <b>Исполнитель (Диспетчер):</b> ${o.dispatcherId ? (driverMap.get(o.dispatcherId) || 'Неизвестен') : 'Неизвестен'}`;
            } else {
                driverInfo = `\n📌 <b>Статус:</b> В поиске`;
            }

            msg += `${statusEmoji} <b>Заявка № ${o.id}</b> (${dateStr})\n` +
                `📍 <b>Маршрут:</b> ${o.fromCity} — ${o.toCity}\n` +
                `💰 <b>Сумма:</b> ${o.priceEstimate ? o.priceEstimate + ' ₽' : 'Не рассчитана'}` +
                `${driverInfo}\n` +
                `━━━━━━━━━━━━━━━━━━\n\n`;
        });

        ctx.replyWithHTML(msg, { protect_content: true });
    } catch (err: any) {
        ctx.reply(`❌ Ошибка при получении активных заявок.\nТех. информация: ${err.message}`, { protect_content: true });
    }
});

// Admin commands
bot.hears('💬 Чат', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth) return;

    const groupId = process.env.TELEGRAM_GROUP_ID || '-1003744157897';

    if (!groupId) {
        return ctx.reply('⚠️ Ссылка на общий чат пока не настроена.', { protect_content: true });
    }

    try {
        const expireDate = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
        const inviteLink = await ctx.telegram.createChatInviteLink(groupId, {
            expire_date: expireDate,
            member_limit: 1,
            name: `Invite for ${ctx.from.first_name}`
        });

        await ctx.reply(`🔗 <b>Ваша индивидуальная ссылка в чат водителей:</b>\n\n${inviteLink.invite_link}\n\n<i>Ссылка действительна 24 часа и рассчитана на одно вступление. Передавать её третьим лицам бессмысленно.</i>`, { parse_mode: 'HTML', protect_content: true });
    } catch (err) {
        console.error('Fail generate personal chat link', err);
        ctx.reply('❌ Не удалось получить ссылку. Возможно, бот не добавлен в группу или не имеет прав.', { protect_content: true });
    }
});

bot.hears('🌐 Панель на сайте', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return;
    ctx.reply('Панель управления доступна по ссылке: https://xn--c1acbe2apap.com/admin/drivers', { protect_content: true });
});

bot.hears('🗑 Очистить БД', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return;
    try {
        await prisma.order.deleteMany({});
        ctx.reply('🗑 Статистика (все заявки) была успешно удалена из базы данных.', { protect_content: true });
    } catch (e) {
        ctx.reply('❌ Ошибка удаления данных.', { protect_content: true });
    }
});

bot.hears('📢 Рассылка', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return;
    ctx.reply('Для того чтобы отправить сообщение ВСЕМ пользователям бота (включая водителей), напишите команду <b>/send</b> и ваш текст через пробел.\n\nНапример:\n<code>/send Вышло обновление! Чтобы появились новые функции, напишите /start</code>', { parse_mode: 'HTML', protect_content: true });
});

bot.command('send', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return;

    const text = ctx.message.text.replace('/send', '').trim();
    if (!text) {
        return ctx.reply('⚠️ Пожалуйста, напишите текст после команды /send.\nПример: /send Всем привет!', { protect_content: true });
    }

    try {
        const users = await prisma.driver.findMany();
        let successCount = 0;

        await ctx.reply(`⏳ Начинаю рассылку для ${users.length} пользователей...`);

        for (const u of users) {
            try {
                await bot.telegram.sendMessage(
                    Number(u.telegramId),
                    `📢 <b>Уведомление от администрации:</b>\n\n${text}`,
                    { parse_mode: 'HTML', protect_content: true }
                );
                successCount++;
            } catch (e) {
                // user might have blocked the bot, skip
            }
        }

        ctx.reply(`✅ Рассылка завершена!\nУспешно доставлено: ${successCount} из ${users.length} пользователей.`, { protect_content: true });
    } catch (e) {
        ctx.reply('❌ Ошибка при рассылке.', { protect_content: true });
    }
});

bot.hears('📥 Выгрузить EXCEL', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return;
    try {
        const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
        let csv = '\uFEFF';
        csv += "ID;Дата;Откуда;Куда;Тариф;Пассажиров;Сумма;Имя;Телефон;Комментарий;Водитель\n";
        orders.forEach((o: any) => {
            const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('ru-RU') : '';
            const safeComment = (o.comments || '').replace(/;/g, ',').replace(/\n/g, ' ');
            csv += `${o.id};${dateStr};${o.fromCity};${o.toCity};${o.tariff};${o.passengers};${o.priceEstimate || ''};${o.customerName};${o.customerPhone};${safeComment};${o.driverId || ''}\n`;
        });
        const buffer = Buffer.from(csv, 'utf8');
        await ctx.replyWithDocument(
            { source: buffer, filename: `orders_${new Date().toISOString().split('T')[0]}.csv` },
            { caption: '📄 Выгрузка БД', protect_content: true }
        );
    } catch (e) {
        ctx.reply('❌ Ошибка экспорта.', { protect_content: true });
    }
});

// Admin Panel for Users inside Bot
bot.hears('👥 Пользователи', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return;

    try {
        const drivers = await prisma.driver.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
        if (drivers.length === 0) return ctx.reply("В базе нет пользователей.", { protect_content: true });

        // Add a "Search by ID" button at the very top of the user list
        await ctx.reply('🔍 <b>Панель пользователей</b>\nНажмите кнопку ниже, чтобы найти конкретного человека по ID Телеграма или внутреннему ID базы:', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: '🔍 Поиск по ID', callback_data: 'search_user' }]]
            },
            protect_content: true
        });

        for (const d of drivers) {
            const name = d.username ? `@${d.username}` : (d.firstName || `ID: ${d.telegramId}`);
            let text = `👤 <b>${name}</b>\nРоль: <b>${d.role}</b>\nСтатус: <b>${d.status}</b>\nTG ID: <code>${d.telegramId}</code>`;

            const buttons = [];
            if (d.status === 'PENDING') {
                buttons.push(Markup.button.callback('✅ Принять (Водитель)', `approve_${d.telegramId}`));
                buttons.push(Markup.button.callback('🎧 Принять (Диспетчер)', `approve_disp_${d.telegramId}`));
            }
            if (d.status !== 'BANNED') {
                buttons.push(Markup.button.callback('🚫 Забанить', `ban_${d.telegramId}`));
            }
            buttons.push(Markup.button.callback('🗑 Выгнать', `delete_${d.telegramId}`));

            // Only Main Admin can assign ADMIN roles or demote Admins
            if (ctx.chat?.id.toString() === adminId) {
                if (d.role === 'USER' || d.role === 'DRIVER') {
                    buttons.push(Markup.button.callback('👑 Админ', `setrole_${d.telegramId}_ADMIN`));
                    buttons.push(Markup.button.callback('🎧 Диспетчер', `setrole_${d.telegramId}_DISPATCHER`));
                } else if (d.role === 'ADMIN' && d.telegramId.toString() !== adminId) {
                    buttons.push(Markup.button.callback('🚗 Понизить в Водителя', `setrole_${d.telegramId}_DRIVER`));
                    buttons.push(Markup.button.callback('🎧 Понизить в Диспетчера', `setrole_${d.telegramId}_DISPATCHER`));
                } else if (d.role === 'DISPATCHER') {
                    buttons.push(Markup.button.callback('🚗 Сделать Водителем', `setrole_${d.telegramId}_DRIVER`));
                    buttons.push(Markup.button.callback('👑 Админ', `setrole_${d.telegramId}_ADMIN`));
                }
            } else {
                // Other Admins can at least assign Dispachers, but not Admins, and cannot touch other Admins
                if (d.role === 'ADMIN') {
                    // Cannot modify another admin
                } else if (d.role === 'USER' || d.role === 'DRIVER') {
                    buttons.push(Markup.button.callback('🎧 Диспетчер', `setrole_${d.telegramId}_DISPATCHER`));
                } else if (d.role === 'DISPATCHER') {
                    buttons.push(Markup.button.callback('🚗 Сделать Водителем', `setrole_${d.telegramId}_DRIVER`));
                }
            }

            if (d.status === 'BANNED') {
                buttons.push(Markup.button.callback('🔄 Восстановить', `approve_${d.telegramId}`));
            }
            buttons.push(Markup.button.callback('📦 Заказы', `view_orders_${d.telegramId}`));

            const keyboardRows = [];
            for (let i = 0; i < buttons.length; i += 2) {
                keyboardRows.push(buttons.slice(i, i + 2));
            }

            await ctx.replyWithHTML(text, { ...Markup.inlineKeyboard(keyboardRows), protect_content: true });
        }
    } catch (err) {
        ctx.reply('❌ Ошибка получения пользователей.', { protect_content: true });
    }
});

// Admin Panel Callbacks
bot.action('search_user', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return;

    await ctx.reply('Введите Telegram ID или @username пользователя для поиска:', {
        reply_markup: { force_reply: true },
        protect_content: false
    });
    await ctx.answerCbQuery();
});

// Listen for the text reply containing the ID or username
bot.on('text', async (ctx, next) => {
    const replyToMsg = ctx.message.reply_to_message as any;
    if (replyToMsg && replyToMsg.text && replyToMsg.text.includes('Введите Telegram ID или @username')) {
        const { auth, role } = await checkAuth(ctx);
        if (!auth || role !== 'ADMIN') return;

        let searchStr = ctx.message.text.trim();
        let d = null;

        try {
            // Check if it's an ID
            if (/^\d+$/.test(searchStr)) {
                d = await prisma.driver.findUnique({ where: { telegramId: BigInt(searchStr) } });
            } else {
                // Otherwise treat as username
                if (searchStr.startsWith('@')) {
                    searchStr = searchStr.substring(1);
                }
                d = await prisma.driver.findFirst({ where: { username: searchStr } });
            }

            if (!d) {
                return ctx.reply('Пользователь не найден.', { protect_content: role !== 'ADMIN' });
            }

            const name = d.username ? `@${d.username}` : (d.firstName || `ID: ${d.telegramId}`);
            let text = `🔍 <b>Найден Пользователь</b>\n\n👤 <b>${name}</b>\nРоль: <b>${d.role}</b>\nСтатус: <b>${d.status}</b>\nTG ID: <code>${d.telegramId}</code>`;

            const buttons = [];
            if (d.status === 'PENDING') {
                buttons.push(Markup.button.callback('✅ Принять (Водитель)', `approve_${d.telegramId}`));
                buttons.push(Markup.button.callback('🎧 Принять (Диспетчер)', `approve_disp_${d.telegramId}`));
            }
            if (d.status !== 'BANNED') {
                buttons.push(Markup.button.callback('🚫 Забанить', `ban_${d.telegramId}`));
            }
            buttons.push(Markup.button.callback('🗑 Выгнать', `delete_${d.telegramId}`));
            // Only Main Admin can assign ADMIN roles or demote Admins
            if (ctx.chat?.id.toString() === adminId) {
                if (d.role === 'USER' || d.role === 'DRIVER') {
                    buttons.push(Markup.button.callback('👑 Админ', `setrole_${d.telegramId}_ADMIN`));
                    buttons.push(Markup.button.callback('🎧 Диспетчер', `setrole_${d.telegramId}_DISPATCHER`));
                } else if (d.role === 'ADMIN' && d.telegramId.toString() !== adminId) {
                    buttons.push(Markup.button.callback('🚗 Понизить в Водителя', `setrole_${d.telegramId}_DRIVER`));
                    buttons.push(Markup.button.callback('🎧 Понизить в Диспетчера', `setrole_${d.telegramId}_DISPATCHER`));
                } else if (d.role === 'DISPATCHER') {
                    buttons.push(Markup.button.callback('🚗 Сделать Водителем', `setrole_${d.telegramId}_DRIVER`));
                    buttons.push(Markup.button.callback('👑 Админ', `setrole_${d.telegramId}_ADMIN`));
                }
            } else {
                // Other Admins can at least assign Dispachers, but not Admins, and cannot touch other Admins
                if (d.role === 'ADMIN') {
                    // Cannot modify another admin
                } else if (d.role === 'USER' || d.role === 'DRIVER') {
                    buttons.push(Markup.button.callback('🎧 Диспетчер', `setrole_${d.telegramId}_DISPATCHER`));
                } else if (d.role === 'DISPATCHER') {
                    buttons.push(Markup.button.callback('🚗 Сделать Водителем', `setrole_${d.telegramId}_DRIVER`));
                }
            }
            if (d.status === 'BANNED') {
                buttons.push(Markup.button.callback('🔄 Восстановить', `approve_${d.telegramId}`));
            }
            buttons.push(Markup.button.callback('📦 Заказы', `view_orders_${d.telegramId}`));

            const keyboardRows = [];
            for (let i = 0; i < buttons.length; i += 2) {
                keyboardRows.push(buttons.slice(i, i + 2));
            }

            return ctx.replyWithHTML(text, { ...Markup.inlineKeyboard(keyboardRows), protect_content: role !== 'ADMIN' });
        } catch (err) {
            ctx.reply('❌ Ошибка поиска.', { protect_content: role !== 'ADMIN' });
        }
    } else {
        return next();
    }
});

bot.action(/^approve_(\d+)$/, async (ctx) => {
    const telegramId = BigInt(ctx.match[1]);
    try {
        const updatedDriver = await prisma.driver.update({ where: { telegramId }, data: { status: 'APPROVED', role: 'DRIVER' } });
        await ctx.answerCbQuery('Одобрен как Водитель');
        await ctx.editMessageText((ctx.callbackQuery.message as any)?.text + '\n\n✅ ОДОБРЕН КАК ВОДИТЕЛЬ');
        try {
            await bot.telegram.sendMessage(Number(telegramId), '✅ Ваша заявка одобрена! Теперь вам доступно меню водителя.', { ...getMainMenu(telegramId.toString(), updatedDriver.role), protect_content: true });
        } catch (e) { }
    } catch {
        await ctx.answerCbQuery('Ошибка обновления');
    }
});

bot.action(/^approve_disp_(\d+)$/, async (ctx) => {
    const telegramId = BigInt(ctx.match[1]);
    try {
        const updatedDriver = await prisma.driver.update({ where: { telegramId }, data: { status: 'APPROVED', role: 'DISPATCHER' } });
        await ctx.answerCbQuery('Одобрен как Диспетчер');
        await ctx.editMessageText((ctx.callbackQuery.message as any)?.text + '\n\n✅ ОДОБРЕН КАК ДИСПЕТЧЕР');
        try {
            await bot.telegram.sendMessage(Number(telegramId), '✅ Ваша заявка одобрена! Теперь вам доступно меню диспетчера.', { ...getMainMenu(telegramId.toString(), updatedDriver.role), protect_content: true });
        } catch (e) { }
    } catch {
        await ctx.answerCbQuery('Ошибка обновления');
    }
});

bot.action(/^ban_(\d+)$/, async (ctx) => {
    const telegramId = BigInt(ctx.match[1]);
    try {
        await prisma.driver.update({ where: { telegramId }, data: { status: 'BANNED' } });
        await ctx.answerCbQuery('Пользователь забанен');
        await ctx.editMessageText((ctx.callbackQuery.message as any)?.text + '\n\n🚫 СТАТУС ИЗМЕНЕН НА: BANNED');
    } catch {
        await ctx.answerCbQuery('Ошибка обновления');
    }
});

bot.action(/^delete_(\d+)$/, async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') return ctx.answerCbQuery('Нет прав');

    const telegramId = BigInt(ctx.match[1]);
    try {
        await prisma.driver.delete({ where: { telegramId } });
        await ctx.answerCbQuery('Пользователь удален из базы');
        await ctx.editMessageText((ctx.callbackQuery.message as any)?.text + '\n\n🗑 ПОЛЬЗОВАТЕЛЬ УДАЛЕН');
    } catch {
        await ctx.answerCbQuery('Ошибка удаления. Возможно, за ним числятся заказы.');
    }
});

bot.action(/^setrole_(\d+)_([A-Z]+)$/, async (ctx) => {
    const telegramId = BigInt(ctx.match[1]);
    const newRole = ctx.match[2];
    try {
        await prisma.driver.update({ where: { telegramId }, data: { role: newRole } });
        await ctx.answerCbQuery(`Роль изменена на ${newRole}`);
        await ctx.editMessageText((ctx.callbackQuery.message as any)?.text + `\n\n👑 РОЛЬ ИЗМЕНЕНА НА: ${newRole}`);
        try {
            await bot.telegram.sendMessage(Number(telegramId), `Вам присвоена роль: ${newRole}! Меню обновлено.`, { ...getMainMenu(telegramId.toString(), newRole), protect_content: true });
        } catch (e) { }
    } catch {
        await ctx.answerCbQuery('Ошибка обновления');
    }
});

bot.action(/^view_orders_(\d+)$/, async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    if (!auth || role !== 'ADMIN') {
        return ctx.answerCbQuery('Нет прав доступа', { show_alert: true });
    }

    const telegramId = BigInt(ctx.match[1]);
    try {
        const targetDriver = await prisma.driver.findUnique({ where: { telegramId } });
        if (!targetDriver) return ctx.answerCbQuery('Водитель не найден.');

        const orders = await prisma.order.findMany({
            where: targetDriver.role === 'DISPATCHER' ? { dispatcherId: targetDriver.id } : { driverId: targetDriver.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        if (orders.length === 0) {
            return ctx.answerCbQuery('У пользователя нет заявок в работе.', { show_alert: true });
        }

        let msg = `📦 <b>Заявки (${targetDriver.role === 'DISPATCHER' ? 'Диспетчер' : 'Водитель'}) ${targetDriver.firstName || 'Без имени'}:</b>\n\n`;
        orders.forEach((o: any) => {
            const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('ru-RU') : '';
            msg += `📋 <b>Заявка № ${o.id}</b> (создана ${dateStr})\n` +
                `📍 <b>Откуда:</b> ${o.fromCity}\n` +
                `🏁 <b>Куда:</b> ${o.toCity}\n` +
                `🚕 <b>Тариф:</b> ${o.tariff}\n` +
                `👥 <b>Пассажиров:</b> ${o.passengers}\n` +
                `💰 <b>Стоимость:</b> ${o.priceEstimate ? o.priceEstimate + ' ₽' : 'Не рассчитана'}\n\n` +
                `📝 <b>Комментарий:</b> ${o.comments || 'Нет'}\n` +
                `👤 <b>Клиент:</b> ${o.customerName}\n` +
                `📞 <b>Телефон:</b> ${o.customerPhone}\n` +
                `👨‍✈️ <b>Исполнитель:</b> ${targetDriver.firstName || 'Без имени'} (@${targetDriver.username || 'Нет'})\n` +
                `📌 <b>Статус:</b> ${o.status}\n` +
                `━━━━━━━━━━━━━━━━━━\n\n`;
        });

        await ctx.answerCbQuery('Загружаем заявки...');
        await ctx.replyWithHTML(msg, { protect_content: true });
    } catch (err) {
        ctx.answerCbQuery('Ошибка получения заявок.');
    }
});

// Dispatch Order Action (For Admins and Dispatchers)
bot.action(/^dispatch_order_(\d+)$/, async (ctx) => {
    const { auth, role, dbId } = await checkAuth(ctx);
    if (!auth || !dbId || (role !== 'ADMIN' && role !== 'DISPATCHER')) {
        return ctx.answerCbQuery('У вас нет прав для отправки заявки водителям.', { show_alert: true });
    }

    const orderId = parseInt(ctx.match[1], 10);
    try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            return ctx.answerCbQuery('Заявка не найдена в базе.', { show_alert: true });
        }

        if (order.status !== 'NEW' && order.status !== 'PROCESSING') {
            const txt = (ctx.callbackQuery.message as any)?.text || "Заявка";
            await ctx.editMessageText(txt + '\n\n❌ <i>Эта заявка уже обработана или взята водителем.</i>', { parse_mode: 'HTML' });
            return ctx.answerCbQuery('Уже обработано!', { show_alert: true });
        }

        // Lock the order as DISPATCHED
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'DISPATCHED', dispatcherId: dbId }
        });

        const txt = (ctx.callbackQuery.message as any)?.text || "Заявка";
        const dispatcherInfo = `\n\n✅ <b>ВЫ ОТПРАВИЛИ ЭТУ ЗАЯВКУ ВОДИТЕЛЯМ</b>`;
        await ctx.editMessageText(txt + dispatcherInfo, { parse_mode: 'HTML' });
        await ctx.answerCbQuery('Заявка отправлена водителям!', { show_alert: true });

        // Build the restricted message for Drivers (No Name, No Phone)
        const fromLower = order.fromCity.toLowerCase();
        const toLower = order.toCity.toLowerCase();
        const fromCityObj = cities.find(c => c.name.toLowerCase() === fromLower)
            ?? cities.find(c => fromLower.includes(c.name.toLowerCase()) && c.name.length > 3);
        const toCityObj = cities.find(c => c.name.toLowerCase() === toLower)
            ?? cities.find(c => toLower.includes(c.name.toLowerCase()) && c.name.length > 3);
        const pt1 = fromCityObj ? `${fromCityObj.lat},${fromCityObj.lon}` : encodeURIComponent(order.fromCity);
        const pt2 = toCityObj ? `${toCityObj.lat},${toCityObj.lon}` : encodeURIComponent(order.toCity);
        const mapLink = `https://yandex.ru/maps/?mode=routes&rtt=auto&rtext=${pt1}~${pt2}`;

        const driverMessage = `
🚕 <b>Новый заказ для водителей!</b>

📍 <b>Откуда:</b> ${order.fromCity}
🏁 <b>Куда:</b> ${order.toCity}
🚕 <b>Тариф:</b> ${order.tariff}
👥 <b>Пассажиров:</b> ${order.passengers}
💰 <b>Стоимость:</b> ${order.priceEstimate ? order.priceEstimate + ' ₽' : 'Не рассчитана'}

📝 <b>Комментарий:</b> ${order.comments || 'Нет'}
<i>(Остальные контакты будут доступны после принятия заявки)</i>

<i>№ заказа: ${order.id}</i>
        `.trim();

        const keyboard = {
            inline_keyboard: [
                [{ text: '✅ Забрать заявку', callback_data: `take_order_${order.id}` }],
                [{ text: '🗺 Открыть маршрут', url: mapLink }]
            ]
        };

        let protectContentGlobal = true;
        try {
            const settings = await prisma.botSettings.findUnique({ where: { id: 1 } });
            if (settings) {
                protectContentGlobal = settings.protectContent;
            }
        } catch (e) { }

        // Find all approved DRIVERS and send it
        const drivers = await prisma.driver.findMany({
            where: { status: 'APPROVED', role: { in: ['DRIVER', 'ADMIN'] } }
            // Send to admins as well so they can test/see what drivers see
        });

        for (const drv of drivers) {
            try {
                // If it's an admin, we don't protect it so they can easily manage. 
                // If it's a driver, we follow global protect_content settings.
                const shouldProtect = drv.role === 'ADMIN' ? false : protectContentGlobal;

                const sentMsg = await bot.telegram.sendMessage(
                    Number(drv.telegramId),
                    driverMessage,
                    { parse_mode: 'HTML', reply_markup: keyboard, protect_content: shouldProtect }
                );

                // Track driver message so we can delete it when someone takes it
                await prisma.broadcastMessage.create({
                    data: {
                        orderId: order.id,
                        telegramId: BigInt(drv.telegramId),
                        messageId: sentMsg.message_id
                    }
                });
            } catch (err) {
                console.error(`Failed to send driver dispatch to ${drv.telegramId}:`, err);
            }
        }

    } catch (err) {
        console.error('Dispatch error:', err);
        ctx.answerCbQuery('Произошла ошибка базы данных.');
    }
});

// Take into Work Action (For Dispatchers and Admins)
bot.action(/^take_work_(\d+)$/, async (ctx) => {
    const { auth, role, dbId } = await checkAuth(ctx);
    if (!auth || !dbId || (role !== 'ADMIN' && role !== 'DISPATCHER')) {
        return ctx.answerCbQuery('У вас нет прав для взятия заявки диспетчером.', { show_alert: true });
    }

    const orderId = parseInt(ctx.match[1], 10);
    try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            return ctx.answerCbQuery('Заявка не найдена в базе.', { show_alert: true });
        }

        if (order.status !== 'NEW') {
            return ctx.answerCbQuery('Заявка уже в работе или отправлена водителям!', { show_alert: true });
        }

        // Update status to PROCESSING (meaning a dispatcher is working on it but it's not dispatched yet)
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PROCESSING', dispatcherId: dbId }
        });

        const takerName = ctx.from.username ? `@${ctx.from.username}` : (ctx.from.first_name || 'Неизвестно');

        // Update all dispatcher/admin notification messages
        try {
            const bms = await prisma.broadcastMessage.findMany({ where: { orderId } });

            for (const bm of bms) {
                try {
                    const isSelf = ctx.chat && bm.telegramId === BigInt(ctx.chat.id);
                    // Fetch original text (we just append status and change keyboard)
                    // Note: Telegraf doesn't have an easy way to GET message text, so we assume standard text and just overwrite reply markup
                    // Or we just send a new text to replace it - simplest approach is to construct it again or append

                    const fromLower2 = order.fromCity.toLowerCase();
                    const toLower2 = order.toCity.toLowerCase();
                    const fromCityObj = cities.find(c => c.name.toLowerCase() === fromLower2)
                        ?? cities.find(c => fromLower2.includes(c.name.toLowerCase()) && c.name.length > 3);
                    const toCityObj = cities.find(c => c.name.toLowerCase() === toLower2)
                        ?? cities.find(c => toLower2.includes(c.name.toLowerCase()) && c.name.length > 3);
                    const pt1 = fromCityObj ? `${fromCityObj.lat},${fromCityObj.lon}` : encodeURIComponent(order.fromCity);
                    const pt2 = toCityObj ? `${toCityObj.lat},${toCityObj.lon}` : encodeURIComponent(order.toCity);
                    const mapLink = `https://yandex.ru/maps/?mode=routes&rtt=auto&rtext=${pt1}~${pt2}`;

                    if (isSelf) {
                        const newText = `
🚨 <b>Новая заявка на трансфер!</b>

📍 <b>Откуда:</b> ${order.fromCity}
🏁 <b>Куда:</b> ${order.toCity}
🚕 <b>Тариф:</b> ${order.tariff}
👥 <b>Пассажиров:</b> ${order.passengers}
💰 <b>Расчетная стоимость:</b> ${order.priceEstimate ? order.priceEstimate + ' ₽' : 'Не рассчитана'}

📝 <b>Комментарий:</b> ${order.comments || 'Нет'}

<i>№ заказа: ${order.id}</i>

🎧 <b>Взял в работу:</b> ${takerName}
`.trim();

                        const newKeyboard = {
                            inline_keyboard: [
                                [{ text: '📋 Полная заявка', callback_data: `full_order_${order.id}` }],
                                [{ text: '📤 Отправить водителям', callback_data: `dispatch_order_${order.id}` }],
                                [{ text: '🗺 Открыть Яндекс Карты', url: mapLink }],
                                [{ text: '💻 Открыть CRM', url: 'https://xn--c1acbe2apap.com/admin/drivers' }]
                            ]
                        };

                        await bot.telegram.editMessageText(
                            Number(bm.telegramId),
                            bm.messageId,
                            undefined,
                            newText,
                            { parse_mode: 'HTML', reply_markup: newKeyboard }
                        );
                    } else {
                        // Delete the message for all other dispatchers/admins
                        await bot.telegram.deleteMessage(Number(bm.telegramId), bm.messageId);
                    }
                } catch (editErr) {
                    console.error(`Failed to update or delete msg for ${bm.telegramId}:`, editErr);
                }
            }
        } catch (dbErr) {
            console.error('Failed to get broadcast messages:', dbErr);
        }

        await ctx.answerCbQuery('Вы взяли заявку в работу!', { show_alert: true });

    } catch (err) {
        console.error('Take work error:', err);
        ctx.answerCbQuery('Произошла ошибка при взятии в работу.');
    }
});

// View Full Order (For Dispatchers holding the order)
bot.action(/^full_order_(\d+)$/, async (ctx) => {
    const { auth, role, dbId } = await checkAuth(ctx);
    if (!auth || !dbId || (role !== 'ADMIN' && role !== 'DISPATCHER')) return ctx.answerCbQuery('Нет прав');

    const orderId = parseInt(ctx.match[1], 10);
    try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return ctx.answerCbQuery('Заявка не найдена');

        const msg = `
📋 <b>Полная информация по заявке № ${order.id}</b>

📍 <b>Маршрут:</b> ${order.fromCity} — ${order.toCity}
🚕 <b>Тариф:</b> ${order.tariff}
👥 <b>Пассажиров:</b> ${order.passengers}
💰 <b>Стоимость:</b> ${order.priceEstimate ? order.priceEstimate + ' ₽' : 'Не рассчитана'}
📝 <b>Комментарий:</b> ${order.comments || 'Нет'}

👤 <b>Клиент:</b> ${order.customerName}
📞 <b>Телефон:</b> ${order.customerPhone}
`.trim();

        await ctx.replyWithHTML(msg, { protect_content: true });
        await ctx.answerCbQuery();
    } catch (e) {
        ctx.answerCbQuery('Ошибка получения данных');
    }
});

// Take Order Action (For Drivers)
bot.action(/^take_order_(\d+)$/, async (ctx) => {
    const { auth, dbId } = await checkAuth(ctx);
    if (!auth || !dbId) {
        return ctx.answerCbQuery('У вас нет прав для взятия заявки.', { show_alert: true });
    }

    const orderId = parseInt(ctx.match[1], 10);
    try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            return ctx.answerCbQuery('Заявка не найдена в базе.', { show_alert: true });
        }

        if (order.status !== 'DISPATCHED' && order.status !== 'NEW') {
            // Order is already taken or completed
            const txt = (ctx.callbackQuery.message as any)?.text || "Заявка";
            await ctx.editMessageText(txt + '\n\n❌ <i>Заявка уже взята в работу другим водителем.</i>', { parse_mode: 'HTML' });
            return ctx.answerCbQuery('Заявка уже взята!', { show_alert: true });
        }

        // Lock the order
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'TAKEN', driverId: dbId }
        });

        const txt = (ctx.callbackQuery.message as any)?.text || "Заявка";

        // Provide full info to the driver via editing the notification
        const customerInfo = `\n\n✅ <b>ВЫ ВЗЯЛИ ЭТУ ЗАЯВКУ В РАБОТУ</b>\n\n👤 <b>Клиент:</b> ${order.customerName}\n📞 <b>Телефон:</b> ${order.customerPhone}`;

        await ctx.editMessageText(txt + customerInfo, { parse_mode: 'HTML', reply_markup: undefined });
        await ctx.answerCbQuery('Вы успешно взяли заявку!', { show_alert: true });

        // Retrieve and delete messages for other drivers/admins
        try {
            const bms = await prisma.broadcastMessage.findMany({ where: { orderId } });
            const takerName = ctx.from.username ? `@${ctx.from.username}` : (ctx.from.first_name || 'Неизвестно');

            // Notify dispatcher and global admins
            const staffToNotify = await prisma.driver.findMany({
                where: {
                    status: 'APPROVED',
                    role: { in: ['ADMIN', 'DISPATCHER'] }
                }
            });

            const notifyPromises = staffToNotify.map(async (staff: any) => {
                // If the staff member is the one who just took the driver order, skip
                if (staff.telegramId === BigInt(ctx.chat?.id || 0)) return;

                const adminTxt = `🚨 <b>Заявка № ${orderId} ВЗЯТА В РАБОТУ</b>\n\n👨‍✈️ Водитель: <b>${takerName}</b>\n📍 Маршрут: ${order.fromCity} — ${order.toCity}\n💰 ${order.priceEstimate ? order.priceEstimate + ' ₽' : 'Без оценки'}`;
                return bot.telegram.sendMessage(Number(staff.telegramId), adminTxt, { parse_mode: 'HTML' }).catch(() => { });
            });
            await Promise.all(notifyPromises);

            for (const bm of bms) {
                // Do not delete for the driver who took the order (their message was edited above)
                if (ctx.chat && bm.telegramId === BigInt(ctx.chat.id)) continue;

                // Strip the "take order" button for everyone else by deleting the message
                // This cleans up the chat for drivers who didn't take it
                try {
                    await bot.telegram.deleteMessage(Number(bm.telegramId), bm.messageId);
                } catch (delErr) {
                    console.error(`Failed to delete message for ${bm.telegramId}:`, delErr);
                }
            }
        } catch (dbErr) {
            console.error('Failed to cleanup broadcast messages:', dbErr);
        }

    } catch (err) {
        console.error('Take_order error:', err);
        ctx.answerCbQuery('Произошла ошибка при попытке взять заявку.');
    }
});

// Moderation Settings
const BANNED_WORDS = ['хуй', 'пизда', 'ебать', 'сука', 'блядь', 'блять', 'пидор', 'гандон', 'шлюха'];
const POLITICAL_WORDS = ['путин', 'зеленский', 'навальный', 'байден', 'сво', 'война', 'украина', 'россия', 'политика', 'митинг', 'выборы'];
const URL_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)|(t\.me\/[^\s]+)/gi;

// Chat Group Moderation Listener
bot.on('message', async (ctx, next) => {
    // Only moderate messages in group chats (supergroups or regular groups)
    if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {

        // 1. System messages cleanup (Join/Leave/Pin)
        if ('new_chat_members' in ctx.message || 'left_chat_member' in ctx.message || 'pinned_message' in ctx.message) {
            try {
                await ctx.deleteMessage();
            } catch (err) { }
            return; // Stop processing this message
        }

        const messageText = (ctx.message as any)?.text || (ctx.message as any)?.caption || '';

        if (!messageText) return next();

        const lowerText = messageText.toLowerCase();
        let shouldDelete = false;
        let reason = '';

        // 1. Check for URLs / Links
        if (URL_REGEX.test(messageText)) {
            shouldDelete = true;
            reason = 'Ссылки запрещены';
        }

        // 2. Check for Profanity
        if (!shouldDelete && BANNED_WORDS.some(word => lowerText.includes(word))) {
            shouldDelete = true;
            reason = 'Ненормативная лексика';
        }

        // 3. Check for Political keywords
        if (!shouldDelete && POLITICAL_WORDS.some(word => lowerText.includes(word))) {
            shouldDelete = true;
            reason = 'Политические обсуждения правилами запрещены';
        }

        if (shouldDelete) {
            try {
                await ctx.deleteMessage();
                // Optionally warn the user silently or briefly
                const warning = await ctx.reply(`⚠️ @${ctx.from.username || ctx.from.first_name}, ваше сообщение удалено. Причина: ${reason}.`);
                // Delete the warning after 5 seconds to keep the chat clean
                setTimeout(() => {
                    ctx.telegram.deleteMessage(ctx.chat.id, warning.message_id).catch(() => { });
                }, 5000);
            } catch (err) {
                console.error('Failed to moderate / delete message:', err);
            }
            // Stop processing this message further
            return;
        }
    }

    // Continue processing if no violation or not a group chat
    return next();
});

// Generate Group Invite Link (Main Admins Only for direct usage, though everyone gets one via Chat button)
bot.command('invite', async (ctx) => {
    const { auth, role } = await checkAuth(ctx);
    // Only the owner can manually generate open-ended links
    if (!auth || ctx.chat.id.toString() !== adminId) return;

    // The chat ID of the group must be provided, or bot needs to know it.
    const groupId = process.env.TELEGRAM_GROUP_ID || '-1003744157897';

    if (!groupId) {
        return ctx.reply('⚠️ ID группы не настроен (TELEGRAM_GROUP_ID). Добавьте бота в группу и выдайте ему права администратора, затем я смогу генерировать ссылки.', { protect_content: true });
    }

    try {
        // Generate a link that expires in 1 day and allows 1 use
        const expireDate = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
        const inviteLink = await ctx.telegram.createChatInviteLink(groupId, {
            expire_date: expireDate,
            member_limit: 1,
            name: `Invite for ${ctx.from.first_name}`
        });

        await ctx.reply(`🔗 <b>Одноразовая ссылка в закрытый чат водителей:</b>\n\n${inviteLink.invite_link}\n\n<i>Ссылка действительна 24 часа для одного(1) человека.</i>`, { parse_mode: 'HTML', protect_content: true });
    } catch (err) {
        console.error('Fail generate link', err);
        ctx.reply('❌ Ошибка генерации ссылки. Проверьте, что бот является Администратором в нужной группе.', { protect_content: true });
    }
});

// Bot version command
bot.command('version', async (ctx) => {
    ctx.reply('🤖 GrandTransfer Bot v1.3.0\n\nОбновление:\n- Новый функционал "Взять в работу" для Диспетчеров\n- Автоматическое удаление заявок у других диспетчеров при взятии в работу\n- Кнопка "Полная заявка" для просмотра контактов клиента\n- Разделение Исполнителей (Водитель/Диспетчер) в "Активных заявках"', { protect_content: true });
});

let isShuttingDown = false;

async function startBot() {
    while (!isShuttingDown) {
        try {
            console.log('🤖 Telegram bot is starting...');
            // Force delete any existing webhook so long-polling works reliably
            await bot.telegram.deleteWebhook({ drop_pending_updates: true });
            await bot.launch({ dropPendingUpdates: true });
            console.log('🤖 Telegram bot stopped normally.');
            break;
        } catch (error) {
            console.error('Bot crashed, restarting in 5s...', error);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

startBot();

process.once('SIGINT', () => { isShuttingDown = true; bot.stop('SIGINT'); });
process.once('SIGTERM', () => { isShuttingDown = true; bot.stop('SIGTERM'); });
