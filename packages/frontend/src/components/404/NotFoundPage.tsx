import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import './NotFoundPage.css';

const NotFoundPage: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const handleButtonClick = (): void => {
    navigate('/dex');
  };

  return (
    <div class="not-found-container">
      {/* Animated background grid */}
      <div class="grid-background"></div>

      {/* Glowing orb effect */}
      <div class="glow-orb"></div>

      {/* Content */}
      <div class="not-found-content">
        {/* 404 Number with glitch effect */}
        <div class="error-code">
          <span class="glitch" data-text="404">
            404
          </span>
        </div>

        {/* Error message */}
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p class="error-subtitle">Let's get you back on track.</p>

        {/* Action buttons */}
        <div class="error-actions">
          <button onClick={handleButtonClick} class="btn-home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Home
          </button>
        </div>

        {/* Decorative elements */}
        <div class="crypto-icons">
          <span class="crypto-icon">₿</span>
          <span class="crypto-icon">Ξ</span>
          <span class="crypto-icon">◎</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
