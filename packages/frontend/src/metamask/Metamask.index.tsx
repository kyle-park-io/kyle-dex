import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
// interface
import { type MetamaskIndexProps } from './interfaces/interfaces';
// metamask
import { MetaMaskSDK } from '@metamask/sdk';

const MetamaskIndex: Component<MetamaskIndexProps> = (props): JSX.Element => {
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
    if (isProd() && props.loadMetamask) {
      if (
        props.network !== 'hardhat' &&
        props.network === props.currentNetwork
      ) {
        void fetchData();
        props.initConnectStatus();
      }
    }
  });

  return <></>;

  async function fetchData(): Promise<void> {
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

      const init = await MMSDK.init();
      console.log(init);

      const connect = await MMSDK.connect();
      console.log(connect);

      const ethereum = MMSDK.getProvider(); // You can also access via window.ethereum
      console.log(ethereum);

      // await ethereum.request({
      //   method: 'eth_requestAccounts',
      //   params: [],
      // });
    } catch (err) {
      if (err instanceof Error) {
        props.onError(err);
      } else {
        props.onError(new Error(String(err)));
      }
    }
  }
};

export default MetamaskIndex;
