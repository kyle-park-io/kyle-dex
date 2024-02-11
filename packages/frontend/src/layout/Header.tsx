import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, For } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate, useLocation } from '@solidjs/router';
import { Container, Row, Col, Nav } from 'solid-bootstrap';
import HomeLogo from '/home.svg?url';
import { getClientList } from '../account/Account.axios';

// css
import './Header.css';

// metamask
import MetamaskIndex from '../metamask/Metamask.index';

// global status
export const [globalAccount, setGlobalAccount] = createStore({
  address: 'null',
});

const Header: Component = (): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let url;
  let apiUrl;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
    apiUrl = import.meta.env.VITE_DEV_API_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
    apiUrl = import.meta.env.VITE_PROD_API_URL;
  } else {
    throw new Error('env error');
  }

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
    window.location.href = `${url}`;
  };
  const handleAccountClick = (): void => {
    navigate(`/dex/account/${network()}/${globalAccount.address}`);
  };

  // toggle
  const [isOpen, setIsOpen] = createSignal(false);
  const toggleDropdown = (): boolean => setIsOpen(!isOpen());
  const [isOpen2, setIsOpen2] = createSignal(false);
  const toggleDropdown2 = (): boolean => setIsOpen2(!isOpen2());

  // button color
  const [hardhatButtonColor, setHardhatButtonColor] = createSignal('blue');
  const [sepoliaButtonColor, setSepoliaButtonColor] = createSignal('white');
  const [mumbaiButtonColor, setMumbaiButtonColor] = createSignal('white');

  // account
  const [accountButtonId, setAccountButtonId] = createSignal(null);
  const [accountButtonAddress, setAccountButtonAddress] = createSignal('null');
  const handleAccountButtonClick = (event): void => {
    const id = event.currentTarget.getAttribute('tabIndex');
    setAccountButtonId(id);
    console.log(accountButtonId());
    const address = event.currentTarget.getAttribute('id');
    if (globalAccount.address !== address) {
      setAccountButtonAddress(address);
      setGlobalAccount({ address });
    } else {
      setAccountButtonAddress('null');
      setGlobalAccount({ address: 'null' });
    }
    if (location.pathname.startsWith('/dex/account')) {
      handleAccountClick();
    }
  };

  // network status
  const [isLocal, setIsLocal] = createSignal(true);
  const [network, setNetwork] = createSignal('hardhat');
  const [loadMetamask, setLoadMetamask] = createSignal(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = createSignal(false);
  const [metamaskDisconnect, setMetamaskDisconnect] = createSignal(false);
  const [metamaskChange, setMetamaskChange] = createSignal(false);

  const updateNetwork = (networkKey: string): void => {
    if (network() === networkKey) {
      setIsLocal(true);
      setHardhatButtonColor('white');
      setSepoliaButtonColor('white');
      setMumbaiButtonColor('white');
      setNetwork('null');
      setAccountButtonAddress('null');
      setGlobalAccount({ address: 'null' });
      if (location.pathname.startsWith('/dex/account')) {
        handleAccountClick();
      }
    } else {
      if (networkKey === 'hardhat') {
        setIsLocal(true);
        setHardhatButtonColor('blue');
        setSepoliaButtonColor('white');
        setMumbaiButtonColor('white');
        setAccountButtonAddress('null');
        setGlobalAccount({ address: 'null' });
        setNetwork(networkKey);
        if (location.pathname.startsWith('/dex/account')) {
          handleAccountClick();
        }
      } else if (networkKey === 'sepolia') {
        setIsLocal(false);
        setHardhatButtonColor('white');
        setSepoliaButtonColor('blue');
        setMumbaiButtonColor('white');
        setAccountButtonAddress('null');
        if (!isMetamaskConnected() && network() === 'hardhat') {
          setGlobalAccount({ address: 'null' });
        }
        setNetwork(networkKey);
        if (isMetamaskConnected()) {
          setMetamaskChange(true);
        }
        if (location.pathname.startsWith('/dex/account')) {
          handleAccountClick();
        }
      } else {
        setIsLocal(false);
        setHardhatButtonColor('white');
        setSepoliaButtonColor('white');
        setMumbaiButtonColor('blue');
        setAccountButtonAddress('null');
        if (!isMetamaskConnected() && network() === 'hardhat') {
          setGlobalAccount({ address: 'null' });
        }
        setNetwork(networkKey);
        if (isMetamaskConnected()) {
          setMetamaskChange(true);
        }
        setNetwork(networkKey);
        if (location.pathname.startsWith('/dex/account')) {
          handleAccountClick();
        }
      }
    }
  };

  // metamask
  const handleSetMetamask = (): void => {
    setLoadMetamask(true);
    if (location.pathname.startsWith('/dex/account')) {
      handleAccountClick();
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
    setGlobalAccount({ address: 'null' });
    if (location.pathname.startsWith('/dex/account')) {
      handleAccountClick();
    }
  };
  const propsHandleMetamaskChange = (): void => {
    setMetamaskChange(false);
  };

  // error
  const [hardhatError, setHardhatError] = createSignal<Error | null>(null);
  const [sepoliaError, setSepoliaError] = createSignal<Error | null>(null);
  const [mumbaiError, setMumbaiError] = createSignal<Error | null>(null);
  // props
  const propsHandleHardhatChange = (err): void => {
    setHardhatError(err);
  };
  const propsHandleSepoliaChange = (err): void => {
    setSepoliaError(err);
  };
  const propsHandleMumbaiChange = (err): void => {
    setMumbaiError(err);
  };

  console.log(hardhatError());
  console.log(sepoliaError());
  console.log(mumbaiError());

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
          chainId="0x13881"
          network="mumbai"
          currentNetwork={network()}
          loadMetamask={loadMetamask()}
          handleLoadMetamask={propsHandleLoadMetamask}
          isConnected={isMetamaskConnected()}
          handleConnect={propsHandleMetamaskConnect}
          disconnect={metamaskDisconnect()}
          handleDisconnect={propsHandleMetamaskDisconnect}
          change={metamaskChange()}
          handleChange={propsHandleMetamaskChange}
          onError={propsHandleMumbaiChange}
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
              <Nav defaultActiveKey="#" as="ul">
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
                              style={{ background: mumbaiButtonColor() }}
                              onClick={() => {
                                updateNetwork('mumbai');
                              }}
                            >
                              <span class="tw-text-black">Mumbai</span>
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="account">
                    {isLocal() && (
                      <div>
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
                      </div>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="account" onClick={handleAccountClick}>
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
