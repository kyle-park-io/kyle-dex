import { createStore } from 'solid-js/store';

const isProd = process.env.NODE_ENV === 'development' ? false : true;

const [globalState] = createStore({
  url: isProd ? 'https://jungho.dev' : 'http://localhost:5173',
  api_url: 'https://jungho.dev/api-dex/api',
  isProd,
  isOpen: true,
  hardhat_admin_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  hardhat_weth_address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
});

export { globalState };
