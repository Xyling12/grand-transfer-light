import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { CityProvider } from "@/context/CityContext";
import ScrollAnimation from "@/components/ScrollAnimation";
import SchemaOrg from "@/components/SchemaOrg";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://taximezhgorod777.ru'),
  title: "Такси Межгород | Заказать такси надежно - Такси 777",
  description: "Закажите междугороднее такси. Быстрая подача, фиксированные цены от 1200 руб, опытные водители. Эконом и комфорт класс. Звоните!",
  keywords: "такси межгород, такси межгород недорого, заказ такси, эконом, такси граница кпп, такси 777, межгород",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://taximezhgorod777.ru",
    siteName: "Такси 777",
    title: "Такси Межгород | Заказать такси надежно",
    description: "Надежные междугородние поездки с фиксированной ценой до любого города или границы.",
    images: [{
      url: "/images/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Междугороднее такси 777"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Такси Межгород | Заказать такси надежно",
    description: "Мгновенный расчет стоимости и быстрые поездки по межгороду."
  },
  verification: {
    google: "yIaO8R6k5e6iQ-nkshc6D5BP5O3D6bZEUG7x8Mr_RpM",
    yandex: "4a87d70a322542ad"
  }
};

import YandexMetrika from "@/components/YandexMetrika";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${bodoni.variable} ${jost.variable} `}>
        <SchemaOrg />
        <YandexMetrika />
        <CityProvider>
          <ScrollAnimation />
          {children}
        </CityProvider>
      </body>
    </html>
  );
}
