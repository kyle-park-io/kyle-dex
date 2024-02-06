import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
// interface
import { type MetamaskIndexProps } from './interfaces/component.interfaces';
// metamask
import { MetaMaskSDK, type SDKProvider } from '@metamask/sdk';

import { globalAccount, setGlobalAccount } from '../layout/Header';

const [isProcessing, setIsProcessing] = createSignal(false);

const [metamask, setMetamask] = createSignal<MetaMaskSDK>();
const [provider, setProvider] = createSignal<SDKProvider>();

const MetamaskIndex: Component<MetamaskIndexProps> = (props): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isProd, setIsProd] = createSignal(false);
  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
    setIsProd(true);
  } else {
    throw new Error('env error');
  }
  console.log(url);

  createEffect(() => {
    if (isProd()) {
      if (
        props.network === props.currentNetwork &&
        props.network !== 'hardhat'
      ) {
        if (!isProcessing()) {
          if (props.loadMetamask) {
            void go();
          } else {
            if (props.disconnect) {
              void disconnectNetwork();
            } else {
              if (props.isConnected) {
                void changeNetwork();
              }
            }
          }
        }
      }
    }
  });

  return <></>;

  async function go(): Promise<void> {
    try {
      setIsProcessing(true);

      if (metamask() === undefined) {
        await initMetamask();
      }
      await connectNetwork();

      props.handleLoadMetamask();
      props.handleConnect();

      setIsProcessing(false);
    } catch (err) {
      if (err instanceof Error) {
        props.onError(err);
      } else {
        props.onError(new Error(String(err)));
      }
    }
  }

  async function initMetamask(): Promise<void> {
    try {
      const getInfuraUrl = (network: string): string | null => {
        switch (network) {
          case 'sepolia':
            return import.meta.env.VITE_SEPOLIA_API;
          case 'mumbai':
            return import.meta.env.VITE_MUMBAI_API;
          default:
            return null;
        }
      };
      const infuraUrl = getInfuraUrl(props.network);
      if (infuraUrl === null) {
        throw new Error('infura url error');
      }

      const MMSDK = new MetaMaskSDK({
        infuraAPIKey: infuraUrl,
        dappMetadata: {
          name: 'Kyle Dex App',
          url: window.location.origin,
        },
      });

      await MMSDK.init();
      setMetamask(MMSDK);

      const provider = metamask()?.getProvider(); // You can also access via window.ethereum
      setProvider(provider);

      startListener();
    } catch (err) {
      if (err instanceof Error) {
        props.onError(err);
      } else {
        props.onError(new Error(String(err)));
      }
    }
  }

  async function connectNetwork(): Promise<void> {
    try {
      if (provider() === undefined) {
        throw new Error('provider is undefined');
      }

      const chainId = await provider()?.request({ method: 'eth_chainId' });
      if (chainId !== props.chainId) {
        try {
          await provider()?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: props.chainId }],
          });
        } catch (err) {
          if (err instanceof Error) {
            props.onError(err);
          } else {
            if (typeof err === 'object' && err !== null && 'code' in err) {
              if (err.code === 4902) {
                await addNetwork();
              }
            } else {
              props.onError(new Error(String(err)));
            }
          }
        }
      }

      const connect = await metamask()?.connect();
      const addr = connect?.[0];
      setGlobalAccount({
        address: addr,
      });
      if (location.pathname.startsWith('/dex/account')) {
        navigate(`/dex/account/${props.network}/${globalAccount.address}`);
      }
    } catch (err) {
      if (err instanceof Error) {
        props.onError(err);
      } else {
        props.onError(new Error(String(err)));
      }
    }
  }

  async function disconnectNetwork(): Promise<void> {
    try {
      setIsProcessing(true);

      const connect = metamask()?.disconnect();
      console.log(connect);

      setGlobalAccount({
        address: 'null',
      });
      if (location.pathname.startsWith('/dex/account')) {
        navigate(`/dex/account/${props.network}/${globalAccount.address}`);
      }
      props.handleDisconnect();

      setIsProcessing(false);
    } catch (err) {
      if (err instanceof Error) {
        props.onError(err);
      } else {
        props.onError(new Error(String(err)));
      }
    }
  }

  async function changeNetwork(): Promise<void> {
    try {
      setIsProcessing(true);

      if (provider() === undefined) {
        throw new Error('provider is undefined');
      }
      await provider()?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: props.chainId }],
      });

      const connect = await metamask()?.connect();
      const addr = connect?.[0];
      setGlobalAccount({
        address: addr,
      });
      if (location.pathname.startsWith('/dex/account')) {
        navigate(`/dex/account/${props.network}/${globalAccount.address}`);
      }

      setIsProcessing(false);
    } catch (err) {
      console.error('Failed to switch network', err);
    }
  }

  async function addNetwork(): Promise<void> {
    try {
      switch (props.network) {
        case 'sepolia': {
          await provider()?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });

          break;
        }
        case 'mumbai': {
          await provider()?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Mumbai',
                nativeCurrency: {
                  name: 'Matic',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to switch network', err);
    }
  }

  function startListener(): void {
    if (provider() === undefined) {
      throw new Error('provider is undefined');
    }

    provider()?.on('accountsChanged', handleAccountsChanged);
    function handleAccountsChanged(accounts): void {
      console.log(accounts);
      // console.log('Selected account changed:', accounts[0]);
    }
  }
};

export default MetamaskIndex;
