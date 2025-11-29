import { type Component, type JSX } from 'solid-js';

import './About.css';

const About: Component = (): JSX.Element => {
  return (
    <div class="about-container">
      {/* Hero Section */}
      <section class="about-hero">
        <h1 class="about-title">About KYLE DEX</h1>
        <p class="about-subtitle">
          A Uniswap V2 based decentralized exchange for testing and
          experimentation
        </p>
      </section>

      {/* Main Content */}
      <section class="about-content">
        {/* Project Overview */}
        <div class="about-card">
          <div class="about-card-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <h2 class="about-card-title">Project Overview</h2>
          <p class="about-card-text">
            This project is a test DEX that simulates real decentralized
            exchange trading. Built on Uniswap V2 (PancakeSwap) smart contracts,
            it provides a complete AMM experience on test networks.
          </p>
          <a
            href="https://github.com/pancakeswap/pancake-smart-contracts/tree/master/projects/exchange-protocol"
            target="_blank"
            rel="noopener noreferrer"
            class="about-link"
          >
            View PancakeSwap V2 Contracts →
          </a>
        </div>

        {/* Tech Stack */}
        <div class="about-card">
          <div class="about-card-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 class="about-card-title">Tech Stack</h2>
          <div class="tech-grid">
            <div class="tech-category">
              <h3 class="tech-category-title">Infrastructure</h3>
              <div class="tech-tags">
                <span class="tech-tag">GKE (GCP)</span>
                <span class="tech-tag">Kubernetes</span>
                <span class="tech-tag">Docker</span>
              </div>
            </div>
            <div class="tech-category">
              <h3 class="tech-category-title">Smart Contracts</h3>
              <div class="tech-tags">
                <span class="tech-tag solidity">Solidity</span>
                <span class="tech-tag">Hardhat</span>
              </div>
            </div>
            <div class="tech-category">
              <h3 class="tech-category-title">Backend</h3>
              <div class="tech-tags">
                <span class="tech-tag typescript">TypeScript</span>
                <span class="tech-tag">NestJS</span>
              </div>
            </div>
            <div class="tech-category">
              <h3 class="tech-category-title">Frontend</h3>
              <div class="tech-tags">
                <span class="tech-tag typescript">TypeScript</span>
                <span class="tech-tag">SolidJS</span>
                <span class="tech-tag">TailwindCSS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div class="about-card">
          <div class="about-card-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h2 class="about-card-title">Key Features</h2>
          <ul class="feature-list">
            <li class="feature-item">
              <span class="feature-check">✓</span>
              <span>AMM-based token swapping (x * y = k)</span>
            </li>
            <li class="feature-item">
              <span class="feature-check">✓</span>
              <span>Liquidity pool management</span>
            </li>
            <li class="feature-item">
              <span class="feature-check">✓</span>
              <span>LP token staking & rewards</span>
            </li>
            <li class="feature-item">
              <span class="feature-check">✓</span>
              <span>Real-time price charts</span>
            </li>
            <li class="feature-item">
              <span class="feature-check">✓</span>
              <span>Cross-chain bridge (Testnet)</span>
            </li>
            <li class="feature-item">
              <span class="feature-check">✓</span>
              <span>MetaMask wallet integration</span>
            </li>
          </ul>
        </div>

        {/* Networks */}
        <div class="about-card">
          <div class="about-card-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <h2 class="about-card-title">Supported Networks</h2>
          <div class="network-list">
            <div class="network-item">
              <span class="network-dot hardhat"></span>
              <span class="network-name">Hardhat</span>
              <span class="network-type">Local</span>
            </div>
            <div class="network-item">
              <span class="network-dot sepolia"></span>
              <span class="network-name">Sepolia</span>
              <span class="network-type">Ethereum Testnet</span>
            </div>
            <div class="network-item">
              <span class="network-dot amoy"></span>
              <span class="network-name">Amoy</span>
              <span class="network-type">Polygon Testnet</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div class="about-card">
          <div class="about-card-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 class="about-card-title">Developer</h2>
          <p class="about-card-text">
            Built by <strong>kyle-park-io</strong>
          </p>
          <div class="contact-links">
            <a
              href="https://github.com/kyle-park-io"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://kyle-park.notion.site/KYLE-DEX-96de910ad2a547fa9fb19c5bb960eaf4"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 2.001c-.466-.373-.98-.56-2.054-.466L3.433 2.94c-.467.046-.56.28-.373.466zm.793 3.08v13.904c0 .746.373 1.026 1.213.98l14.523-.84c.84-.046.933-.56.933-1.166V6.35c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.746.327-.746.933zm14.337.7c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.746 0-.933-.234-1.493-.934l-4.577-7.186v6.952l1.446.327s0 .84-1.167.84l-3.22.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.62c-.094-.42.14-1.026.793-1.073l3.453-.233 4.764 7.279v-6.44l-1.213-.14c-.094-.514.28-.886.746-.933zM1.936 1.035L15.13.148c1.634-.14 2.054-.047 3.08.7l4.25 2.986c.7.513.933.653.933 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.046-1.446-.094-1.96-.747L1.49 19.39c-.56-.746-.793-1.306-.793-1.96V2.621c0-.84.373-1.54 1.24-1.587z" />
              </svg>
              Notion
            </a>
            <a
              href="https://t.me/kyleparkio"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
