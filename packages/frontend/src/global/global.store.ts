import { createStore } from 'solid-js/store';

// global status
export const [fromDexNavigate, setFromDexNavigate] = createStore({
  value: false,
});
export const [fromDexNavigate2, setFromDexNavigate2] = createStore({
  value: false,
});

export enum HeaderNavigateType {
  'network' = 'network',
  'address' = 'address',
}
export const [fromHeaderNavigate, setFromHeaderNavigate] = createStore({
  value: false,
  type: '',
});
export const [fromHeaderNavigate2, setFromHeaderNavigate2] = createStore({
  value: false,
  type: '',
});

export const [fromChartListNavigate, setFromChartListNavigate] = createStore({
  value: false,
  // chart: '',
});

export const [fromPairNavigate, setFromPairNavigate] = createStore({
  value: false,
  // pair: '',
});
export const [fromPairNavigate2, setFromPairNavigate2] = createStore({
  value: false,
  // pair: '',
});

export const [fromAppNavigate, setFromAppNavigate] = createStore({
  value: false,
});
export const [fromAppNavigate2, setFromAppNavigate2] = createStore({
  value: false,
});
