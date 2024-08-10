import { createStore } from 'solid-js/store';

// global status
export const [fromDexNavigate, setFromDexNavigate] = createStore({
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

export const [fromAppNavigate, setFromAppNavigate] = createStore({
  value: false,
});
