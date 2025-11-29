import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { Offcanvas } from 'solid-bootstrap';
import { type AccountBalanceOfProps } from '../interfaces/component.interface';
import { getClientBalanceOf } from '../Account.axios';
import { globalState } from '../../global/constants';
import axios from 'axios';

import './Account.balanceOf.css';

const api = globalState.api_url;

const [isNull, setIsNull] = createSignal(true);
const [isEmpty, setIsEmpty] = createSignal(true);
const [balancesOf, setBalancesOf] = createSignal<any>([]);

const AccountBalanceOf: Component<AccountBalanceOfProps> = (
  props,
): JSX.Element => {
  createEffect(() => {
    const show = props.show;
    const fn = async (): Promise<void> => {
      try {
        if (!show) return;
        setIsEmpty(true);
        setIsNull(false);
        const network = localStorage.getItem('network') as string;
        const address = localStorage.getItem('address') as string;
        if (network === 'null' || address === 'null') {
          setIsNull(true);
          return;
        }

        const result = await getClientBalanceOf(api, {
          network,
          userAddress: address,
        });
        setIsEmpty(false);
        setBalancesOf(result);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setIsEmpty(true);
            setBalancesOf([]);
          }
        }
      }
    };
    void fn();
  });

  const getTokenIcon = (type: string) => {
    // Return different icons based on token type
    if (type?.toLowerCase().includes('lp')) {
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      );
    }
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M9 9l3-3 3 3M9 15l3 3 3-3" />
      </svg>
    );
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <>
      <Offcanvas
        show={props.show}
        onHide={props.onHide}
        placement={'end'}
        scroll={true}
        class="balance-offcanvas"
      >
        <div class="balance-offcanvas-header">
          <h2 class="balance-offcanvas-title">Token Balances</h2>
          <button class="balance-close-btn" onClick={props.onHide}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="balance-offcanvas-body">
          {isNull() ? (
            <div class="balance-empty-state">
              <div class="empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <h3>Connection Required</h3>
              <p>
                Please select a network and account to view your token balances.
              </p>
            </div>
          ) : (
            <>
              {!isEmpty() ? (
                <div class="balance-list">
                  {balancesOf().map((value: any) => (
                    <div class="balance-item">
                      <div class="balance-item-icon">
                        {getTokenIcon(value.type)}
                      </div>
                      <div class="balance-item-info">
                        <span class="balance-item-type">{value.type}</span>
                        <span
                          class="balance-item-address"
                          title={value.address}
                        >
                          {formatAddress(value.address)}
                        </span>
                      </div>
                      <div class="balance-item-amount">
                        <span class="balance-value">{value.balanceOf}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="balance-empty-state">
                  <div class="empty-icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="16" cy="12" r="2" />
                    </svg>
                  </div>
                  <h3>No Token Balances</h3>
                  <p>
                    You don't have any token balances yet. Start trading to see
                    your tokens here.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Offcanvas>
    </>
  );
};

export default AccountBalanceOf;
