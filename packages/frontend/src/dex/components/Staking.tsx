import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { Form } from 'solid-bootstrap';
import {
  fromDexNavigate,
  setFromDexNavigate,
  fromAppNavigate,
  setFromAppNavigate,
  HeaderNavigateType,
  fromHeaderNavigate,
  setFromHeaderNavigate,
} from '../../global/global.store';
import { getPairList, getPairCurrentReserve } from '../axios/Dex.axios.pair';
import {
  getWETH,
  getTokenContractList,
  getRouter,
} from '../axios/Dex.axios.token';
import { submit, submitWithETH } from '../axios/Dex.axios.submit';
import {
  getFactory,
  calcPair,
  estimateLiquidity,
} from '../axios/Dex.axios.utils';
import { globalState } from '../../global/constants';
import axios from 'axios';
import { ethers } from 'ethers';

import './Staking.css';

const notExisted = 'No tokens exist on this network';

const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);
const [isError, setIsError] = createSignal(false);
const [apiErr, setApiErr] = createSignal('');
const [isResult, setIsResult] = createSignal(false);
const [goChart, setGoChart] = createSignal(false);
const [result, setResult] = createSignal('');

const [pairs, setPairs] = createSignal<any[]>([]);
const [tokens, setTokens] = createSignal<any[]>([]);

export const Staking: Component = (): JSX.Element => {
  const api = globalState.api_url;

  // loading
  const [loading, setLoading] = createSignal(false);
  const [reserveLoading, setReserveLoading] = createSignal(false);
  const [calcLoading, setCalcLoading] = createSignal(false);
  const [isCalculating, setIsCalculating] = createSignal(false);
  const [resultLoading, setResultLoading] = createSignal(false);

  // reserve
  const [isReserve, setIsReserve] = createSignal(false);
  const [getReserve, setGetReserve] = createSignal(false);
  const [reserve, setReserve] = createSignal<any>();

  // handle token, pair
  const [selectedTokenA, setSelectedTokenA] = createSignal('');
  const [selectedTokenB, setSelectedTokenB] = createSignal('');
  const [selectedPair, setSelectedPair] = createSignal('');
  const handleTokenAChange = (e): void => {
    if (e.target.value === selectedTokenB()) {
      setSelectedTokenB(selectedTokenA());
      setSelectedTokenA(e.target.value);
      setReserve({
        reserve0: reserve().reserve1,
        reserve1: reserve().reserve0,
      });
    } else {
      setSelectedTokenA(e.target.value);
      setSelectedPair('');
      setGetReserve(true);
    }
    setTokenALiquidity('');
    setAMsg('Enter the value!');
    setTokenBLiquidity('');
    setBMsg('Enter the value!');
    setTokenACalculatedLiquidity('');
    setACalculatedLiquidity('');
    setTokenBCalculatedLiquidity('');
    setBCalculatedLiquidity('');
    setResultLoading(false);
  };
  const handleTokenBChange = (e): void => {
    if (e.target.value === selectedTokenA()) {
      setSelectedTokenA(selectedTokenB());
      setSelectedTokenB(e.target.value);
      setReserve({
        reserve0: reserve().reserve1,
        reserve1: reserve().reserve0,
      });
    } else {
      setSelectedTokenB(e.target.value);
      setSelectedPair('');
      setGetReserve(true);
    }
    setTokenALiquidity('');
    setAMsg('Enter the value!');
    setTokenBLiquidity('');
    setBMsg('Enter the value!');
    setTokenACalculatedLiquidity('');
    setACalculatedLiquidity('');
    setTokenBCalculatedLiquidity('');
    setBCalculatedLiquidity('');
    setResultLoading(false);
  };
  const handlePairChange = (e): void => {
    for (let i = 0; i < pairs().length; i++) {
      if (pairs()[i].pair === e.target.value) {
        setSelectedTokenA(pairs()[i].tokenA);
        setSelectedTokenB(pairs()[i].tokenB);
        break;
      }
    }
    setSelectedPair(e.target.value);
    setGetReserve(true);
    setTokenALiquidity('');
    setAMsg('Enter the value!');
    setTokenBLiquidity('');
    setBMsg('Enter the value!');
    setTokenACalculatedLiquidity('');
    setACalculatedLiquidity('');
    setTokenBCalculatedLiquidity('');
    setBCalculatedLiquidity('');
    setResultLoading(false);
  };

  // handle method
  const [method, setMethod] = createSignal('t');
  const handleChangeT = async (event): Promise<void> => {
    setMethod(event.target.value);
    const t = await getTokenContractList(api, {
      network: localStorage.getItem('network') as string,
    });
    const w = await getWETH(api, {
      network: localStorage.getItem('network') as string,
    });
    if (t.length === 0) {
      setTokens([{ address: notExisted }]);
      setSelectedTokenA(notExisted);
      setSelectedTokenB(notExisted);

      setSelectedPair(notExisted);
    } else {
      setTokens([...t, { name: 'WETH', address: w }]);
      setSelectedTokenA(t[0].address);
      setSelectedTokenB(t[1].address);

      setSelectedPair('');
    }
    setGetReserve(true);
    setTokenALiquidity('');
    setAMsg('Enter the value!');
    setTokenBLiquidity('');
    setBMsg('Enter the value!');
    setTokenACalculatedLiquidity('');
    setACalculatedLiquidity('');
    setTokenBCalculatedLiquidity('');
    setBCalculatedLiquidity('');
    setResultLoading(false);
  };
  const handleChangeP = async (event): Promise<void> => {
    try {
      setMethod(event.target.value);
      const data = await getPairList(api, {
        network: localStorage.getItem('network') as string,
      });
      const set: any[] = [];
      for (let i = 0; i < data.length; i++) {
        set.push({
          pair: data[i].eventData.pair,
          tokenA: data[i].eventData.token0,
          tokenB: data[i].eventData.token1,
        });
      }
      setPairs(set);
      setSelectedPair(set[0].pair);
      setSelectedTokenA(set[0].tokenA);
      setSelectedTokenB(set[0].tokenB);
      setGetReserve(true);
      setTokenALiquidity('');
      setAMsg('Enter the value!');
      setTokenBLiquidity('');
      setBMsg('Enter the value!');
      setTokenACalculatedLiquidity('');
      setACalculatedLiquidity('');
      setTokenBCalculatedLiquidity('');
      setBCalculatedLiquidity('');
      setResultLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setPairs([{ pair: notExisted }]);
          setSelectedPair(notExisted);
          setSelectedTokenA(notExisted);
          setSelectedTokenB(notExisted);
          setTokenALiquidity('');
          setAMsg('Enter the value!');
          setTokenBLiquidity('');
          setBMsg('Enter the value!');
          setTokenACalculatedLiquidity('');
          setACalculatedLiquidity('');
          setTokenBCalculatedLiquidity('');
          setBCalculatedLiquidity('');
          setResultLoading(false);
        }
      }
    }
  };

  // estimate liquidity
  const [tokenALiquidity, setTokenALiquidity] = createSignal('');
  const [aMsg, setAMsg] = createSignal('Enter the value!');
  const [aBool, setABool] = createSignal(false);
  const [tokenBLiquidity, setTokenBLiquidity] = createSignal('');
  const [bMsg, setBMsg] = createSignal('Enter the value!');
  const [bBool, setBBool] = createSignal(false);

  let A_BOOL = true;
  let B_BOOL = true;
  let currentAbortController = new AbortController();
  let currentAbortController2 = new AbortController();
  const handleTokenALiquidityChange = async (e): Promise<void> => {
    setResultLoading(false);

    const id = e.target.id;
    const value = e.target.value;

    A_BOOL = false;
    currentAbortController.abort();
    currentAbortController = new AbortController();
    try {
      const result = await performLiquidityTask(
        id,
        value,
        currentAbortController.signal,
      );
      if (result as boolean) {
        A_BOOL = true;
        await calculate();
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Previous handleInputChange call aborted');
        } else {
          throw err;
        }
      }
    }
  };
  const handleTokenBLiquidityChange = async (e): Promise<void> => {
    setResultLoading(false);

    const id = e.target.id;
    const value = e.target.value;

    B_BOOL = false;
    currentAbortController2.abort();
    currentAbortController2 = new AbortController();
    try {
      const result = await performLiquidityTask(
        id,
        value,
        currentAbortController2.signal,
      );
      if (result as boolean) {
        B_BOOL = true;
        await calculate();
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Previous handleInputChange call aborted');
        } else {
          throw err;
        }
      }
    }
  };
  const performLiquidityTask = async (
    id: string,
    value: string,
    signal,
  ): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        switch (id) {
          case 'aLiquidity': {
            setAValue(value);
            break;
          }
          case 'bLiquidity': {
            setBValue(value);
            break;
          }
        }
        resolve(true);
      }, 3000);

      // cancel
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  };
  const setAValue = (value: string): void => {
    let bool2 = false;
    if (value === '') {
      setAMsg('Enter the value!');
      setABool(false);
    } else if (/^-?[0-9]+$/.test(value)) {
      if (value === '0' || value.startsWith('-')) {
        setAMsg('Enter a value greater than 0!');
        setABool(false);
      } else {
        setAMsg("Let's calculate!");
        bool2 = true;
        setABool(true);
      }
    } else {
      setAMsg('Invalid number format');
      setABool(false);
    }
    if (bool2) {
      setTokenALiquidity(value);
    }
  };
  const setBValue = (value: string): void => {
    let bool2 = false;
    if (value === '') {
      setBMsg('Enter the value!');
      setBBool(false);
    } else if (/^-?[0-9]+$/.test(value)) {
      if (value === '0' || value.startsWith('-')) {
        setBMsg('Enter a value greater than 0!');
        setBBool(false);
      } else {
        setBMsg("Let's calculate!");
        bool2 = true;
        setBBool(true);
      }
    } else {
      setBMsg('Invalid number format');
      setBBool(false);
    }
    if (bool2) {
      setTokenBLiquidity(value);
    }
  };

  const [tokenBCalculatedLiquidity, setTokenBCalculatedLiquidity] =
    createSignal('');
  const [bCalculatedLiquidity, setBCalculatedLiquidity] = createSignal('');
  const [tokenACalculatedLiquidity, setTokenACalculatedLiquidity] =
    createSignal('');
  const [aCalculatedLiquidity, setACalculatedLiquidity] = createSignal('');

  const calculate = async (): Promise<void> => {
    if (!A_BOOL || !B_BOOL) {
      setResultLoading(true);
      return;
    }

    setIsCalculating(true);
    const pair = selectedPair();
    let token0;
    let token1;
    let amount0;
    let amount1;
    let bool0 = false;
    let bool1 = false;
    if (selectedTokenA().toLowerCase() < selectedTokenB().toLowerCase()) {
      token0 = selectedTokenA();
      token1 = selectedTokenB();
      amount0 = tokenALiquidity();
      amount1 = tokenBLiquidity();
      if (aBool()) bool0 = true;
      if (bBool()) bool1 = true;
    } else {
      token0 = selectedTokenB();
      token1 = selectedTokenA();
      amount0 = tokenBLiquidity();
      amount1 = tokenALiquidity();
      if (bBool()) bool0 = true;
      if (aBool()) bool1 = true;
    }

    if (bool0 && bool1) {
      const r = await estimateLiquidity(api, {
        network: localStorage.getItem('network') as string,
        pair,
        tokenA: token0,
        amountA: amount0,
        tokenB: token1,
        amountB: amount1,
      });

      if (selectedTokenA().toLowerCase() < selectedTokenB().toLowerCase()) {
        setTokenBCalculatedLiquidity(r.calc1.expected1);
        setBCalculatedLiquidity(r.calc1.liquidity);
        setTokenACalculatedLiquidity(r.calc0.expected0);
        setACalculatedLiquidity(r.calc0.liquidity);
      } else {
        setTokenBCalculatedLiquidity(r.calc0.expected0);
        setBCalculatedLiquidity(r.calc0.liquidity);
        setTokenACalculatedLiquidity(r.calc1.expected1);
        setACalculatedLiquidity(r.calc1.liquidity);
      }
      setIsCalculating(false);
      setResultLoading(true);
      return;
    }
    if (bool0) {
      const r = await estimateLiquidity(api, {
        network: localStorage.getItem('network') as string,
        pair,
        tokenA: token0,
        amountA: amount0,
      });

      if (selectedTokenA().toLowerCase() < selectedTokenB().toLowerCase()) {
        setTokenBCalculatedLiquidity(r.calc1.expected1);
        setBCalculatedLiquidity(r.calc1.liquidity);
        setTokenACalculatedLiquidity('');
        setACalculatedLiquidity('');
      } else {
        setTokenACalculatedLiquidity(r.calc1.expected1);
        setACalculatedLiquidity(r.calc1.liquidity);
        setTokenBCalculatedLiquidity('');
        setBCalculatedLiquidity('');
      }
      setIsCalculating(false);
      setResultLoading(true);
      return;
    }
    if (bool1) {
      const r = await estimateLiquidity(api, {
        network: localStorage.getItem('network') as string,
        pair,
        tokenB: token1,
        amountB: amount1,
      });

      if (selectedTokenA().toLowerCase() < selectedTokenB().toLowerCase()) {
        setTokenACalculatedLiquidity(r.calc0.expected0);
        setACalculatedLiquidity(r.calc0.liquidity);
        setTokenBCalculatedLiquidity('');
        setBCalculatedLiquidity('');
      } else {
        setTokenBCalculatedLiquidity(r.calc0.expected0);
        setBCalculatedLiquidity(r.calc0.liquidity);
        setTokenACalculatedLiquidity('');
        setACalculatedLiquidity('');
      }
      setIsCalculating(false);
      setResultLoading(true);
      return;
    }
    setTokenACalculatedLiquidity('');
    setACalculatedLiquidity('');
    setTokenBCalculatedLiquidity('');
    setBCalculatedLiquidity('');
    setIsCalculating(false);
    setResultLoading(true);
  };

  // add liquidity
  const [tokenALiquidityR, setTokenALiquidityR] = createSignal('');
  const [aMsgR, setAMsgR] = createSignal('Enter the value!');
  const [aBoolR, setABoolR] = createSignal(false);
  const [tokenBLiquidityR, setTokenBLiquidityR] = createSignal('');
  const [bMsgR, setBMsgR] = createSignal('Enter the value!');
  const [bBoolR, setBBoolR] = createSignal(false);
  const [resultMsg, setResultMsg] = createSignal('');

  const handleTokenLiquidityRChange = (e): void => {
    setLModal(false);
    setIsResult(false);
    setResult('');

    const id = e.target.id;
    const value = e.target.value;

    switch (id) {
      case 'aLiquidityR': {
        setAValueR(value);
        break;
      }
      case 'bLiquidityR': {
        setBValueR(value);
        break;
      }
    }
  };
  const setAValueR = (value: string): void => {
    if (value === '') {
      setAMsgR('Enter the value!');
      setABoolR(false);
    } else if (/^-?[0-9]+$/.test(value)) {
      if (value === '0' || value.startsWith('-')) {
        setAMsgR('Enter a value greater than 0!');
        setABoolR(false);
      } else {
        setAMsgR("Let's inject!");
        setTokenALiquidityR(value);
        setABoolR(true);
      }
    } else {
      setAMsgR('Invalid number format');
      setABoolR(false);
    }
  };
  const setBValueR = (value: string): void => {
    if (value === '') {
      setBMsgR('Enter the value!');
      setBBoolR(false);
    } else if (/^-?[0-9]+$/.test(value)) {
      if (value === '0' || value.startsWith('-')) {
        setBMsgR('Enter a value greater than 0!');
        setBBoolR(false);
      } else {
        setBMsgR("Let's inject!");
        setTokenBLiquidityR(value);
        setBBoolR(true);
      }
    } else {
      setBMsgR('Invalid number format');
      setBBoolR(false);
    }
  };
  const [lmodal, setLModal] = createSignal(false);
  const handleSubmit = (): void => {
    if (aBoolR() && bBoolR()) {
      setResultMsg('');
      setLModal(true);
    } else {
      setResultMsg('Check input!');
    }
  };
  const handleCancel = (): void => {
    if (isResult()) {
      window.location.reload();
    } else {
      setLModal(false);
      setIsResult(false);
      setResult('');
    }
  };
  const handleGoChart = (): void => {
    const network = localStorage.getItem('network') as string;
    window.location.href = `${globalState.url}/dex/chart/${network}`;
  };
  const handleSubmitR = async (): Promise<void> => {
    try {
      setIsResult(false);
      setResult('');
      setGoChart(false);

      // submit
      const network = localStorage.getItem('network') as string;
      const address = localStorage.getItem('address') as string;
      const router = await getRouter(api, { network });
      const maxApproval = ethers.MaxUint256.toString();

      if (selectedTokenA() === globalState.hardhat_weth_address) {
        console.log('with eth test A');
        // Approve token B for router
        await submit(api, {
          network,
          userAddress: address,
          contractAddress: selectedTokenB(),
          function: 'approve',
          args: [router, maxApproval],
        });
        console.log('Approve token B completed');
        
        const result = await submitWithETH(api, {
          network,
          userAddress: address,
          contractAddress: router,
          function: 'addLiquidityETH',
          args: [selectedTokenB(), tokenBLiquidityR(), '0', '0', address, 0],
          eth: tokenALiquidityR(),
        });
        console.log(result);
      } else if (selectedTokenB() === globalState.hardhat_weth_address) {
        console.log('with eth test B');
        // Approve token A for router
        await submit(api, {
          network,
          userAddress: address,
          contractAddress: selectedTokenA(),
          function: 'approve',
          args: [router, maxApproval],
        });
        console.log('Approve token A completed');
        
        const result = await submitWithETH(api, {
          network,
          userAddress: address,
          contractAddress: router,
          function: 'addLiquidityETH',
          args: [selectedTokenA(), tokenALiquidityR(), '0', '0', address, 0],
          eth: tokenBLiquidityR(),
        });
        console.log(result);
      } else {
        console.log('basic test');
        // Approve both tokens for router
        await submit(api, {
          network,
          userAddress: address,
          contractAddress: selectedTokenA(),
          function: 'approve',
          args: [router, maxApproval],
        });
        console.log('Approve token A completed');
        
        await submit(api, {
          network,
          userAddress: address,
          contractAddress: selectedTokenB(),
          function: 'approve',
          args: [router, maxApproval],
        });
        console.log('Approve token B completed');
        
        const result = await submit(api, {
          network,
          userAddress: address,
          contractAddress: router,
          function: 'addLiquidity',
          args: [
            selectedTokenA(),
            selectedTokenB(),
            tokenALiquidityR(),
            tokenBLiquidityR(),
            '0',
            '0',
            address,
            0,
          ],
        });
        console.log(result);
      }
      setIsResult(true);
      setResult('Transaction successfully completed!\nPlease check the chart');
      setGoChart(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 500) {
          setIsResult(true);
          setResult(err.response.data.message);
        }
      }
    }
  };

  // init
  createEffect(() => {
    const fn = async (): Promise<void> => {
      const network = localStorage.getItem('network') as string;
      const address = localStorage.getItem('address') as string;

      if (fromDexNavigate.value) {
        if (network === 'null') {
          setIsNetwork(false);
          setFromDexNavigate({ value: false });
          return;
        }
        if (address === 'null') {
          setIsAccount(false);
        } else {
          setIsAccount(true);
        }

        setIsNetwork(true);
        setLoading(false);
        setCalcLoading(false);
        await init();
        setFromDexNavigate({ value: false });
        setLoading(true);
        setCalcLoading(true);
        return;
      }
      if (fromAppNavigate.value) {
        if (network === 'null') {
          setIsNetwork(false);
          setFromAppNavigate({ value: false });
          return;
        }
        if (address === 'null') {
          setIsAccount(false);
        } else {
          setIsAccount(true);
        }

        setIsNetwork(true);
        setLoading(false);
        setCalcLoading(false);
        await init();
        setFromAppNavigate({ value: false });
        setLoading(true);
        setCalcLoading(true);
        return;
      }
      if (fromHeaderNavigate.value) {
        if (network === 'null') {
          setIsNetwork(false);
          setFromHeaderNavigate({ value: false, type: '' });
          return;
        }

        if (fromHeaderNavigate.type === HeaderNavigateType.address) {
          if (address === 'null') {
            setIsAccount(false);
          } else {
            setIsAccount(true);
          }
          setFromHeaderNavigate({ value: false, type: '' });
        } else {
          if (address === 'null') {
            setIsAccount(false);
          } else {
            setIsAccount(true);
          }

          setIsNetwork(true);
          setLoading(false);
          setCalcLoading(false);
          await init();
          setFromHeaderNavigate({ value: false, type: '' });
          setLoading(true);
          setCalcLoading(true);
        }
      }
    };
    void fn();
  });
  const init = async (): Promise<void> => {
    setIsError(false);
    setApiErr('');
    if (method() === 't') {
      try {
        // token list
        const t = await getTokenContractList(api, {
          network: localStorage.getItem('network') as string,
        });
        // WETH
        const w = await getWETH(api, {
          network: localStorage.getItem('network') as string,
        });

        setTokens([...t, { name: 'WETH', address: w }]);
        setSelectedTokenA(t[0].address);
        setSelectedTokenB(t[1].address);

        setSelectedPair('');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setTokens([{ address: notExisted }]);
            setSelectedTokenA(notExisted);
            setSelectedTokenB(notExisted);

            setSelectedPair(notExisted);

            setIsError(true);
            setApiErr(err.response.data.message);
          }
        }
      }
    } else {
      try {
        const data = await getPairList(api, {
          network: localStorage.getItem('network') as string,
        });
        const set: any[] = [];
        for (let i = 0; i < data.length; i++) {
          set.push({
            pair: data[i].eventData.pair,
            tokenA: data[i].eventData.token0,
            tokenB: data[i].eventData.token1,
          });
        }
        setPairs(set);
        setSelectedPair(set[0].pair);
        setSelectedTokenA(set[0].tokenA);
        setSelectedTokenB(set[0].tokenA);
        setGetReserve(true);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setPairs([{ pair: notExisted }]);
            setSelectedPair(notExisted);
            setSelectedTokenA(notExisted);
            setSelectedTokenB(notExisted);

            setIsError(true);
            setApiErr(err.response.data.message);
          }
        }
      }
    }
    setGetReserve(true);
  };

  // pair effect
  createEffect(() => {
    if (getReserve()) {
      void r();
      setGetReserve(false);
    }
  });
  const r = async (): Promise<void> => {
    try {
      let pair = selectedPair();
      if (pair === notExisted) {
        setIsReserve(false);
        return;
      }

      setReserveLoading(false);
      if (pair === '') {
        const factory = await getFactory(api, {
          network: localStorage.getItem('network') as string,
        });

        const res = await calcPair(api, {
          network: localStorage.getItem('network') as string,
          userName: 'admin',
          contractName: 'DexCalc',
          factory,
          tokenA: selectedTokenA(),
          tokenB: selectedTokenB(),
        });
        pair = res;
        setSelectedPair(res);
      }

      const r = await getPairCurrentReserve(api, {
        network: localStorage.getItem('network') as string,
        pairAddress: pair,
      });
      if (selectedTokenA().toLowerCase() < selectedTokenB().toLowerCase()) {
        setReserve(r.eventData);
      } else {
        setReserve({
          reserve0: r.eventData.reserve1,
          reserve1: r.eventData.reserve0,
        });
      }
      setIsReserve(true);
      setReserveLoading(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setIsReserve(false);
          setReserveLoading(true);
        }
      }
    }
  };

  const [eth, setEth] = createSignal('0');
  const [wei, setWei] = createSignal('0');
  const handleEth = (e): void => {
    setWei('0');
    const value = e.target.value;
    if (/^[0-9]+(\.[0-9]+)?$/.test(value)) {
      setWei(ethers.parseEther(value).toString());
    }
  };
  const handleWei = (e): void => {
    setEth('0');
    const value = e.target.value;
    if (/^[0-9]+$/.test(value)) {
      setEth(ethers.formatEther(value).toString());
    }
  };

  const formatAddress = (address: string) => {
    if (!address || address === notExisted) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div class="staking-container">
      {/* Header */}
      <section class="staking-header">
        <h1 class="staking-title">Add Liquidity</h1>
        <p class="staking-subtitle">
          Provide liquidity to earn LP tokens and trading fees
        </p>
      </section>

      {/* Content */}
      <div class="staking-content">
        {!isNetwork() ? (
          <div class="staking-empty-state">
            <div class="empty-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h3>No Network Selected</h3>
            <p>
              Please select a network from the header to start adding liquidity.
            </p>
          </div>
        ) : (
          <>
            {isError() ? (
              <div class="staking-error">
                <div class="error-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <h3>Error</h3>
                <p>{apiErr()}</p>
              </div>
            ) : (
              <div class="staking-grid">
                {/* Token Selection Card */}
                <div class="staking-card">
                  <div class="card-header">
                    <h3>Token Selection</h3>
                  </div>
                  <div class="card-body">
                    {!loading() ? (
                      <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <span>Loading tokens...</span>
                      </div>
                    ) : (
                      <>
                        {/* Method Selection */}
                        <div class="method-selection">
                          <label class="method-label">Selection Method</label>
                          <div class="method-options">
                            <label class="method-option">
                              <input
                                type="radio"
                                name="method"
                                value="t"
                                checked={method() === 't'}
                                onChange={(e) => void handleChangeT(e)}
                              />
                              <span class="method-text">Select Tokens</span>
                            </label>
                            <label class="method-option">
                              <input
                                type="radio"
                                name="method"
                                value="p"
                                checked={method() === 'p'}
                                onChange={(e) => void handleChangeP(e)}
                              />
                              <span class="method-text">Select Pair</span>
                            </label>
                          </div>
                        </div>

                        {/* WETH Info */}
                        <div class="weth-info">
                          <span class="weth-label">WETH Address:</span>
                          <code
                            class="weth-address"
                            title={globalState.hardhat_weth_address}
                          >
                            {formatAddress(globalState.hardhat_weth_address)}
                          </code>
                        </div>

                        {/* Token/Pair Selection */}
                        {method() === 't' ? (
                          <div class="token-selects">
                            {/* Token A Select */}
                            <div class="select-group">
                              <Form.Label>Token A</Form.Label>
                              <Form.Select
                                aria-label="Select token A"
                                onChange={handleTokenAChange}
                                value={selectedTokenA()}
                              >
                                {tokens().map((token) => (
                                  <option value={token.address}>
                                    {token.address}
                                  </option>
                                ))}
                              </Form.Select>
                            </div>
                            {/* Token B Select */}
                            <div class="select-group">
                              <Form.Label>Token B</Form.Label>
                              <Form.Select
                                aria-label="Select token B"
                                onChange={handleTokenBChange}
                                value={selectedTokenB()}
                              >
                                {tokens().map((token) => (
                                  <option value={token.address}>
                                    {token.address}
                                  </option>
                                ))}
                              </Form.Select>
                            </div>
                          </div>
                        ) : (
                          /* Pair Select */
                          <div class="select-group">
                            <Form.Label>Select Pair</Form.Label>
                            <Form.Select
                              aria-label="Select Pair"
                              onChange={handlePairChange}
                              value={selectedPair()}
                            >
                              {pairs().map((pair) => (
                                <option value={pair.pair}>{pair.pair}</option>
                              ))}
                            </Form.Select>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Pool Info Card */}
                <div class="staking-card">
                  <div class="card-header">
                    <h3>Pool Information</h3>
                  </div>
                  <div class="card-body">
                    {!reserveLoading() ? (
                      <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <span>Loading pool data...</span>
                      </div>
                    ) : (
                      <>
                        {isReserve() ? (
                          <div class="pool-info">
                            <div class="pool-item">
                              <span class="pool-label">Pair Address</span>
                              <code class="pool-value" title={selectedPair()}>
                                {formatAddress(selectedPair())}
                              </code>
                            </div>
                            <div class="pool-item">
                              <span class="pool-label">Token A</span>
                              <code class="pool-value" title={selectedTokenA()}>
                                {formatAddress(selectedTokenA())}
                                {selectedTokenA() ===
                                  globalState.hardhat_weth_address && (
                                  <span class="token-badge">WETH</span>
                                )}
                              </code>
                            </div>
                            <div class="pool-item">
                              <span class="pool-label">Token B</span>
                              <code class="pool-value" title={selectedTokenB()}>
                                {formatAddress(selectedTokenB())}
                                {selectedTokenB() ===
                                  globalState.hardhat_weth_address && (
                                  <span class="token-badge">WETH</span>
                                )}
                              </code>
                            </div>
                            <div class="reserves-grid">
                              <div class="reserve-item">
                                <span class="reserve-label">Reserve A</span>
                                <span class="reserve-value">
                                  {reserve().reserve0}
                                </span>
                              </div>
                              <div class="reserve-item">
                                <span class="reserve-label">Reserve B</span>
                                <span class="reserve-value">
                                  {reserve().reserve1}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div class="no-pool">
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 8v4M12 16h.01" />
                            </svg>
                            <span>No pool found for this pair</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Estimate Liquidity Card */}
                <div class="staking-card">
                  <div class="card-header">
                    <h3>Estimate Liquidity</h3>
                  </div>
                  <div class="card-body">
                    {!calcLoading() ? (
                      <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div class="input-group">
                          <label>Token A Amount</label>
                          <input
                            id="aLiquidity"
                            type="text"
                            class="staking-input"
                            value={tokenALiquidity()}
                            onInput={(e) => void handleTokenALiquidityChange(e)}
                            placeholder="Enter amount in wei"
                          />
                          <span class="input-hint">{aMsg()}</span>
                        </div>
                        <div class="input-group">
                          <label>Token B Amount</label>
                          <input
                            id="bLiquidity"
                            type="text"
                            class="staking-input"
                            value={tokenBLiquidity()}
                            onInput={(e) => void handleTokenBLiquidityChange(e)}
                            placeholder="Enter amount in wei"
                          />
                          <span class="input-hint">{bMsg()}</span>
                        </div>

                        {/* Conversion Tool */}
                        <div class="conversion-tool">
                          <label class="conversion-label">Unit Converter</label>
                          <div class="conversion-inputs">
                            <div class="conversion-input">
                              <span class="unit-label">ETH</span>
                              <input
                                type="text"
                                class="staking-input"
                                value={eth()}
                                onInput={handleEth}
                                placeholder="0"
                              />
                            </div>
                            <div class="conversion-arrow">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
                              </svg>
                            </div>
                            <div class="conversion-input">
                              <span class="unit-label">WEI</span>
                              <input
                                type="text"
                                class="staking-input"
                                value={wei()}
                                onInput={handleWei}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Calculation Results Card */}
                <div class="staking-card">
                  <div class="card-header">
                    <h3>Calculation Results</h3>
                  </div>
                  <div class="card-body">
                    {!resultLoading() ? (
                      <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <span>
                          {isCalculating()
                            ? 'Calculating...'
                            : 'Waiting for input...'}
                        </span>
                      </div>
                    ) : (
                      <div class="results-vertical">
                        <div class="result-card">
                          <h4>
                            If you inject Token A: {tokenALiquidity() || '0'}
                          </h4>
                          <div class="result-item">
                            <span class="result-label">Required Token B</span>
                            <span class="result-value">
                              {tokenBCalculatedLiquidity() || '-'}
                            </span>
                          </div>
                          <div class="result-item highlight">
                            <span class="result-label">LP Reward</span>
                            <span class="result-value">
                              {bCalculatedLiquidity() || '-'}
                            </span>
                          </div>
                        </div>
                        <div class="result-card">
                          <h4>
                            If you inject Token B: {tokenBLiquidity() || '0'}
                          </h4>
                          <div class="result-item">
                            <span class="result-label">Required Token A</span>
                            <span class="result-value">
                              {tokenACalculatedLiquidity() || '-'}
                            </span>
                          </div>
                          <div class="result-item highlight">
                            <span class="result-label">LP Reward</span>
                            <span class="result-value">
                              {aCalculatedLiquidity() || '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Liquidity Card */}
                <div class="staking-card full-width">
                  <div class="card-header">
                    <h3>Add Liquidity</h3>
                  </div>
                  <div class="card-body">
                    {!isAccount() ? (
                      <div class="no-account">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Please select an account to add liquidity</span>
                      </div>
                    ) : (
                      <div class="add-liquidity-form">
                        <div class="add-liquidity-inputs">
                          <div class="input-group">
                            <label>Token A Amount</label>
                            <input
                              id="aLiquidityR"
                              type="text"
                              class="staking-input"
                              value={tokenALiquidityR()}
                              onInput={handleTokenLiquidityRChange}
                              placeholder="Enter amount to inject"
                            />
                            <span class="input-hint">{aMsgR()}</span>
                          </div>
                          <div class="input-group">
                            <label>Token B Amount</label>
                            <input
                              id="bLiquidityR"
                              type="text"
                              class="staking-input"
                              value={tokenBLiquidityR()}
                              onInput={handleTokenLiquidityRChange}
                              placeholder="Enter amount to inject"
                            />
                            <span class="input-hint">{bMsgR()}</span>
                          </div>
                        </div>
                        <div class="add-liquidity-action">
                          <button class="submit-btn" onClick={handleSubmit}>
                            Add Liquidity
                          </button>
                          {resultMsg() && (
                            <p class="result-msg error">{resultMsg()}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {lmodal() && (
        <div class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Confirm Transaction</h3>
              <button class="modal-close" onClick={handleCancel}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="confirm-item">
                <span class="confirm-label">Pair</span>
                <code class="confirm-value" title={selectedPair()}>
                  {formatAddress(selectedPair())}
                </code>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Token A</span>
                <code class="confirm-value" title={selectedTokenA()}>
                  {formatAddress(selectedTokenA())}
                </code>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Token B</span>
                <code class="confirm-value" title={selectedTokenB()}>
                  {formatAddress(selectedTokenB())}
                </code>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Amount A</span>
                <span class="confirm-value amount">{tokenALiquidityR()}</span>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Amount B</span>
                <span class="confirm-value amount">{tokenBLiquidityR()}</span>
              </div>

              {isResult() && (
                <div
                  class={`transaction-result ${goChart() ? 'success' : 'error'}`}
                >
                  <p>{result()}</p>
                </div>
              )}
            </div>
            <div class="modal-footer">
              {!isResult() ? (
                <>
                  <button class="modal-btn cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button
                    class="modal-btn confirm"
                    onClick={() => void handleSubmitR()}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <>
                  <button class="modal-btn cancel" onClick={handleCancel}>
                    Close
                  </button>
                  {goChart() && (
                    <button class="modal-btn confirm" onClick={handleGoChart}>
                      View Chart
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
