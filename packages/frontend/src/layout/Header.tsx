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

export const [globalAccount, setGlobalAccount] = createStore({ address: '' });

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
    navigate(`/dex/account/${network()}/${accountButtonAddress()}`);
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

  const [accountButtonId, setAccountButtonId] = createSignal(null);
  const [accountButtonAddress, setAccountButtonAddress] = createSignal(null);
  const handleAccountButtonClick = (event): void => {
    const id = event.currentTarget.getAttribute('tabIndex');
    setAccountButtonId(id);
    console.log(accountButtonId());
    const address = event.currentTarget.getAttribute('id');
    setAccountButtonAddress(address);
    setGlobalAccount({ address });
    if (location.pathname.startsWith('/dex/account')) {
      handleAccountClick();
    }
  };

  // network status
  const [isLocal, setIsLocal] = createSignal(true);
  const [network, setNetwork] = createSignal('hardhat');
  const [metamask, setMetamask] = createSignal(false);
  const updateNetwork = (network: string): void => {
    setNetwork(network);
    if (network === 'hardhat') {
      setIsLocal(true);
      setHardhatButtonColor('blue');
      setSepoliaButtonColor('white');
      setMumbaiButtonColor('white');
    } else if (network === 'sepolia') {
      setIsLocal(false);
      setHardhatButtonColor('white');
      setSepoliaButtonColor('blue');
      setMumbaiButtonColor('white');
    } else {
      setIsLocal(false);
      setHardhatButtonColor('white');
      setSepoliaButtonColor('white');
      setMumbaiButtonColor('blue');
    }
  };

  const updateMetamask = (): void => {
    setMetamask(true);
  };

  // error
  const [hardhatError, setHardhatError] = createSignal<Error | null>(null);
  const [sepoliaError, setSepoliaError] = createSignal<Error | null>(null);
  const [mumbaiError, setMumbaiError] = createSignal<Error | null>(null);
  // props
  const handleHardhatChange = (err): void => {
    setHardhatError(err);
  };
  const handleSepoliaChange = (err): void => {
    setSepoliaError(err);
  };
  const handleMumbaiChange = (err): void => {
    setMumbaiError(err);
  };
  // metamask connect status
  const handleInitConnectStatus = (): void => {
    setMetamask(false);
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
          network="hardhat"
          loadMetamask={metamask()}
          initConnectStatus={handleInitConnectStatus}
          currentNetwork={network()}
          onError={handleHardhatChange}
        />
        <MetamaskIndex
          network="sepolia"
          loadMetamask={metamask()}
          initConnectStatus={handleInitConnectStatus}
          currentNetwork={network()}
          onError={handleSepoliaChange}
        />
        <MetamaskIndex
          network="mumbai"
          loadMetamask={metamask()}
          initConnectStatus={handleInitConnectStatus}
          currentNetwork={network()}
          onError={handleMumbaiChange}
        />

        <Container fluid>
          <Row class="tw-items-center">
            <Col md={4} class="tw-flex tw-justify-start">
              <button onClick={handleImageClick} class="transparent tw-h-10">
                <img src={HomeLogo} alt="Home" class="tw-h-full"></img>
              </button>
              <button onClick={handleHomeClick} class="transparent">
                <span>Go Basic Home</span>
              </button>
            </Col>
            <Col md={4} class="tw-flex tw-justify-center">
              <button onClick={handleTitleClick} class="transparent">
                <span>KYLE DEX</span>
              </button>
            </Col>
            <Col md={4} class="tw-flex tw-justify-end">
              <Nav defaultActiveKey="#" as="ul">
                <Nav.Item as="li">
                  <Nav.Link eventKey="connect">
                    {!isLocal() && (
                      <button
                        onClick={() => {
                          updateMetamask();
                        }}
                      >
                        <span class="tw-text-black">Connect</span>
                      </button>
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
