import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
// interface
import { type MetamaskIndexProps } from './interfaces/component.interfaces';
// metamask
import { MetaMaskSDK, type SDKProvider } from '@metamask/sdk';
import { globalState } from '../constants/constants';

const [isProcessing, setIsProcessing] = createSignal(false);

const [metamask, setMetamask] = createSignal<MetaMaskSDK>();
const [provider, setProvider] = createSignal<SDKProvider>();

const MetamaskIndex: Component<MetamaskIndexProps> = (props): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  createEffect(() => {
    if (globalState.isOpen) {
      if (props.connectNum >= 0) {
        if (props.network === props.currentNetwork) {
          if (props.network !== 'hardhat') {
            if (!isProcessing()) {
              if (props.loadMetamask) {
                void go();
              } else {
                if (props.isConnected) {
                  if (props.disconnect) {
                    void disconnectNetwork();
                  } else if (props.change) {
                    void changeNetwork();
                  }
                }
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

      // if (metamask() === undefined) {
      // }
      await initMetamask();
      await connectNetwork();

      props.handleLoadMetamask();

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
            return import.meta.env.VITE_INFURA_SEPOLIA_API_URL;
          case 'amoy':
            return import.meta.env.VITE_INFURA_AMOY_API_URL;
          default:
            return null;
        }
      };
      const infuraUrl = getInfuraUrl(props.network);
      if (infuraUrl === null || infuraUrl === undefined) {
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

      const provider2 = metamask()?.getProvider(); // You can also access via window.ethereum
      setProvider(provider2);

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

      const accounts = await provider()?.request({
        method: 'eth_requestAccounts',
      });
      console.log(accounts);

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
            if (
              typeof err === 'object' &&
              err !== null &&
              'code' in err &&
              'message' in err
            ) {
              if (err.code === 4902) {
                await addNetwork();
                return;
              }
              if (err.code === 4001) {
                props.onError(new Error(String(err.message)));
                return;
              }
              if (err.code === -32602) {
                props.onError(new Error(String(err.message)));
                return;
              }
            } else {
              props.onError(new Error(String(err)));
            }
          }
        }
      }

      const connect = await metamask()?.connect();
      const addr = connect?.[0];
      // TODO: global status
      localStorage.setItem('isConnected', '1');
      localStorage.setItem('address', addr);
      // setGlobalAccount({
      //   address: addr,
      // });
      props.handleConnect();
      if (location.pathname.startsWith('/dex/account')) {
        // navigate(`/dex/account/${props.network}/${globalAccount.address}`);
        navigate(`/dex/account/${props.network}/${addr}`);
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

      metamask()?.terminate();

      // TODO: global status
      localStorage.setItem('address', 'null');
      localStorage.setItem('isConnected', '0');
      // setGlobalAccount({
      //   address: 'null',
      // });
      if (location.pathname.startsWith('/dex/account')) {
        // navigate(`/dex/account/${props.network}/${globalAccount.address}`);
        navigate(`/dex/account/${props.network}/null`);
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
      // TODO: global status
      localStorage.setItem('address', addr);
      // setGlobalAccount({
      //   address: addr,
      // });
      if (location.pathname.startsWith('/dex/account')) {
        // navigate(
        //   `/dex/account/${props.currentNetwork}/${globalAccount.address}`,
        // );
        navigate(`/dex/account/${props.currentNetwork}/${addr}`);
      }
      props.handleChange();

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
        case 'amoy': {
          await provider()?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13882',
                chainName: 'Amoy',
                nativeCurrency: {
                  name: 'Matic',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                blockExplorerUrls: ['https://www.oklink.com/amoy/'],
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
      const addr = accounts[0];
      // TODO: global status
      localStorage.setItem('address', addr);
      // setGlobalAccount({
      //   address: addr,
      // });
      if (location.pathname.startsWith('/dex/account')) {
        // navigate(
        //   `/dex/account/${props.currentNetwork}/${globalAccount.address}`,
        // );
        navigate(`/dex/account/${props.currentNetwork}/${addr}`);
      }
    }
  }
};

export default MetamaskIndex;
