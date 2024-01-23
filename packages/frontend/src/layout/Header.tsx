import { type Component, type JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Container, Row, Col, Nav } from 'solid-bootstrap';
import HomeLogo from '/home.svg?url';

// css
import './Header.css';

// metamask
import MetamaskIndex from '../metamask/Metamask.index';

const Header: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const handleTitleClick = (): void => {
    navigate('/dex');
  };
  const handleImageClick = (): void => {
    navigate('/dex');
  };
  const handleConnectClick = (): void => {};
  const handleNetworkClick = (): void => {};
  const handleAccountClick = (): void => {};

  const [isOpen, setIsOpen] = createSignal(false);
  const toggleDropdown = (): boolean => setIsOpen(!isOpen());

  // button color
  const [hardhatButtonColor, setHardhatButtonColor] = createSignal('blue');
  const [sepoliaButtonColor, setSepoliaButtonColor] = createSignal('white');
  const [mumbaiButtonColor, setMumbaiButtonColor] = createSignal('white');

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
            </Col>
            <Col md={4} class="tw-flex tw-justify-center">
              <button onClick={handleTitleClick} class="transparent">
                <span>KYLE DEX</span>
              </button>
            </Col>
            <Col md={4} class="tw-flex tw-justify-end">
              <Nav defaultActiveKey="#" as="ul">
                <Nav.Item as="li">
                  <Nav.Link eventKey="connect" onClick={handleConnectClick}>
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
                  <Nav.Link eventKey="network" onClick={handleNetworkClick}>
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
