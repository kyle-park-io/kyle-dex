import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
// import { useNavigate } from '@solidjs/router';
import {
  Button,
  Spinner,
  CloseButton,
  Container,
  Form,
  Row,
  Col,
} from 'solid-bootstrap';
import {
  fromDexNavigate,
  setFromDexNavigate,
  // setFromDexNavigate2,
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
// import { CustomError } from '../../common/error/custom.error';

const notExisted = '현재 네트워크에 토큰이 존재하지 않습니다';

const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);
const [isError, setIsError] = createSignal(false);
const [apiErr, setApiErr] = createSignal('');
const [isResult, setIsResult] = createSignal(false);
const [goChart, setGoChart] = createSignal(false);
const [result, setResult] = createSignal('');

const [pairs, setPairs] = createSignal<any[]>([]);
const [tokens, setTokens] = createSignal<any[]>([]);

// const [items, setItems] = createSignal<Pair[]>([]);
// const [items, setItems] = createSignal<Pair2[]>([]);

export const Staking: Component = (): JSX.Element => {
  // const navigate = useNavigate();
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
    } else {
      // setTokenALiquidity('');
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
    } else {
      // setTokenBLiquidity('');
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
    // setFromDexNavigate({ value: true });
    // setFromDexNavigate2({ value: true });
    // navigate(`/dex/chart/${network}`);
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

      if (selectedTokenA() === globalState.hardhat_weth_address) {
        console.log('with eth test A');
        const result = await submitWithETH(api, {
          userAddress: address,
          contractAddress: router,
          function: 'addLiquidityETH',
          args: [selectedTokenB(), tokenBLiquidityR(), '0', '0', address, 0],
          eth: tokenALiquidityR(),
        });
        console.log(result);
      } else if (selectedTokenB() === globalState.hardhat_weth_address) {
        console.log('with eth test B');
        const result = await submitWithETH(api, {
          userAddress: address,
          contractAddress: router,
          function: 'addLiquidityETH',
          args: [selectedTokenA(), tokenALiquidityR(), '0', '0', address, 0],
          eth: tokenBLiquidityR(),
        });
        console.log(result);
      } else {
        console.log('basic test');
        const result = await submit(api, {
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
          // if (err instanceof CustomError) {}
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

  return (
    <>
      <Container fluid class="tw-flex-grow tw-p-4 tw-bg-gray-300">
        {!isNetwork() ? (
          <>
            <div class="tw-flex tw-items-center tw-justify-center">
              Select network please!
            </div>
          </>
        ) : (
          <>
            {isError() ? (
              <>
                <div class="tw-flex tw-items-center tw-justify-center">
                  {apiErr()}
                </div>
              </>
            ) : (
              <>
                <Row>
                  <Col md={4}>
                    {!loading() ? (
                      <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                        <Spinner animation="border" variant="info" />
                      </div>
                    ) : (
                      <>
                        <Form.Group>
                          <Form.Label>Method</Form.Label>
                          <Form.Check
                            checked
                            name="method"
                            type="radio"
                            label="Select Tokens"
                            value="t"
                            onChange={(e) => {
                              void handleChangeT(e);
                            }}
                          />
                          <Form.Check
                            name="method"
                            type="radio"
                            label="Select Pair"
                            value="p"
                            onChange={(e) => {
                              void handleChangeP(e);
                            }}
                          />
                        </Form.Group>
                        <div>cf. WETH: {globalState.hardhat_weth_address}</div>
                        <br></br>
                        <Form.Group>
                          {method() === 't' ? (
                            <>
                              <Form.Label>token A</Form.Label>
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
                              <Form.Label>token B</Form.Label>
                              <Form.Select
                                aria-label="Select token B"
                                onChange={handleTokenBChange}
                                value={selectedTokenB()}
                              >
                                {tokens()
                                  // .filter((token) => token.address !== selectedTokenA())
                                  .map((token) => (
                                    <option value={token.address}>
                                      {token.address}
                                    </option>
                                  ))}
                              </Form.Select>
                            </>
                          ) : (
                            <>
                              <Form.Label>Pair</Form.Label>
                              <Form.Select
                                aria-label="Select Pair"
                                onChange={handlePairChange}
                                value={selectedPair()}
                              >
                                {pairs().map((pair) => (
                                  <option value={pair.pair}>{pair.pair}</option>
                                ))}
                              </Form.Select>
                            </>
                          )}
                        </Form.Group>
                      </>
                    )}
                  </Col>
                  <Col md={4}>
                    {!reserveLoading() ? (
                      <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                        <Spinner animation="border" variant="info" />
                      </div>
                    ) : (
                      <>
                        {isReserve() ? (
                          <>
                            <ul class="list-unstyled">
                              <li>pair: {selectedPair()}</li>
                              <li>
                                {selectedTokenA() ===
                                globalState.hardhat_weth_address ? (
                                  <>tokenA: {selectedTokenA()} (WETH)</>
                                ) : (
                                  <>tokenA: {selectedTokenA()}</>
                                )}
                              </li>
                              <li>
                                {selectedTokenB() ===
                                globalState.hardhat_weth_address ? (
                                  <>tokenB: {selectedTokenB()} (WETH)</>
                                ) : (
                                  <>tokenB: {selectedTokenB()}</>
                                )}
                              </li>
                              <li>reserveA: {reserve().reserve0}</li>
                              <li>reserveB: {reserve().reserve1}</li>
                            </ul>
                          </>
                        ) : (
                          <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                            Check Pair
                          </div>
                        )}
                      </>
                    )}
                  </Col>
                  <Col md={4}>
                    {!calcLoading() ? (
                      <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                        <Spinner animation="border" variant="info" />
                      </div>
                    ) : (
                      <>
                        <Form.Group>
                          <Form.Label>Estimate Liquidity</Form.Label>
                          <br></br>
                          <Form.Label>token A</Form.Label>
                          <Form.Control
                            id="aLiquidity"
                            value={tokenALiquidity()}
                            onInput={(e) => {
                              void handleTokenALiquidityChange(e);
                            }}
                            placeholder="Please enter the liquidity to be injected"
                          ></Form.Control>
                          <p>{aMsg()}</p>
                          <Form.Label>token B</Form.Label>
                          <Form.Control
                            id="bLiquidity"
                            value={tokenBLiquidity()}
                            onInput={(e) => {
                              void handleTokenBLiquidityChange(e);
                            }}
                            placeholder="Please enter the liquidity to be injected"
                          ></Form.Control>
                          <p>{bMsg()}</p>

                          <Form.Label>Conversion Tool</Form.Label>
                          <div class="tw-flex tw-w-full">
                            <div>
                              <Form.Label>ETH</Form.Label>
                              <Form.Control
                                value={eth()}
                                onInput={handleEth}
                                placeholder="0"
                              ></Form.Control>
                            </div>
                            <div>
                              <Form.Label>WEI</Form.Label>
                              <Form.Control
                                value={wei()}
                                onInput={handleWei}
                                placeholder="0"
                              ></Form.Control>
                            </div>
                          </div>
                        </Form.Group>

                        <>
                          {lmodal() && (
                            <>
                              <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                <CloseButton
                                  onClick={handleCancel}
                                ></CloseButton>
                                <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                  <p>!Please check one more</p>
                                  <p>pair: {selectedPair()}</p>
                                  <p>tokenA: {selectedTokenA()}</p>
                                  <p>tokenB: {selectedTokenB()}</p>
                                  <p>amountA: {tokenALiquidityR()}</p>
                                  <p>amountB: {tokenBLiquidityR()}</p>
                                  <Button
                                    onClick={() => {
                                      void handleSubmitR();
                                    }}
                                  >
                                    Submit
                                  </Button>
                                  <Button onClick={handleCancel}>Cancel</Button>

                                  {isResult() && (
                                    <>
                                      <p>result:</p>
                                      <p>{result()}</p>
                                      {goChart() && (
                                        <>
                                          <Button onClick={handleGoChart}>
                                            Go Chart
                                          </Button>
                                        </>
                                      )}
                                    </>
                                  )}
                                </pre>
                              </div>
                            </>
                          )}
                        </>
                      </>
                    )}
                  </Col>
                  <Col md={4}>
                    <>
                      {!isAccount() ? (
                        <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                          Select account please!
                        </div>
                      ) : (
                        <>
                          <Form.Group>
                            <Form.Label>Add Liquidity</Form.Label>
                            <br></br>

                            <Form.Label>token A</Form.Label>
                            <Form.Control
                              id="aLiquidityR"
                              value={tokenALiquidityR()}
                              onInput={handleTokenLiquidityRChange}
                              placeholder="Please enter the liquidity to be injected"
                            ></Form.Control>
                            <p>{aMsgR()}</p>

                            <Form.Label>token B</Form.Label>
                            <Form.Control
                              id="bLiquidityR"
                              value={tokenBLiquidityR()}
                              onInput={handleTokenLiquidityRChange}
                              placeholder="Please enter the liquidity to be injected"
                            ></Form.Control>
                            <p>{bMsgR()}</p>
                          </Form.Group>

                          <Button onClick={handleSubmit}>Submit</Button>
                          <p>{resultMsg()}</p>
                        </>
                      )}
                    </>
                  </Col>
                  <Col md={8}>
                    {!resultLoading() ? (
                      <>
                        {isCalculating() ? (
                          <>
                            <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                              <Spinner animation="border" variant="info" />
                              계산 중
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                              <Spinner animation="border" variant="info" />
                              계산 대기 중
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div class="tw-h-full tw-w-full tw-flex">
                        <div class="tw-flex1">
                          tokenA를 {tokenALiquidity()}만큼 투입시키고 싶다면
                          <br />
                          tokenB는 최소 {tokenBCalculatedLiquidity()}만큼이
                          필요하고
                          <br />
                          이에 따른 유동성 보상은 {bCalculatedLiquidity()}{' '}
                          입니다
                        </div>
                        <div class="tw-flex1">
                          tokenB를 {tokenBLiquidity()}만큼 투입시키고 싶다면
                          <br />
                          tokenA는 최소 {tokenACalculatedLiquidity()}만큼이
                          필요하고
                          <br />
                          이에 따른 유동성 보상은 {aCalculatedLiquidity()}{' '}
                          입니다
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};
