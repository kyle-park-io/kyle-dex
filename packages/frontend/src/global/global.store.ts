import { createStore } from 'solid-js/store';

// global status
export const [fromDexNavigate, setFromDexNavigate] = createStore({
  value: false,
});

export const [globalNetwork, setGlobalNetwork] = createStore({
  network: 'hardhat',
});

export const [globalAccount, setGlobalAccount] = createStore({
  address: 'null',
});
