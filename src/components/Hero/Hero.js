import React, { useState, useEffect } from 'react';
import './Hero.css';
import './HeroMobileAdaptive.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Нова колекція осінь-зима 2024",
      subtitle: "Преміальний дитячий одяг",
      description: "Стильний та якісний одяг для дітей від 2 до 14 років. Розміри до 164 см.",
      buttonText: "Переглянути колекцію",
      buttonLink: "#products",
      image: "/images/hero-1.jpg",
      badge: "NEW",
      offer: "Знижка до 30% на нову колекцію"
    },
    {
      id: 2,
      title: "Розпродаж літньої колекції",
      subtitle: "Встигніть придбати!",
      description: "Останні розміри літнього одягу зі знижками до 50%. Обмежена кількість.",
      buttonText: "До розпродажу",
      buttonLink: "#sale",
      image: "/images/hero-2.jpg",
      badge: "SALE",
      offer: "Знижки до 50%"
    },
    {
      id: 3,
      title: "Аксесуари для стильних дітей",
      subtitle: "Завершіть образ",
      description: "Модні сумки, прикраси та аксесуари для створення неповторного стилю.",
      buttonText: "Переглянути аксесуари",
      buttonLink: "#accessories",
      image: "/images/hero-3.jpg",
      badge: "TRENDING",
      offer: "Безкоштовна доставка від 1000 грн"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="hero">
      <div className="hero-container">
        {/* Background Image */}
        <div className="hero-background">
          <div className="hero-image-wrapper">
            <div 
              className="hero-image"
              style={{ 
                backgroundImage: `url(${currentHero.image})`,
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            />
          </div>
          <div className="hero-overlay" />
        </div>

        {/* Content */}
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              {/* Badge */}
              <div className={`hero-badge badge-${currentHero.badge.toLowerCase()}`}>
                {currentHero.badge}
              </div>

              {/* Offer */}
              <div className="hero-offer">
                <i className="fas fa-fire"></i>
                {currentHero.offer}
              </div>

              {/* Main Content */}
              <h1 className="hero-title">
                {currentHero.title}
              </h1>
              
              <h2 className="hero-subtitle">
                {currentHero.subtitle}
              </h2>
              
              <p className="hero-description">
                {currentHero.description}
              </p>

              {/* CTA Buttons */}
              <div className="hero-actions">
                <a href={currentHero.buttonLink} className="btn btn-primary btn-lg hero-cta">
                  {currentHero.buttonText}
                  <i className="fas fa-arrow-right"></i>
                </a>
                <a href="#catalog" className="btn btn-secondary btn-lg">
                  Весь каталог
                </a>
              </div>

              {/* Features */}
              <div className="hero-features">
                <div className="feature">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Безкоштовна доставка</span>
                </div>
                <div className="feature">
                  <i className="fas fa-undo"></i>
                  <span>Легкий обмін</span>
                </div>
                <div className="feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Гарантія якості</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="hero-navigation">
          <button className="hero-nav-btn prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="hero-nav-btn next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Задоволених клієнтів</div>
              </div>
              <div className="stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Товарів в асортименті</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Підтримка клієнтів</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Позитивних відгуків</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;