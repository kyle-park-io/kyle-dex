import { type Component, type JSX } from 'solid-js';
import { createEffect } from 'solid-js';
import {
  fromDexNavigate,
  setFromDexNavigate,
  fromAppNavigate,
  setFromAppNavigate,
  fromHeaderNavigate,
  setFromHeaderNavigate,
} from '../../global/global.store';

import './Bridge.css';

export const Bridge: Component = (): JSX.Element => {
  createEffect(() => {
    const fn = async (): Promise<void> => {
      if (fromDexNavigate.value) {
        setFromDexNavigate({ value: false });
        return;
      }
      if (fromAppNavigate.value) {
        setFromAppNavigate({ value: false });
        return;
      }
      if (fromHeaderNavigate.value) {
        setFromHeaderNavigate({ value: false });
        return;
      }
    };
    void fn;
  });

  return (
    <div class="bridge-container">
      {/* Content */}
      <div class="bridge-content">
        {/* Icon */}
        <div class="bridge-icon">
          <div class="bridge-icon-inner">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="12" r="3" />
              <path d="M9 12h6" />
              <path d="M6 9V6" />
              <path d="M6 18v-3" />
              <path d="M18 9V6" />
              <path d="M18 18v-3" />
            </svg>
          </div>
          <div class="bridge-icon-pulse"></div>
        </div>

        {/* Text */}
        <h1 class="bridge-title">Bridge</h1>
        <p class="bridge-subtitle">Cross-Chain Asset Transfer</p>

        {/* Coming Soon Badge */}
        <div class="coming-soon-badge">
          <span class="badge-dot"></span>
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
};
