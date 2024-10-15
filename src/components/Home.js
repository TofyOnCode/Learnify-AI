import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Pricing from './Pricing';
import Testimonials from './Testimonials';
import FAQ from './FAQ';

function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
    </div>
  );
}

export default Home;
