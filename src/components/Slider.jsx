import React, { useEffect, useState } from 'react';
import './Slider.css';

const base = process.env.PUBLIC_URL || '';
const slides = [
  {
    id: 1,
    title: 'New Season Arrivals',
    subtitle: 'Elevate your performance',
    image: `${base}/images/slider1.png`
  },
  {
    id: 2,
    title: 'Essential Classics',
    subtitle: 'Timeless silhouettes',
    image: `${base}/images/slider2.png`
  },
  {
    id: 3,
    title: 'Premium Craft',
    subtitle: 'Designed for comfort',
    image: `${base}/images/slider3.png`
  },
  {
    id: 4,
    title: 'Active Lifestyle',
    subtitle: 'Move with confidence',
    image: `${base}/images/slider4.png`
  },
  {
    id: 5,
    title: 'Sport Shoes Collection',
    subtitle: 'Top picks this week',
    image: `${base}/images/slider5.png`
  }
];

export default function Slider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setIndex((index - 1 + slides.length) % slides.length);
  const next = () => setIndex((index + 1) % slides.length);

  return (
    <section className="slider-root">
      <div className="slider-container">
        {slides.map((s, i) => (
          <div key={s.id} className={`slide ${i === index ? 'active' : ''}`}>
            <img className="slide-img" src={s.image} alt={s.title} />
            <div className="overlay" />
            <div className="caption">
              <h2>{s.title}</h2>
              <p>{s.subtitle}</p>
            </div>
          </div>
        ))}
        <button className="nav-btn prev" onClick={prev}>‹</button>
        <button className="nav-btn next" onClick={next}>›</button>
        <div className="dots">
          {slides.map((_, i) => (
            <span key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}


