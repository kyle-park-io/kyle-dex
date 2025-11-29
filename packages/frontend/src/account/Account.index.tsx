import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';
import { getClient } from './Account.axios';
import { type AccountInfo } from './interfaces/component.interface';
import { globalState } from '../global/constants';

import './Account.css';

const AccountIndex: Component = (): JSX.Element => {
  const params = useParams();

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [account, setAccount] = createSignal<AccountInfo>();

  const apiUrl = globalState.api_url;

  createEffect(() => {
    if (globalState.isOpen) {
      if (params.network !== 'null' && params.address !== 'null') {
        async function fetchData(): Promise<void> {
          try {
            const res = await getClient(apiUrl, {
              network: params.network,
              userAddress: params.address,
            });
            setAccount(res);
            setLoading(true);
          } catch (err) {
            if (err instanceof Error) {
              setError(err);
            } else {
              setError(new Error(String(err)));
            }
            setLoading(true);
          }
        }
        void fetchData();
      }
      if (params.network === 'null' || params.address === 'null') {
        setAccount();
        setLoading(true);
      }
    }
  });

  const getNetworkColor = (network: string) => {
    if (network === 'hardhat' || network === 'unknown') return '#fcd535';
    if (network === 'sepolia') return '#627eea';
    if (network === 'amoy') return '#8247e5';
    return 'var(--color-text-secondary)';
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <div class="account-container">
      {/* Header */}
      <section class="account-header">
        <h1 class="account-title">Account Info</h1>
        <p class="account-subtitle">View your wallet details and balance</p>
      </section>

      {/* Content */}
      <section class="account-content">
        {!loading() ? (
          <div class="account-loading">
            <div class="loading-spinner"></div>
            <span>Loading account data...</span>
          </div>
        ) : (
          <>
            {error() !== null ? (
              <div class="account-error">
                <div class="error-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <h3>Error Loading Account</h3>
                <p>{error()?.message}</p>
              </div>
            ) : (
              <>
                {account() !== undefined ? (
                  <div class="account-card">
                    {/* Network Badge */}
                    <div class="account-network">
                      <span
                        class="network-badge"
                        style={{
                          'background-color': `${getNetworkColor(account()?.network || '')}20`,
                          color: getNetworkColor(account()?.network || ''),
                        }}
                      >
                        <span
                          class="network-dot"
                          style={{
                            'background-color': getNetworkColor(
                              account()?.network || '',
                            ),
                          }}
                        ></span>
                        {account()?.network === 'unknown'
                          ? 'Hardhat'
                          : account()?.network}
                      </span>
                    </div>

                    {/* Account Name */}
                    <div class="account-name-section">
                      <div class="account-avatar">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <h2 class="account-name">
                        {account()?.name || 'Unknown'}
                      </h2>
                    </div>

                    {/* Account Details */}
                    <div class="account-details">
                      <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span
                          class="detail-value address"
                          title={account()?.address}
                        >
                          {formatAddress(account()?.address || '')}
                        </span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Nonce</span>
                        <span class="detail-value">{account()?.nonce}</span>
                      </div>
                      <div class="detail-item highlight">
                        <span class="detail-label">Balance</span>
                        <span class="detail-value balance">
                          {account()?.balance}
                          <span class="currency">ETH</span>
                        </span>
                      </div>
                    </div>

                    {/* Full Address */}
                    <div class="account-full-address">
                      <span class="full-address-label">Full Address</span>
                      <code class="full-address-value">
                        {account()?.address}
                      </code>
                    </div>
                  </div>
                ) : (
                  <div class="account-empty">
                    <div class="empty-icon">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    {params.network === 'null' ? (
                      <>
                        <h3>No Network Selected</h3>
                        <p>
                          Please select a network from the header to view
                          account information.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3>No Account Selected</h3>
                        <p>
                          Please select an account from the header to view
                          details.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default AccountIndex;
