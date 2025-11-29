import { type Component, type JSX, For, Show } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import {
  fromDexNavigate,
  setFromDexNavigate,
  fromAppNavigate,
  setFromAppNavigate,
  HeaderNavigateType,
  fromHeaderNavigate,
  setFromHeaderNavigate,
} from '../../global/global.store';
import {
  getTokenContractList,
  getWETH,
  getRouter,
} from '../axios/Dex.axios.token';
import { globalState } from '../../global/constants';
import { estimateSwapRatio } from '../axios/Dex.axios.utils';
import { submit, submitWithETH } from '../axios/Dex.axios.submit';
import axios from 'axios';
import { ethers } from 'ethers';

import './Swap.css';

const api = globalState.api_url;

const tokenDefault = 'Select Token';

// loading
const [tokenListLoading, setTokenListLoading] = createSignal(false);
const [calculationLoading, setCalculationLoading] = createSignal(true);
const [isCalculated, setIsCalculated] = createSignal(false);

const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);
const [isError, setIsError] = createSignal(false);
const [apiErr, setApiErr] = createSignal('');

const [swapTokenList, setSwapTokenList] = createSignal<any[]>([]);
const [swapTokenList2, setSwapTokenList2] = createSignal<any[]>([]);

export const Swap: Component = (): JSX.Element => {
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
        setTokenListLoading(false);
        await init();
        setFromDexNavigate({ value: false });
        setTokenListLoading(true);
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
        setTokenListLoading(false);
        await init();
        setFromAppNavigate({ value: false });
        setTokenListLoading(true);
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
          setTokenListLoading(false);
          await init();
          setFromHeaderNavigate({ value: false, type: '' });
          setTokenListLoading(true);
        }
      }
    };
    void fn();
  });

  const init = async (): Promise<void> => {
    setCalculationLoading(true);
    setIsError(false);
    setApiErr('');
    try {
      const t = await getTokenContractList(api, {
        network: localStorage.getItem('network') as string,
      });
      const w = await getWETH(api, {
        network: localStorage.getItem('network') as string,
      });
      setSwapTokenList([...t, { name: 'WETH', address: w }]);
      setSwapTokenList2([
        { name: 'default', address: tokenDefault },
        ...t,
        { name: 'WETH', address: w },
      ]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setSwapTokenList([]);
          setIsError(true);
          setApiErr(err.response.data.message);
        }
      }
    }
  };

  let currentAbortController = new AbortController();
  let currentAbortController2 = new AbortController();
  const [inputs, setInputs] = createSignal([tokenDefault]);
  const [inputsMsg, setInputsMsg] = createSignal(['']);
  
  const addInput = async (): Promise<void> => {
    setInputs([...inputs(), tokenDefault]);
    await handleInputAmountChange2();
  };
  
  const removeInput = async (): Promise<void> => {
    if (inputs().length > 1) {
      setInputs(inputs().slice(0, -1));
    }
    await handleInputAmountChange2();
  };
  
  const handleSelectChange = async (e, index): Promise<void> => {
    const updatedValues = [...inputs()];
    updatedValues[index] = e.target.value;
    setInputs(updatedValues);
    await handleInputAmountChange2();
  };
  
  const handleInputAmountChange2 = async (): Promise<void> => {
    currentAbortController2.abort();
    currentAbortController2 = new AbortController();
    try {
      const result = await performSwapTask2(currentAbortController2.signal);
      if (result as boolean) {
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
  
  const performSwapTask2 = async (signal): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        checkArray();
        resolve(true);
      }, 2000);
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  };

  const handleInputAmountChange = async (e): Promise<void> => {
    const value = e.target.value;
    currentAbortController.abort();
    currentAbortController = new AbortController();
    try {
      const result = await performSwapTask(value, currentAbortController.signal);
      if (result as boolean) {
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
  
  const performSwapTask = async (value: string, signal): Promise<boolean> => {
    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        setValue(value);
        checkArray();
        resolve(true);
      }, 2000);
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  };
  
  const [inputAmount, setInputAmount] = createSignal('');
  const [msg, setMsg] = createSignal('Enter the value!');
  const [bool3, setBool] = createSignal(false);
  
  const setValue = (value: string): void => {
    let bool2 = false;
    if (value === '') {
      setMsg('Enter the value!');
      setBool(false);
    } else if (/^-?[0-9]+$/.test(value)) {
      if (value === '0' || value.startsWith('-')) {
        setMsg('Enter a value greater than 0!');
        setBool(false);
      } else {
        setMsg("Let's calculate!");
        bool2 = true;
        setBool(true);
      }
    } else {
      setMsg('Invalid number format');
      setBool(false);
    }
    if (bool2) {
      setInputAmount(value);
    } else {
      setInputAmount('');
    }
  };
  
  const [listBool, setListBool] = createSignal(false);
  
  const checkArray = (): void => {
    setInputsMsg(['']);
    setListBool(true);
    if (inputs().length === 1) {
      setListBool(false);
      setInputsMsg(['Select at least two tokens']);
      return;
    }
    const checkMap = new Map<string, boolean>();
    const arr: any = [];
    for (let i = 0; i < inputs().length; i++) {
      if (inputs()[i] === tokenDefault) {
        setListBool(false);
        arr.push('Please select all tokens');
        continue;
      }
      if (checkMap.get(inputs()[i]) !== undefined) {
        setListBool(false);
        arr.push('Token cannot be duplicated in swap path');
        continue;
      }
      arr.push('');
      checkMap.set(inputs()[i], true);
    }
    setInputsMsg(arr);
  };
  
  const [estimateResult, setEstimateResult] = createSignal([]);
  const [estimateError, setEstimateError] = createSignal('');
  
  const calculate = async (): Promise<void> => {
    if (!bool3() || !listBool()) {
      return;
    }
    setIsCalculated(false);
    const result = await estimateSwapRatio(api, {
      network: localStorage.getItem('network') as string,
      tokens: inputs(),
      inputAmount: inputAmount(),
    });
    if (result.error !== null) {
      setEstimateResult(result.result);
      setEstimateError(result.error.message);
    } else {
      setEstimateResult(result.result);
      setEstimateError('');
    }
    setCalculationLoading(false);
    setIsCalculated(true);
  };

  // Swap execution
  const [inputsR, setInputsR] = createSignal([tokenDefault]);
  const [inputsMsgR, setInputsMsgR] = createSignal(['']);
  const [listBoolR, setListBoolR] = createSignal(false);
  
  const addInputR = (): void => {
    setInputsR([...inputsR(), tokenDefault]);
  };
  
  const removeInputR = (): void => {
    if (inputsR().length > 1) {
      setInputsR(inputsR().slice(0, -1));
    }
  };
  
  const handleSelectChangeR = (e, index): void => {
    const updatedValues = [...inputsR()];
    updatedValues[index] = e.target.value;
    setInputsR(updatedValues);
  };
  
  const checkArrayR = (): void => {
    setInputsMsgR(['']);
    setListBoolR(true);
    if (inputsR().length === 1) {
      setListBoolR(false);
      setInputsMsgR(['Select at least two tokens']);
      return;
    }
    const checkMap = new Map<string, boolean>();
    const arr: any = [];
    for (let i = 0; i < inputsR().length; i++) {
      if (inputsR()[i] === tokenDefault) {
        setListBoolR(false);
        arr.push('Please select all tokens');
        continue;
      }
      if (checkMap.get(inputsR()[i]) !== undefined) {
        setListBoolR(false);
        arr.push('Token cannot be duplicated in swap path');
        continue;
      }
      arr.push('');
      checkMap.set(inputsR()[i], true);
    }
    setInputsMsgR(arr);
  };
  
  const [inputAmountR, setInputAmountR] = createSignal('');
  const [msgR, setMsgR] = createSignal('Enter the value!');
  const [bool3R, setBoolR] = createSignal(false);
  
  const setValueR = (value: string): void => {
    let bool2 = false;
    if (value === '') {
      setMsgR('Enter the value!');
      setBoolR(false);
    } else if (/^-?[0-9]+$/.test(value)) {
      if (value === '0' || value.startsWith('-')) {
        setMsgR('Enter a value greater than 0!');
        setBoolR(false);
      } else {
        setMsgR("Let's swap!");
        bool2 = true;
        setBoolR(true);
      }
    } else {
      setMsgR('Invalid number format');
      setBoolR(false);
    }
    if (bool2) {
      setInputAmountR(value);
    } else {
      setInputAmountR('');
    }
  };
  
  const handleInputAmountChangeR = (e): void => {
    const value = e.target.value;
    setValueR(value);
  };
  
  const [lmodal, setLModal] = createSignal(false);
  const [resultMsg, setResultMsg] = createSignal('');
  
  const handleSubmit = (): void => {
    checkArrayR();
    if (listBoolR() && bool3R()) {
      setResultMsg('');
      setLModal(true);
    } else {
      setResultMsg('Check input!');
    }
  };
  
  const [isResult, setIsResult] = createSignal(false);
  const [result, setResult] = createSignal('');
  const [goChart, setGoChart] = createSignal(false);
  
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

      const network = localStorage.getItem('network') as string;
      const address = localStorage.getItem('address') as string;
      const router = await getRouter(api, { network });

      if (inputsR()[0] === globalState.hardhat_weth_address) {
        const result = await submitWithETH(api, {
          network,
          userAddress: address,
          contractAddress: router,
          function: 'swapExactETHForTokens',
          args: ['0', inputsR(), address, 0],
          eth: inputAmountR(),
        });
        console.log(result);
      } else {
        const result = await submit(api, {
          network,
          userAddress: address,
          contractAddress: router,
          function: 'swapExactTokensForTokens',
          args: [inputAmountR(), '0', inputsR(), address, 0],
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
    if (!address || address === tokenDefault) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div class="swap-container">
      {/* Header */}
      <section class="swap-header">
        <h1 class="swap-title">Swap Tokens</h1>
        <p class="swap-subtitle">Exchange tokens instantly using AMM</p>
      </section>

      {/* Content */}
      <div class="swap-content">
        <Show when={!isNetwork()}>
          <div class="swap-empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <h3>No Network Selected</h3>
            <p>Please select a network from the header to start swapping.</p>
          </div>
        </Show>

        <Show when={isNetwork() && isError()}>
          <div class="swap-error">
            <div class="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <h3>Error</h3>
            <p>{apiErr()}</p>
          </div>
        </Show>

        <Show when={isNetwork() && !isError()}>
          <div class="swap-grid">
            {/* Token List Card */}
            <div class="swap-card">
              <div class="card-header">
                <h3>Available Tokens</h3>
              </div>
              <div class="card-body">
                <Show when={!tokenListLoading()}>
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Loading tokens...</span>
                  </div>
                </Show>
                <Show when={tokenListLoading()}>
                  <div class="weth-info">
                    <span class="weth-label">WETH:</span>
                    <code class="weth-address" title={globalState.hardhat_weth_address}>
                      {formatAddress(globalState.hardhat_weth_address)}
                    </code>
                  </div>
                  <div class="token-list">
                    <For each={swapTokenList()}>
                      {(token) => (
                        <div class="token-list-item">
                          <div class="token-icon-small">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="10"/>
                            </svg>
                          </div>
                          <span class="token-name-small">{token.name || 'Token'}</span>
                          <code class="token-address-small" title={token.address}>
                            {formatAddress(token.address)}
                          </code>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </div>

            {/* Swap Path Card */}
            <div class="swap-card">
              <div class="card-header">
                <h3>Estimate Swap Path</h3>
                <div class="card-actions">
                  <button class="action-btn" onClick={() => void addInput()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add
                  </button>
                  <button class="action-btn" onClick={() => void removeInput()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
              <div class="card-body">
                <Show when={!tokenListLoading()}>
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Loading...</span>
                  </div>
                </Show>
                <Show when={tokenListLoading()}>
                  <div class="swap-path">
                    <For each={inputs()}>
                      {(value, index) => (
                        <div class="path-item">
                          <div class="path-number">{index() + 1}</div>
                          <select
                            class="swap-select"
                            onChange={(e) => void handleSelectChange(e, index())}
                            value={value}
                          >
                            <For each={swapTokenList2()}>
                              {(token) => (
                                <option value={token.address}>
                                  {token.name ? `${token.name} - ` : ''}{formatAddress(token.address)}
                                </option>
                              )}
                            </For>
                          </select>
                          <Show when={inputsMsg()[index()]}>
                            <span class="path-error">{inputsMsg()[index()]}</span>
                          </Show>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </div>

            {/* Estimate Card */}
            <div class="swap-card">
              <div class="card-header">
                <h3>Estimate Amount</h3>
              </div>
              <div class="card-body">
                <Show when={!tokenListLoading()}>
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Loading...</span>
                  </div>
                </Show>
                <Show when={tokenListLoading()}>
                  <div class="input-group">
                    <label>Input Amount (wei)</label>
                    <input
                      type="text"
                      class="swap-input"
                      onInput={(e) => void handleInputAmountChange(e)}
                      placeholder="Enter amount to swap"
                    />
                    <span class="input-hint">{msg()}</span>
                  </div>

                  <div class="conversion-tool">
                    <label class="conversion-label">Unit Converter</label>
                    <div class="conversion-inputs">
                      <div class="conversion-input">
                        <span class="unit-label">ETH</span>
                        <input
                          type="text"
                          class="swap-input"
                          value={eth()}
                          onInput={handleEth}
                          placeholder="0"
                        />
                      </div>
                      <div class="conversion-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>
                        </svg>
                      </div>
                      <div class="conversion-input">
                        <span class="unit-label">WEI</span>
                        <input
                          type="text"
                          class="swap-input"
                          value={wei()}
                          onInput={handleWei}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </Show>
              </div>
            </div>

            {/* Results Card */}
            <div class="swap-card">
              <div class="card-header">
                <h3>Calculation Results</h3>
              </div>
              <div class="card-body">
                <Show when={calculationLoading()}>
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Waiting for input...</span>
                  </div>
                </Show>
                <Show when={!calculationLoading() && !isCalculated()}>
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Calculating...</span>
                  </div>
                </Show>
                <Show when={!calculationLoading() && isCalculated()}>
                  <Show when={estimateError() !== ''}>
                    <div class="estimate-error">
                      <p>{estimateError()}</p>
                    </div>
                  </Show>
                  <Show when={estimateError() === ''}>
                    <div class="results-table-container">
                      <For each={estimateResult()}>
                        {(value: any, index) => (
                          <div class="result-table">
                            <div class="table-header">
                              <span>Swap Step {index() + 1}</span>
                            </div>
                            <div class="table-row">
                              <div class="table-cell header">Token</div>
                              <div class="table-cell">
                                <code title={value.token0}>{formatAddress(value.token0)}</code>
                              </div>
                              <div class="table-cell">
                                <code title={value.token1}>{formatAddress(value.token1)}</code>
                              </div>
                            </div>
                            <div class="table-row">
                              <div class="table-cell header">Reserve</div>
                              <div class="table-cell">{value.reserve0}</div>
                              <div class="table-cell">{value.reserve1}</div>
                            </div>
                            <div class="table-row highlight">
                              <div class="table-cell header">Change</div>
                              <div class="table-cell positive">+{value.input}</div>
                              <div class="table-cell negative">-{value.output}</div>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </Show>
              </div>
            </div>

            {/* Execute Swap Card */}
            <div class="swap-card full-width">
              <div class="card-header">
                <h3>Execute Swap</h3>
                <div class="card-actions">
                  <button class="action-btn" onClick={addInputR}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add
                  </button>
                  <button class="action-btn" onClick={removeInputR}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
              <div class="card-body">
                <Show when={!isAccount()}>
                  <div class="no-account">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Please select an account to swap</span>
                  </div>
                </Show>
                <Show when={isAccount() && !tokenListLoading()}>
                  <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Loading...</span>
                  </div>
                </Show>
                <Show when={isAccount() && tokenListLoading()}>
                  <div class="execute-swap-form">
                    <div class="execute-swap-path">
                      <For each={inputsR()}>
                        {(value, index) => (
                          <div class="path-item">
                            <div class="path-number">{index() + 1}</div>
                            <select
                              class="swap-select"
                              onChange={(e) => handleSelectChangeR(e, index())}
                              value={value}
                            >
                              <For each={swapTokenList2()}>
                                {(token) => (
                                  <option value={token.address}>
                                    {token.name ? `${token.name} - ` : ''}{formatAddress(token.address)}
                                  </option>
                                )}
                              </For>
                            </select>
                            <Show when={inputsMsgR()[index()]}>
                              <span class="path-error">{inputsMsgR()[index()]}</span>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                    <div class="execute-swap-input">
                      <div class="input-group">
                        <label>Input Amount (wei)</label>
                        <input
                          type="text"
                          class="swap-input"
                          onInput={handleInputAmountChangeR}
                          placeholder="Enter amount to swap"
                        />
                        <span class="input-hint">{msgR()}</span>
                      </div>
                    </div>
                    <div class="execute-swap-action">
                      <button class="submit-btn" onClick={handleSubmit}>
                        Swap Tokens
                      </button>
                      <Show when={resultMsg()}>
                        <p class="result-msg error">{resultMsg()}</p>
                      </Show>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </Show>
      </div>

      {/* Confirmation Modal */}
      <Show when={lmodal()}>
        <div class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Confirm Swap</h3>
              <button class="modal-close" onClick={handleCancel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="swap-path-preview">
                <span class="path-label">Swap Path</span>
                <For each={inputsR()}>
                  {(value, index) => (
                    <div class="path-preview-item">
                      <span class="path-index">{index() + 1}</span>
                      <code title={value}>{formatAddress(value)}</code>
                    </div>
                  )}
                </For>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Input Amount</span>
                <span class="confirm-value amount">{inputAmountR()}</span>
              </div>

              <Show when={isResult()}>
                <div class={`transaction-result ${goChart() ? 'success' : 'error'}`}>
                  <p>{result()}</p>
                </div>
              </Show>
            </div>
            <div class="modal-footer">
              <Show when={!isResult()}>
                <button class="modal-btn cancel" onClick={handleCancel}>Cancel</button>
                <button class="modal-btn confirm" onClick={() => void handleSubmitR()}>
                  Confirm Swap
                </button>
              </Show>
              <Show when={isResult()}>
                <button class="modal-btn cancel" onClick={handleCancel}>Close</button>
                <Show when={goChart()}>
                  <button class="modal-btn confirm" onClick={handleGoChart}>
                    View Chart
                  </button>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
