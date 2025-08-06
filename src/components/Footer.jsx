import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PRODUCTS</h3>
            <ul>
              <li><a href="/footwear">Footwear</a></li>
              <li><a href="/clothing">Clothing</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Sports</h3>
            <ul>
              <li><a href="/running">Running</a></li>
              <li><a href="/golf">Golf</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>COLLECTIONS</h3>
            <ul>
              <li><a href="/pharrell-williams">Pharrell Williams</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>COMPANY INFO</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>SUPPORT</h3>
            <ul>
              <li><a href="/help">Help</a></li>
              <li><a href="/store-finder">Store Finder</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>FOLLOW US</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}