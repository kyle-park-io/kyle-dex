import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount, For } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import axios from 'axios';
import { getClientList } from '../account/Account.axios';
import {
  setFromHeaderNavigate,
  HeaderNavigateType,
  setFromHeaderNavigate2,
} from '../global/global.store';
// css
import './Header.css';

// metamask
import MetamaskIndex from '../metamask/Metamask.index';

// account
import AccountBalanceOf from '../account/components/Account.balanceOf';

import { globalState } from '../global/constants';

const Header: Component = (): JSX.Element => {
  const apiUrl = globalState.api_url;
  const ingressURL = globalState.ingress_reverse_proxy_url;

  const location = useLocation();
  // navigate
  const navigate = useNavigate();
  const handleImageClick = (): void => {
    navigate('/dex');
  };
  const handleHomeClick = (): void => {
    if (globalState.isProd) {
      window.location.href = globalState.url;
    }
  };
  const handleAccountClick = (address: string): void => {
    navigate(`/dex/account/${network()}/${address}`);
  };

  // toggle
  const [isOpen, setIsOpen] = createSignal(false);
  const toggleDropdown = (): boolean => setIsOpen(!isOpen());
  const [isOpen2, setIsOpen2] = createSignal(false);
  const toggleDropdown2 = (): boolean => setIsOpen2(!isOpen2());

  // button color
  // const [hardhatButtonColor, setHardhatButtonColor] = createSignal('blue');
  const [hardhatButtonColor, setHardhatButtonColor] = createSignal('white');
  const [sepoliaButtonColor, setSepoliaButtonColor] = createSignal('white');
  const [amoyButtonColor, setAmoyButtonColor] = createSignal('white');

  // account
  const [accountButtonId, setAccountButtonId] = createSignal(null);
  const [accountButtonAddress, setAccountButtonAddress] = createSignal('null');
  const handleAccountButtonClick = (event): void => {
    const id = event.currentTarget.getAttribute('tabIndex');
    setAccountButtonId(id);
    console.log(accountButtonId());
    const address = event.currentTarget.getAttribute('id');
    if (localStorage.getItem('address') !== address) {
      setAccountButtonAddress(address);
      localStorage.setItem('address', address);
    } else {
      setAccountButtonAddress('null');
      localStorage.setItem('address', 'null');
    }
    if (location.pathname.startsWith('/dex/account')) {
      handleAccountClick(localStorage.getItem('address') as string);
    }
    setFromHeaderNavigate({ value: true, type: HeaderNavigateType.address });
    setFromHeaderNavigate2({ value: true, type: HeaderNavigateType.address });
  };

  // network status
  const [isLocal, setIsLocal] = createSignal(true);
  const [isRefresh, setIsRefresh] = createSignal(true);
  // const [network, setNetwork] = createSignal('hardhat');
  const [network, setNetwork] = createSignal(
    localStorage.getItem('network') as string,
  );
  const [connectNum, setConnectNum] = createSignal(0);
  const [loadMetamask, setLoadMetamask] = createSignal(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = createSignal(false);
  const [metamaskDisconnect, setMetamaskDisconnect] = createSignal(false);
  const [metamaskChange, setMetamaskChange] = createSignal(false);

  const updateNetwork = (networkKey: string): void => {
    if (network() === networkKey) {
      setIsLocal(true);
      setHardhatButtonColor('white');
      setSepoliaButtonColor('white');
      setAmoyButtonColor('white');
      setNetwork('null');
      localStorage.setItem('network', 'null');
      setAccountButtonAddress('null');
      if (location.pathname.startsWith('/dex/account')) {
        handleAccountClick('null');
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart');
      }
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/staking');
      }
      if (location.pathname.startsWith('/dex/swap')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/swap');
      }
      if (location.pathname.startsWith('/dex/bridge')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/bridge');
      }
    } else {
      if (networkKey === 'hardhat') {
        setIsLocal(true);
        setHardhatButtonColor('blue');
        setSepoliaButtonColor('white');
        setAmoyButtonColor('white');
        setNetwork(networkKey);
        localStorage.setItem('network', 'hardhat');
        localStorage.setItem('address', globalState.hardhat_admin_address);
        setAccountButtonAddress(globalState.hardhat_admin_address);
        if (location.pathname.startsWith('/dex/account')) {
          handleAccountClick(globalState.hardhat_admin_address);
        }
        if (location.pathname.startsWith('/dex/chart')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          setFromHeaderNavigate2({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/chart/hardhat');
        }
        if (location.pathname.startsWith('/dex/staking')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/staking/hardhat');
        }
        if (location.pathname.startsWith('/dex/swap')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/swap/hardhat');
        }
        if (location.pathname.startsWith('/dex/bridge')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/bridge/hardhat');
        }
      } else if (networkKey === 'sepolia') {
        setIsLocal(false);
        setHardhatButtonColor('white');
        setSepoliaButtonColor('blue');
        setAmoyButtonColor('white');
        setAccountButtonAddress('null');
        setNetwork(networkKey);
        localStorage.setItem('network', 'sepolia');
        localStorage.setItem('address', 'null');
        if (!isMetamaskConnected()) {
          if (localStorage.getItem('isConnected') === '0') {
            if (location.pathname.startsWith('/dex/account')) {
              handleAccountClick('null');
            }
          } else {
            handleSetMetamask();
          }
        } else {
          setMetamaskChange(true);
          if (location.pathname.startsWith('/dex/account')) {
            handleAccountClick(localStorage.getItem('address') as string);
          }
        }
        if (location.pathname.startsWith('/dex/chart')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          setFromHeaderNavigate2({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/chart/sepolia');
        }
        if (location.pathname.startsWith('/dex/staking')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/staking/sepolia');
        }
        if (location.pathname.startsWith('/dex/swap')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/swap/sepolia');
        }
        if (location.pathname.startsWith('/dex/bridge')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/bridge/sepolia');
        }
      } else {
        setIsLocal(false);
        setHardhatButtonColor('white');
        setSepoliaButtonColor('white');
        setAmoyButtonColor('blue');
        setAccountButtonAddress('null');
        setNetwork(networkKey);
        localStorage.setItem('network', 'amoy');
        localStorage.setItem('address', 'null');
        if (!isMetamaskConnected()) {
          if (localStorage.getItem('isConnected') === '0') {
            if (location.pathname.startsWith('/dex/account')) {
              handleAccountClick('null');
            }
          } else {
            handleSetMetamask();
          }
        } else {
          setMetamaskChange(true);
          if (location.pathname.startsWith('/dex/account')) {
            handleAccountClick(localStorage.getItem('address') as string);
          }
        }
        if (location.pathname.startsWith('/dex/chart')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          setFromHeaderNavigate2({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/chart/amoy');
        }
        if (location.pathname.startsWith('/dex/staking')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/staking/amoy');
        }
        if (location.pathname.startsWith('/dex/swap')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/swap/amoy');
        }
        if (location.pathname.startsWith('/dex/bridge')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/bridge/amoy');
        }
      }
    }
  };

  const updateNetwork2 = (networkKey: string): void => {
    if (networkKey === 'hardhat') {
      setIsLocal(true);
      setHardhatButtonColor('blue');
      setSepoliaButtonColor('white');
      setAmoyButtonColor('white');
      setNetwork(networkKey);
      setAccountButtonAddress(localStorage.getItem('address') as string);
      if (location.pathname.startsWith('/dex/account')) {
        handleAccountClick(localStorage.getItem('address') as string);
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart/hardhat');
      }
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/staking/hardhat');
      }
      if (location.pathname.startsWith('/dex/swap')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/swap/hardhat');
      }
      if (location.pathname.startsWith('/dex/bridge')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/bridge/hardhat');
      }
    } else if (networkKey === 'sepolia') {
      setIsLocal(false);
      setHardhatButtonColor('white');
      setSepoliaButtonColor('blue');
      setAmoyButtonColor('white');
      setAccountButtonAddress('null');
      setNetwork(networkKey);
      if (localStorage.getItem('isConnected') === '0') {
        if (location.pathname.startsWith('/dex/account')) {
          handleAccountClick('null');
        }
      } else {
        handleSetMetamask();
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart/sepolia');
      }
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/staking/sepolia');
      }
      if (location.pathname.startsWith('/dex/swap')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/swap/sepolia');
        if (location.pathname.startsWith('/dex/bridge')) {
          setFromHeaderNavigate({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/bridge/sepolia');
        }
      }
    } else if (networkKey === 'amoy') {
      setIsLocal(false);
      setHardhatButtonColor('white');
      setSepoliaButtonColor('white');
      setAmoyButtonColor('blue');
      setAccountButtonAddress('null');
      setNetwork(networkKey);
      if (localStorage.getItem('isConnected') === '0') {
        if (location.pathname.startsWith('/dex/account')) {
          handleAccountClick('null');
        }
      } else {
        handleSetMetamask();
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart/amoy');
      }
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/staking/amoy');
      }
      if (location.pathname.startsWith('/dex/swap')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/swap/amoy');
      }
      if (location.pathname.startsWith('/dex/bridge')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/bridge/amoy');
      }
    } else {
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart');
      }
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/staking');
      }
      if (location.pathname.startsWith('/dex/swap')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/swap');
      }
      if (location.pathname.startsWith('/dex/bridge')) {
        setFromHeaderNavigate({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/bridge');
      }
    }
  };

  // metamask
  const handleSetMetamask = (): void => {
    // TODO: check
    setConnectNum(connectNum() + 1);
    setLoadMetamask(true);
    if (location.pathname.startsWith('/dex/account')) {
      handleAccountClick(localStorage.getItem('address') as string);
    }
  };
  const propsHandleLoadMetamask = (): void => {
    setLoadMetamask(false);
  };
  const propsHandleMetamaskConnect = (): void => {
    setIsMetamaskConnected(true);
  };
  const handleMetamaskDisconnect = (): void => {
    setMetamaskDisconnect(true);
  };
  const propsHandleMetamaskDisconnect = (): void => {
    setIsMetamaskConnected(false);
    setMetamaskDisconnect(false);
    if (location.pathname.startsWith('/dex/account')) {
      handleAccountClick('null');
    }
  };
  const propsHandleMetamaskChange = (): void => {
    setMetamaskChange(false);
  };

  // error
  const [hardhatError, setHardhatError] = createSignal<Error | null>(null);
  const [sepoliaError, setSepoliaError] = createSignal<Error | null>(null);
  const [amoyError, setAmoyError] = createSignal<Error | null>(null);
  // props
  const propsHandleHardhatChange = (err): void => {
    setHardhatError(err);
  };
  const propsHandleSepoliaChange = (err): void => {
    setSepoliaError(err);
  };
  const propsHandleAmoyChange = (err): void => {
    setAmoyError(err);
  };

  // createEffect
  createEffect(() => {
    // set network
    if (isRefresh()) {
      const currentNetwork = localStorage.getItem('network');
      if (currentNetwork === 'hardhat') {
        updateNetwork2('hardhat');
      }
      if (currentNetwork === 'sepolia') {
        updateNetwork2('sepolia');
      }
      if (currentNetwork === 'amoy') {
        updateNetwork2('amoy');
      }
      if (currentNetwork === 'null') {
        updateNetwork2('null');
      }
      setIsRefresh(false);
    }
    if (
      hardhatError() !== null ||
      sepoliaError() !== null ||
      amoyError() !== null
    ) {
      console.log(hardhatError());
      console.log(sepoliaError());
      console.log(amoyError());
    }
  });

  const [count, setCount] = createSignal(0);
  const [accountList, setAccountList] = createSignal([]);
  onMount(() => {
    async function fetchData(): Promise<void> {
      const res = await getClientList(apiUrl, { network: 'hardhat' });
      setAccountList(res);

      const res2 = await axios.get(`${ingressURL}/redis-tcp/real`);
      setCount(res2.data);
      console.log('Real-time visitors: ', count());
    }
    void fetchData();
  });

  const [show, setShow] = createSignal(false);
  const handleOpen = (): void => {
    setShow(true);
  };
  const handleClose = (): void => {
    setShow(false);
  };

  const handleAboutClick = (): void => {
    navigate('/dex/about');
  };
  const handleSwaggerClick = (): void => {
    window.open(`${globalState.url}/dex/api-docs`);
  };

  // Get network display name
  const getNetworkDisplay = () => {
    const n = network();
    if (n === 'hardhat') return 'Hardhat';
    if (n === 'sepolia') return 'Sepolia';
    if (n === 'amoy') return 'Amoy';
    return 'Select Network';
  };

  return (
    <>
      <div class="header-container">
        {/* Hidden header for screen readers */}
        <header class="offscreen">KYLE DEX - Decentralized Exchange</header>

        {/* Metamask components */}
        <MetamaskIndex
          chainId="0x"
          network="hardhat"
          currentNetwork={network()}
          connectNum={connectNum()}
          loadMetamask={loadMetamask()}
          handleLoadMetamask={propsHandleLoadMetamask}
          isConnected={isMetamaskConnected()}
          handleConnect={propsHandleMetamaskConnect}
          disconnect={metamaskDisconnect()}
          handleDisconnect={propsHandleMetamaskDisconnect}
          change={metamaskChange()}
          handleChange={propsHandleMetamaskChange}
          onError={propsHandleHardhatChange}
        />
        <MetamaskIndex
          chainId="0xaa36a7"
          network="sepolia"
          currentNetwork={network()}
          connectNum={connectNum()}
          loadMetamask={loadMetamask()}
          handleLoadMetamask={propsHandleLoadMetamask}
          isConnected={isMetamaskConnected()}
          handleConnect={propsHandleMetamaskConnect}
          disconnect={metamaskDisconnect()}
          handleDisconnect={propsHandleMetamaskDisconnect}
          change={metamaskChange()}
          handleChange={propsHandleMetamaskChange}
          onError={propsHandleSepoliaChange}
        />
        <MetamaskIndex
          chainId="0x13882"
          network="amoy"
          currentNetwork={network()}
          connectNum={connectNum()}
          loadMetamask={loadMetamask()}
          handleLoadMetamask={propsHandleLoadMetamask}
          isConnected={isMetamaskConnected()}
          handleConnect={propsHandleMetamaskConnect}
          disconnect={metamaskDisconnect()}
          handleDisconnect={propsHandleMetamaskDisconnect}
          change={metamaskChange()}
          handleChange={propsHandleMetamaskChange}
          onError={propsHandleAmoyChange}
        />

        {/* Header Content */}
        <div class="header-inner">
          {/* Left Section - Home & Navigation */}
          <div class="header-left">
            {/* Home Button - DEX Logo */}
            <button onClick={handleHomeClick} class="header-home-btn" title="Home">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="10" fill="url(#home-gradient)"/>
                <path d="M20 10L28 15L28 25L20 30L12 25L12 15Z" fill="#0b0e11"/>
                <path d="M20 15L24 17.5V22.5L20 25L16 22.5V17.5L20 15Z" fill="url(#inner-gradient)"/>
                <defs>
                  <linearGradient id="home-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#f0b90b"/>
                    <stop offset="1" stop-color="#fcd535"/>
                  </linearGradient>
                  <linearGradient id="inner-gradient" x1="16" y1="15" x2="24" y2="25" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#f0b90b"/>
                    <stop offset="1" stop-color="#fcd535"/>
                  </linearGradient>
                </defs>
              </svg>
            </button>

            {/* Navigation Links */}
            <nav class="header-nav">
              <button onClick={handleAboutClick} class="header-nav-item">
                About
              </button>
              <button onClick={handleSwaggerClick} class="header-nav-item">
                Docs
              </button>
            </nav>
          </div>

          {/* Center Section - Logo */}
          <div class="header-center">
            <button onClick={handleImageClick} class="header-title">
              KYLE DEX
            </button>
          </div>

          {/* Right Section - Actions */}
          <div class="header-right">
            {/* Network Selector */}
            <div class="header-dropdown">
              <button
                onMouseEnter={toggleDropdown}
                class="header-network-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>{getNetworkDisplay()}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {isOpen() && (
                <div onMouseLeave={toggleDropdown} class="dropdown-content">
                  <button
                    class={`dropdown-item ${hardhatButtonColor() === 'blue' ? 'active' : ''}`}
                    onClick={() => updateNetwork('hardhat')}
                  >
                    <span class="dropdown-item-dot" style={{ background: '#fcd535' }}></span>
                    Hardhat
                  </button>
                  <button
                    class={`dropdown-item ${sepoliaButtonColor() === 'blue' ? 'active' : ''}`}
                    onClick={() => updateNetwork('sepolia')}
                  >
                    <span class="dropdown-item-dot" style={{ background: '#627eea' }}></span>
                    Sepolia
                  </button>
                  <button
                    class={`dropdown-item ${amoyButtonColor() === 'blue' ? 'active' : ''}`}
                    onClick={() => updateNetwork('amoy')}
                  >
                    <span class="dropdown-item-dot" style={{ background: '#8247e5' }}></span>
                    Amoy
                  </button>
                </div>
              )}
            </div>

            {/* Account Selector (Local Network) */}
            {isLocal() && network() !== 'null' && (
              <div class="header-dropdown">
                <button onMouseEnter={toggleDropdown2} class="header-account-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Account</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {isOpen2() && (
                  <div onMouseLeave={toggleDropdown2} class="dropdown-content">
                    <For each={accountList()}>
                      {(item: any, index) => (
                        <button
                          id={item.address}
                          tabIndex={index()}
                          class={`dropdown-item ${accountButtonAddress() === item.address ? 'active' : ''}`}
                          onClick={handleAccountButtonClick}
                        >
                          {item.name}
                        </button>
                      )}
                    </For>
                  </div>
                )}
              </div>
            )}

            {/* Wallet Connection */}
            {!isLocal() && !isMetamaskConnected() && (
              <button onClick={handleSetMetamask} class="header-connect-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M22 10H2M6 14h4"/>
                </svg>
                Connect Wallet
              </button>
            )}

            {!isLocal() && isMetamaskConnected() && (
              <div class="header-wallet-connected">
                <span class="wallet-status">
                  <span class="wallet-status-dot"></span>
                  Connected
                </span>
                <button onClick={handleMetamaskDisconnect} class="header-disconnect-btn">
                  Disconnect
                </button>
              </div>
            )}

            {/* Account & Balance */}
            <button
              onClick={() => handleAccountClick(localStorage.getItem('address') as string)}
              class="header-text-btn"
              title="Account"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Account</span>
            </button>

            <button onClick={handleOpen} class="header-text-btn" title="Balance">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <circle cx="16" cy="12" r="2"/>
              </svg>
              <span>Balance</span>
            </button>
            <AccountBalanceOf show={show()} onHide={handleClose}></AccountBalanceOf>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
