import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount, For } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { Container, Row, Col, Nav } from 'solid-bootstrap';
import HomeLogo from '/home.svg?url';
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

import { globalState } from '../global/constants';

const Header: Component = (): JSX.Element => {
  const apiUrl = globalState.api_url;

  const location = useLocation();
  // navigate
  const navigate = useNavigate();
  const handleTitleClick = (): void => {
    navigate('/dex');
  };
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
    setFromHeaderNavigate({ value: true });
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
      if (location.pathname.startsWith('/dex/staking')) {
        navigate('/dex/staking');
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({ value: true });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart');
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
        if (location.pathname.startsWith('/dex/staking')) {
          setFromHeaderNavigate({ value: true });
          navigate('/dex/staking/hardhat');
        }
        if (location.pathname.startsWith('/dex/chart')) {
          setFromHeaderNavigate({ value: true });
          setFromHeaderNavigate2({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/chart/hardhat');
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
        if (location.pathname.startsWith('/dex/staking')) {
          setFromHeaderNavigate({ value: true });
          navigate('/dex/staking/sepolia');
        }
        if (location.pathname.startsWith('/dex/chart')) {
          setFromHeaderNavigate({ value: true });
          setFromHeaderNavigate2({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/chart/sepolia');
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
        if (location.pathname.startsWith('/dex/staking')) {
          setFromHeaderNavigate({ value: true });
          navigate('/dex/staking/amoy');
        }
        if (location.pathname.startsWith('/dex/chart')) {
          setFromHeaderNavigate({ value: true });
          setFromHeaderNavigate2({
            value: true,
            type: HeaderNavigateType.network,
          });
          navigate('/dex/chart/amoy');
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
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({ value: true });
        navigate('/dex/staking/hardhat');
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({ value: true });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart/hardhat');
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
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({ value: true });
        navigate('/dex/staking/sepolia');
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({ value: true });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart/sepolia');
      }
    } else {
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
      if (location.pathname.startsWith('/dex/staking')) {
        setFromHeaderNavigate({ value: true });
        navigate('/dex/staking/amoy');
      }
      if (location.pathname.startsWith('/dex/chart')) {
        setFromHeaderNavigate({ value: true });
        setFromHeaderNavigate2({
          value: true,
          type: HeaderNavigateType.network,
        });
        navigate('/dex/chart/amoy');
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
        if (location.pathname.startsWith('/dex/staking')) {
          navigate('/dex/staking');
        }
        if (location.pathname.startsWith('/dex/chart')) {
          navigate('/dex/chart');
        }
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

  const [accountList, setAccountList] = createSignal([]);
  onMount(() => {
    async function fetchData(): Promise<void> {
      const res = await getClientList(apiUrl, {});
      setAccountList(res);
    }
    void fetchData();
  });

  return (
    <>
      <div>
        {/* header */}
        <header class="offscreen">golang is forever !</header>
        {/* metamask */}
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

        <Container fluid>
          <Row class="tw-items-center">
            <Col lg={4} md={4} sm={4} xs={4} class="tw-flex tw-justify-start">
              <button onClick={handleImageClick} class="transparent tw-h-10">
                <img src={HomeLogo} alt="Home" class="tw-h-full"></img>
              </button>
              <button onClick={handleHomeClick} class="transparent">
                <span>Go Basic Home</span>
              </button>
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} class="tw-flex tw-justify-center">
              <button onClick={handleTitleClick} class="transparent">
                <span>KYLE DEX</span>
              </button>
            </Col>
            <Col lg={4} md={4} sm={4} xs={4} class="tw-flex tw-justify-end">
              <Nav defaultActiveKey="#" as="ul" class="tw-flex-nowrap">
                <Nav.Item as="li">
                  <Nav.Link eventKey="connect">
                    {!isLocal() && !isMetamaskConnected() ? (
                      <button
                        onClick={() => {
                          handleSetMetamask();
                        }}
                      >
                        <span class="tw-text-black">Connect</span>
                      </button>
                    ) : (
                      <></>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="connect">
                    {!isLocal() && isMetamaskConnected() ? (
                      <button>
                        <span class="tw-text-black">isConnected</span>
                      </button>
                    ) : (
                      <></>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="connect">
                    {!isLocal() && isMetamaskConnected() ? (
                      <button
                        onClick={() => {
                          handleMetamaskDisconnect();
                        }}
                      >
                        <span class="tw-text-black">Disconnect</span>
                      </button>
                    ) : (
                      <></>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="network">
                    <div>
                      <button onMouseEnter={toggleDropdown}>Network</button>
                      {isOpen() && (
                        <div
                          onMouseLeave={toggleDropdown}
                          class="dropdown-content"
                        >
                          <p>
                            <button
                              style={{ background: hardhatButtonColor() }}
                              onClick={() => {
                                updateNetwork('hardhat');
                              }}
                            >
                              <span class="tw-text-black">Hardhat</span>
                            </button>
                          </p>
                          <p>
                            <button
                              style={{ background: sepoliaButtonColor() }}
                              onClick={() => {
                                updateNetwork('sepolia');
                              }}
                            >
                              <span class="tw-text-black">Sepolia</span>
                            </button>
                          </p>
                          <p>
                            <button
                              style={{ background: amoyButtonColor() }}
                              onClick={() => {
                                updateNetwork('amoy');
                              }}
                            >
                              <span class="tw-text-black">Amoy</span>
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="account">
                    {isLocal() && network() !== 'null' && (
                      <>
                        <button onMouseEnter={toggleDropdown2}>Account</button>
                        {isOpen2() && (
                          <div
                            onMouseLeave={toggleDropdown2}
                            class="dropdown-content"
                          >
                            <For each={accountList()}>
                              {(item: any, index) => (
                                <p>
                                  <button
                                    id={item.address}
                                    tabIndex={index()}
                                    style={{
                                      background:
                                        accountButtonAddress() === item.address
                                          ? 'blue'
                                          : 'white',
                                    }}
                                    onClick={handleAccountButtonClick}
                                  >
                                    <span class="tw-text-black">
                                      {item.name}
                                    </span>
                                  </button>
                                </p>
                              )}
                            </For>
                          </div>
                        )}
                      </>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="account"
                    onClick={() =>
                      handleAccountClick(
                        localStorage.getItem('address') as string,
                      )
                    }
                  >
                    <span class="tw-text-black">Account</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
        </Container>
        {/* 헤더 콘텐츠 */}
      </div>
    </>
  );
};

export default Header;
