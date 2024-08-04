import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import CardSection from './CardSection';
import Page2 from '../Pages/Page2';
import Page3 from '../Pages/Page3';
import Time from '../Pages/Time';

function Home() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<CardSection />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/time" element={<Time />} />
      </Routes>
    </div>
  );
}

export default Home;
