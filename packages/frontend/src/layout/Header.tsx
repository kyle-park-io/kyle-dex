import { type Component, type JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import HomeLogo from '/home.svg?url';

// css
import './Header.css';

// metamask
import MetamaskIndex from '../metamask/Metamask.index';

const Header: Component = (): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
  } else {
    throw new Error('url env error');
  }

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
      <div class="w-full h-full">
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

        <div class="w-full h-full center-flex justify-between">
          <div class="w-[30%] h-full flex justify-start">
            <a href={`${url}`} class="inline-block h-full">
              <img src={HomeLogo} alt="Home" class="h-full"></img>
            </a>
          </div>
          <div class="flex-grow text-center">
            <a href={`${url}`} class="basic">
              KYLE PARK
            </a>
          </div>
          <div class="w-[30%] h-full center-flex flex justify-end space-x-3">
            <div>
              {!isLocal() && (
                <button
                  onClick={() => {
                    updateMetamask();
                  }}
                >
                  Connect
                </button>
              )}
            </div>
            <div>
              <div>
                <button onMouseEnter={toggleDropdown}>Network</button>
                {isOpen() && (
                  <div onMouseLeave={toggleDropdown} class="dropdown-content">
                    <p>
                      <button
                        style={{ background: hardhatButtonColor() }}
                        onClick={() => {
                          updateNetwork('hardhat');
                        }}
                      >
                        Hardhat
                      </button>
                    </p>
                    <p>
                      <button
                        style={{ background: sepoliaButtonColor() }}
                        onClick={() => {
                          updateNetwork('sepolia');
                        }}
                      >
                        Sepolia
                      </button>
                    </p>
                    <p>
                      <button
                        style={{ background: mumbaiButtonColor() }}
                        onClick={() => {
                          updateNetwork('mumbai');
                        }}
                      >
                        Mumbai
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <button>Account</button>
            </div>
          </div>
        </div>
        {/* 헤더 콘텐츠 */}
      </div>
    </>
  );
};

export default Header;
