'use client';

import Header from '../components/Header';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import Tariffs from '../components/Tariffs';
import PopularRoutes from '../components/PopularRoutes';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';

const BookingForm = dynamic(() => import('../components/BookingForm'), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <div id="top" />
      <Header />
      <Hero />
      <WhyChooseUs />
      <Tariffs />
      <PopularRoutes />
      <BookingForm />
      <Reviews />
      <Footer />
    </main>
  );
}