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

  // network status
  const [network, setNetwork] = createSignal('hardhat');
  const updateNetwork = (network: string): void => {
    console.log(network);
    setNetwork(network);
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
  console.log(hardhatError);
  console.log(sepoliaError);
  console.log(mumbaiError);

  return (
    <>
      <div class="w-full h-full">
        {/* header */}
        <header class="offscreen">golang is forever !</header>
        {/* metamask */}
        <MetamaskIndex
          network="hardhat"
          currentNetwork={network()}
          onError={handleHardhatChange}
        />
        <MetamaskIndex
          network="sepolia"
          currentNetwork={network()}
          onError={handleSepoliaChange}
        />
        <MetamaskIndex
          network="mumbai"
          currentNetwork={network()}
          onError={handleMumbaiChange}
        />

        <div class="w-full h-full center-flex justify-between">
          <a href={`${url}`} class="h-full">
            <img src={HomeLogo} alt="Home" class="h-full"></img>
          </a>
          <a href={`${url}`} class="basic">
            <h1 class="text-center flex-grow">KYLE PARK</h1>
          </a>
          <div class="w-[15%]">
            <div class="w-full">
              <button onMouseEnter={toggleDropdown}>Network</button>
              {isOpen() && (
                <div onMouseLeave={toggleDropdown} class="dropdown-content">
                  <p>
                    <button
                      onClick={() => {
                        updateNetwork('hardhat');
                      }}
                    >
                      Hardhat
                    </button>
                  </p>
                  <p>
                    <button
                      onClick={() => {
                        updateNetwork('sepolia');
                      }}
                    >
                      Sepolia
                    </button>
                  </p>
                  <p>
                    <button
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
          {/* 헤더 콘텐츠 */}
        </div>
      </div>
    </>
  );
};

export default Header;
