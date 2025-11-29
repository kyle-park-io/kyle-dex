import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { globalState } from '../global/constants';
import {
  setFromAppNavigate,
  setFromAppNavigate2,
} from '../global/global.store';

import './App.css';

const App: Component = (): JSX.Element => {
  const navigate = useNavigate();

  const getNetworkPath = (base: string): string => {
    const network = localStorage.getItem('network') as string;
    if (network === 'null' || !network) return base;
    return `${base}/${network}`;
  };

  const handleChartClick = (): void => {
    setFromAppNavigate({ value: true });
    setFromAppNavigate2({ value: true });
    navigate(getNetworkPath('/dex/chart'));
  };

  const handleStakingClick = (): void => {
    setFromAppNavigate({ value: true });
    navigate(getNetworkPath('/dex/staking'));
  };

  const handleSwapClick = (): void => {
    setFromAppNavigate({ value: true });
    navigate(getNetworkPath('/dex/swap'));
  };

  const handleBridgeClick = (): void => {
    navigate(getNetworkPath('/dex/bridge'));
  };

  return (
    <div class="app-container">
      {globalState.isOpen ? (
        <>
          {/* Hero Section */}
          <section class="hero-section">
            <div class="hero-content">
              <h1 class="hero-title">
                DEX Built on
                <span class="hero-highlight"> Uniswap V2</span>
              </h1>
              <p class="hero-subtitle">
                A test DEX powered by Uniswap V2 protocol. Experience AMM swaps,
                liquidity pools, and staking on test networks.
              </p>
              <div class="hero-tags">
                <span class="hero-tag">Uniswap V2</span>
                <span class="hero-tag">AMM</span>
                <span class="hero-tag">Liquidity Pool</span>
                <span class="hero-tag">Testnet</span>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section class="features-section">
            <h2 class="section-title">Start Trading</h2>
            <div class="features-grid">
              {/* Chart Card */}
              <button onClick={handleChartClick} class="feature-card">
                <div class="feature-icon chart-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 class="feature-title">Chart</h3>
                <p class="feature-description">
                  Real-time price charts and liquidity pool analytics
                </p>
                <span class="feature-arrow">→</span>
              </button>

              {/* Staking Card */}
              <button onClick={handleStakingClick} class="feature-card">
                <div class="feature-icon staking-icon">
                  <svg
                    width="32"
                    height="32"
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
                <h3 class="feature-title">Staking</h3>
                <p class="feature-description">
                  Stake LP tokens and earn rewards
                </p>
                <span class="feature-arrow">→</span>
              </button>

              {/* Swap Card */}
              <button onClick={handleSwapClick} class="feature-card">
                <div class="feature-icon swap-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M16 3l4 4-4 4" />
                    <path d="M20 7H4" />
                    <path d="M8 21l-4-4 4-4" />
                    <path d="M4 17h16" />
                  </svg>
                </div>
                <h3 class="feature-title">Swap</h3>
                <p class="feature-description">
                  AMM-based token swaps using x * y = k formula
                </p>
                <span class="feature-arrow">→</span>
              </button>

              {/* Bridge Card */}
              <button onClick={handleBridgeClick} class="feature-card">
                <div class="feature-icon bridge-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M4 4h16v16H4z" fill="none" />
                    <path d="M9 9h6v6H9z" />
                    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
                  </svg>
                </div>
                <h3 class="feature-title">Bridge</h3>
                <p class="feature-description">
                  Transfer assets across different test networks
                </p>
                <span class="feature-arrow">→</span>
              </button>
            </div>
          </section>
        </>
      ) : (
        <div class="coming-soon">
          <div class="coming-soon-content">
            <div class="coming-soon-icon">🚀</div>
            <h1 class="coming-soon-title">KYLE DEX</h1>
            <p class="coming-soon-subtitle">Will Open Soon</p>
            <div class="coming-soon-line"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
