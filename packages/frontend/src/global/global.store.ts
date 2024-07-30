import { createStore } from 'solid-js/store';

// global status
export const [fromDexNavigate, setFromDexNavigate] = createStore({
  value: false,
});

export const [fromHeaderNavigate, setFromHeaderNavigate] = createStore({
  value: false,
});

export const [fromAppNavigate, setFromAppNavigate] = createStore({
  value: false,
});
