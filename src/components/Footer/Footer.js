import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Підпишіться на новини</h3>
              <p className="newsletter-description">
                Отримайте першими інформацію про нові колекції, знижки та спеціальні пропозиції
              </p>
            </div>
            <div className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Введіть ваш email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  <i className="fas fa-paper-plane"></i>
                  Підписатися
                </button>
              </div>
              <p className="newsletter-privacy">
                Підписуючись, ви погоджуєтесь з нашою <a href="#privacy">політикою конфіденційності</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-column">
              <div className="footer-logo">
                <h3 className="logo-text">VINESENT</h3>
                <p className="logo-tagline">Premium Kids Fashion</p>
              </div>
              <p className="company-description">
                Преміальний дитячий одяг для стильних дітей від 2 до 14 років. 
                Якість, комфорт та стиль в кожній деталі.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>+380 (67) 123-45-67</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>info@vinesent.ua</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>м. Київ, вул. Хрещатик, 1</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="footer-column">
              <h4 className="footer-title">Категорії</h4>
              <ul className="footer-links">
                <li><a href="#girls">Для дівчат</a></li>
                <li><a href="#boys">Для хлопців</a></li>
                <li><a href="#accessories">Аксесуари</a></li>
                <li><a href="#sale">Розпродаж</a></li>
                <li><a href="#new">Новинки</a></li>
                <li><a href="#premium">Преміум колекція</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-column">
              <h4 className="footer-title">Обслуговування</h4>
              <ul className="footer-links">
                <li><a href="#delivery">Доставка та оплата</a></li>
                <li><a href="#returns">Обмін та повернення</a></li>
                <li><a href="#size-guide">Таблиця розмірів</a></li>
                <li><a href="#care">Догляд за одягом</a></li>
                <li><a href="#warranty">Гарантія якості</a></li>
                <li><a href="#support">Підтримка клієнтів</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-column">
              <h4 className="footer-title">Компанія</h4>
              <ul className="footer-links">
                <li><a href="#about">Про нас</a></li>
                <li><a href="#stores">Наші магазини</a></li>
                <li><a href="#careers">Кар'єра</a></li>
                <li><a href="#press">Преса</a></li>
                <li><a href="#sustainability">Екологічність</a></li>
                <li><a href="#contact">Контакти</a></li>
              </ul>
            </div>

            {/* Social & Apps */}
            <div className="footer-column">
              <h4 className="footer-title">Слідкуйте за нами</h4>
              <div className="social-links">
                <a href="#instagram" className="social-link">
                  <i className="fab fa-instagram"></i>
                  <span>Instagram</span>
                </a>
                <a href="#facebook" className="social-link">
                  <i className="fab fa-facebook"></i>
                  <span>Facebook</span>
                </a>
                <a href="#telegram" className="social-link">
                  <i className="fab fa-telegram"></i>
                  <span>Telegram</span>
                </a>
                <a href="#youtube" className="social-link">
                  <i className="fab fa-youtube"></i>
                  <span>YouTube</span>
                </a>
              </div>
              
              <div className="app-downloads">
                <h5 className="app-title">Завантажте наш додаток</h5>
                <div className="app-buttons">
                  <a href="#app-store" className="app-button">
                    <i className="fab fa-apple"></i>
                    <div>
                      <span className="app-text">Завантажити в</span>
                      <span className="app-store">App Store</span>
                    </div>
                  </a>
                  <a href="#google-play" className="app-button">
                    <i className="fab fa-google-play"></i>
                    <div>
                      <span className="app-text">Завантажити в</span>
                      <span className="app-store">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-section">
        <div className="container">
          <div className="trust-badges">
            <div className="trust-badge">
              <i className="fas fa-shield-alt"></i>
              <div>
                <span className="trust-title">Безпечні платежі</span>
                <span className="trust-text">SSL шифрування</span>
              </div>
            </div>
            <div className="trust-badge">
              <i className="fas fa-truck"></i>
              <div>
                <span className="trust-title">Швидка доставка</span>
                <span className="trust-text">По всій Україні</span>
              </div>
            </div>
            <div className="trust-badge">
              <i className="fas fa-undo"></i>
              <div>
                <span className="trust-title">Легкий обмін</span>
                <span className="trust-text">30 днів гарантії</span>
              </div>
            </div>
            <div className="trust-badge">
              <i className="fas fa-headset"></i>
              <div>
                <span className="trust-title">Підтримка 24/7</span>
                <span className="trust-text">Завжди готові допомогти</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} VINESENT. Всі права захищені.</p>
            </div>
            <div className="legal-links">
              <a href="#privacy">Політика конфіденційності</a>
              <a href="#terms">Умови використання</a>
              <a href="#cookies">Політика cookies</a>
            </div>
            <div className="payment-methods">
              <span className="payment-text">Приймаємо:</span>
              <div className="payment-icons">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-apple-pay"></i>
                <i className="fab fa-google-pay"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;