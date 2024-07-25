import { createStore } from 'solid-js/store';

// false : true
const isProd = process.env.NODE_ENV === 'development' ? false : true;

const [globalState, setGlobalState] = createStore({
  url: isProd ? 'https://jungho.dev' : 'http://localhost:5173',
  api_url: 'https://jungho.dev/api-dex/api',
  isProd,
  isOpen: true,
  hardhat_admin_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
});

export { globalState, setGlobalState };
