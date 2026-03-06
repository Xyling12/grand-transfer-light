import { MetadataRoute } from 'next';
import { cities, getDistanceFromLatLonInKm } from '@/data/cities';
import { blogPosts } from '@/data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taximezhgorod777.ru';
    const routes: MetadataRoute.Sitemap = [];

    // ── Main static pages ────────────────────────────────────────────────────
    routes.push({ url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 });
    routes.push({ url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 });
    routes.push({ url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
    routes.push({ url: `${baseUrl}/routes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
    routes.push({ url: `${baseUrl}/tarify`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 });
    routes.push({ url: `${baseUrl}/kontakty`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
    routes.push({ url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 });
    routes.push({ url: `${baseUrl}/oferta`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 });
    routes.push({ url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.1 });

    // ── Blog ─────────────────────────────────────────────────────────────────
    routes.push({ url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 });
    blogPosts.forEach(post => {
        routes.push({
            url: `${baseUrl}/blog/${post.id}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    // ── City landing pages: /${city.id} ──────────────────────────────────────
    // All city.id values are Latin-only — no Cyrillic encoding in URLs.
    cities.forEach(city => {
        routes.push({
            url: `${baseUrl}/${city.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        });
    });

    // ── Inter-city route pages ────────────────────────────────────────────────
    // Top 60 cities — yields ~800-1000 routes
    const routeCities = cities.slice(0, 60);
    routeCities.forEach(fromCity => {
        routeCities.forEach(toCity => {
            if (fromCity.id !== toCity.id) {
                const dist = getDistanceFromLatLonInKm(fromCity.lat, fromCity.lon, toCity.lat, toCity.lon);
                if (dist >= 30 && dist <= 1200) {
                    routes.push({
                        url: `${baseUrl}/routes/${fromCity.id}/${toCity.id}`,
                        lastModified: new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.6,
                    });
                }
            }
        });
    });

    return routes;
}
