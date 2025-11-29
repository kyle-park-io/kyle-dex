import { type Component, type JSX } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import {
  setFromDexNavigate,
  setFromDexNavigate2,
} from '../../global/global.store';

import './DexHeader.css';

export const DexHeader: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const handleChartClick = (): void => {
    const network = localStorage.getItem('network') as string;
    if (network === 'null') {
      if (location.pathname !== '/dex/chart') {
        setFromDexNavigate({ value: true });
        setFromDexNavigate2({ value: true });
        navigate(`/dex/chart`);
      }
    } else {
      if (location.pathname !== `/dex/chart/${network}`) {
        setFromDexNavigate({ value: true });
        setFromDexNavigate2({ value: true });
        navigate(`/dex/chart/${network}`);
      }
    }
  };
  const handleStakingClick = (): void => {
    const network = localStorage.getItem('network') as string;
    if (network === 'null') {
      if (location.pathname !== '/dex/staking') {
        setFromDexNavigate({ value: true });
        navigate(`/dex/staking`);
      }
    } else {
      if (location.pathname !== `/dex/staking/${network}`) {
        setFromDexNavigate({ value: true });
        navigate(`/dex/staking/${network}`);
      }
    }
  };
  const handleSwapClick = (): void => {
    const network = localStorage.getItem('network') as string;
    if (network === 'null') {
      if (location.pathname !== '/dex/swap') {
        setFromDexNavigate({ value: true });
        navigate(`/dex/swap`);
      }
    } else {
      if (location.pathname !== `/dex/swap/${network}`) {
        setFromDexNavigate({ value: true });
        navigate(`/dex/swap/${network}`);
      }
    }
  };
  const handleBridgeClick = (): void => {
    const network = localStorage.getItem('network') as string;
    if (network === 'null') {
      if (location.pathname !== '/dex/bridge') {
        setFromDexNavigate({ value: true });
        navigate('/dex/bridge');
      }
    } else {
      if (location.pathname !== `/dex/bridge/${network}`) {
        setFromDexNavigate({ value: true });
        navigate(`/dex/bridge/${network}`);
      }
    }
  };

  return (
    <nav class="dex-nav">
      <div class="dex-nav-container">
        <button
          class={`dex-nav-item ${isActive('/dex/chart') ? 'active' : ''}`}
          onClick={handleChartClick}
        >
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3v18h18"/>
            <path d="M18 17V9"/>
            <path d="M13 17V5"/>
            <path d="M8 17v-3"/>
          </svg>
          <span>Chart</span>
        </button>
        <button
          class={`dex-nav-item ${isActive('/dex/staking') ? 'active' : ''}`}
          onClick={handleStakingClick}
        >
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v12"/>
            <path d="M6 12h12"/>
          </svg>
          <span>Staking</span>
        </button>
        <button
          class={`dex-nav-item ${isActive('/dex/swap') ? 'active' : ''}`}
          onClick={handleSwapClick}
        >
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 16l-4-4 4-4"/>
            <path d="M3 12h18"/>
            <path d="M17 8l4 4-4 4"/>
          </svg>
          <span>Swap</span>
        </button>
        <button
          class={`dex-nav-item ${isActive('/dex/bridge') ? 'active' : ''}`}
          onClick={handleBridgeClick}
        >
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            <path d="M20 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            <path d="M5 10h14"/>
            <path d="M8.5 7L12 3.5 15.5 7"/>
            <path d="M8.5 13L12 16.5 15.5 13"/>
          </svg>
          <span>Bridge</span>
        </button>
      </div>
    </nav>
  );
};
