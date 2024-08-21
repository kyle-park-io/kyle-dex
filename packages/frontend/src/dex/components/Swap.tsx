import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  CloseButton,
} from 'solid-bootstrap';
import {
  fromDexNavigate,
  setFromDexNavigate,
  setFromDexNavigate2,
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
// import {
//   calcPairFromFactory,
//   getSpecifiedPairsReserve,
// } from '../services/pair.service';
import axios from 'axios';
import { ethers } from 'ethers';

const api = globalState.api_url;

const tokenDefault = '토큰을 선택하세요';

// loading
const [tokenListLoading, setTokenListLoading] = createSignal(false);
const [calculationLoading, setCalculationLoading] = createSignal(true);
const [isCalculated, setIsCalculated] = createSignal(false);

const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);
const [isError, setIsError] = createSignal(false);
const [apiErr, setApiErr] = createSignal('');
// const [isResult, setIsResult] = createSignal(false);
// const [result, setResult] = createSignal('');

const [swapTokenList, setSwapTokenList] = createSignal<any[]>([]);
const [swapTokenList2, setSwapTokenList2] = createSignal<any[]>([]);
// const [swapPairList, setSwapPairList] = createSignal<any[]>([]);
// const [swapReserveList, setSwapReserveList] = createSignal<any[]>([]);

// const makePairList = async (tokens: any[]): Promise<any> => {
//   try {
//     const arr: string[] = [];
//     for (let i = 0; i < tokens.length - 1; i++) {
//       const pair = await calcPairFromFactory(tokens[i], tokens[i + 1]);
//       arr.push(pair);
//     }
//     console.log(arr);
//     setSwapPairList(arr);
//   } catch (err) {}
// };

// const makeReserveList = async (pairs: any[]): Promise<any> => {
//   try {
//     const arr: string[] = [];
//     const result = await getSpecifiedPairsReserve(pairs);
//     console.log(arr);
//     console.log(result);
//     // setSwapReserveList(arr);
//   } catch (err) {}
// };

export const Swap: Component = (): JSX.Element => {
  const navigate = useNavigate();

  createEffect(() => {
    const fn = async () => {
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

      // await makePairList(swapTokenList());
      // await makeReserveList(swapPairList());
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
  const addInput = async () => {
    setInputs([...inputs(), tokenDefault]);
    await handleInputAmountChange2();
  };
  const removeInput = async () => {
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
  const handleInputAmountChange2 = async () => {
    currentAbortController2.abort();
    currentAbortController2 = new AbortController();
    try {
      const result = await performSwapTask2(currentAbortController2.signal);
      if (result) {
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
  const performSwapTask2 = (signal) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        checkArray();
        resolve(true);
      }, 2000);

      // cancel
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  };

  const handleInputAmountChange = async (e) => {
    const value = e.target.value;

    currentAbortController.abort();
    currentAbortController = new AbortController();
    try {
      console.log(e.target.value);

      const result = await performSwapTask(
        value,
        currentAbortController.signal,
      );
      if (result) {
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
  const performSwapTask = (value: string, signal) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        setValue(value);
        checkArray();
        resolve(true);
      }, 2000);

      // cancel
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  };
  const [inputAmount, setInputAmount] = createSignal('');
  const [msg, setMsg] = createSignal('Enter the value!');
  const [bool3, setBool] = createSignal(false);
  const setValue = (value: string) => {
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
  const checkArray = () => {
    setInputsMsg(['']);
    setListBool(true);
    if (inputs().length === 1) {
      setListBool(false);
      setInputsMsg(['토큰을 두 개 이상 선택하세요']);
      return;
    }
    const checkMap = new Map<string, boolean>();
    let arr: any = [];
    for (let i = 0; i < inputs().length; i++) {
      if (inputs()[i] === tokenDefault) {
        setListBool(false);
        arr.push('토큰을 모두 선택하세요');
        continue;
      }
      if (checkMap.get(inputs()[i]) !== undefined) {
        setListBool(false);
        arr.push('토큰이 스왑 과정에서 중복 호출될 수 없습니다');
        continue;
      }
      arr.push('');
      checkMap.set(inputs()[i], true);
    }
    setInputsMsg(arr);
  };
  const [estimateResult, setEstimateResult] = createSignal([]);
  const [estimateError, setEstimateError] = createSignal('');
  const calculate = async () => {
    console.log(bool3(), listBool());
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
      if (axios.isAxiosError(result.error)) {
        console.log('here');
      }
      setEstimateResult(result.result);
      setEstimateError(result.error.message);
    } else {
      setEstimateResult(result.result);
      setEstimateError('');
    }
    setCalculationLoading(false);
    setIsCalculated(true);
    console.log(estimateResult());
  };

  const [inputsR, setInputsR] = createSignal([tokenDefault]);
  const [inputsMsgR, setInputsMsgR] = createSignal(['']);
  const [listBoolR, setListBoolR] = createSignal(false);
  const addInputR = async () => {
    setInputsR([...inputsR(), tokenDefault]);
  };
  const removeInputR = async () => {
    if (inputsR().length > 1) {
      setInputsR(inputsR().slice(0, -1));
    }
  };
  const handleSelectChangeR = async (e, index): Promise<void> => {
    const updatedValues = [...inputsR()];
    updatedValues[index] = e.target.value;
    setInputsR(updatedValues);
  };
  const checkArrayR = () => {
    setInputsMsgR(['']);
    setListBoolR(true);
    if (inputsR().length === 1) {
      setListBoolR(false);
      setInputsMsgR(['토큰을 두 개 이상 선택하세요']);
      return;
    }
    const checkMap = new Map<string, boolean>();
    let arr: any = [];
    for (let i = 0; i < inputsR().length; i++) {
      if (inputsR()[i] === tokenDefault) {
        setListBoolR(false);
        arr.push('토큰을 모두 선택하세요');
        continue;
      }
      if (checkMap.get(inputsR()[i]) !== undefined) {
        setListBoolR(false);
        arr.push('토큰이 스왑 과정에서 중복 호출될 수 없습니다');
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
  const setValueR = (value: string) => {
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
  const handleInputAmountChangeR = (e) => {
    const value = e.target.value;
    setValueR(value);
  };
  const [lmodal, setLModal] = createSignal(false);
  const [resultMsg, setResultMsg] = createSignal('');
  const handleSubmit = () => {
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
  const handleCancel = () => {
    if (isResult()) {
      window.location.reload();
    } else {
      setLModal(false);
      setIsResult(false);
      setResult('');
    }
  };
  const handleGoChart = () => {
    const network = localStorage.getItem('network') as string;
    setFromDexNavigate({ value: true });
    setFromDexNavigate2({ value: true });
    navigate(`/dex/chart/${network}`);
  };
  const handleSubmitR = async () => {
    try {
      setIsResult(false);
      setResult('');
      setGoChart(false);

      const network = localStorage.getItem('network') as string;
      const address = localStorage.getItem('address') as string;
      const router = await getRouter(api, { network });

      console.log(inputsR());
      if (inputsR()[0] === globalState.hardhat_weth_address) {
        console.log('with eth test A');
        const result = await submitWithETH(api, {
          userAddress: address,
          contractAddress: router,
          function: 'swapExactETHForTokens',
          args: ['0', inputsR(), address, 0],
          eth: inputAmountR(),
        });
        console.log(result);
      } else {
        console.log('basic test');
        const result = await submit(api, {
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
  const handleEth = (e) => {
    setWei('0');
    const value = e.target.value;
    if (/^[0-9]+(\.[0-9]+)?$/.test(value)) {
      setWei(ethers.parseEther(value).toString());
    }
  };
  const handleWei = (e) => {
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
                    {!tokenListLoading() ? (
                      <>
                        <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                          <Spinner animation="border" variant="info" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Form.Label>Token List</Form.Label>
                        <p>cf. WETH: {globalState.hardhat_weth_address}</p>
                        <Form.Select>
                          {swapTokenList().map((token) => (
                            <option value={token.address}>
                              {token.address}
                            </option>
                          ))}
                        </Form.Select>
                      </>
                    )}
                  </Col>
                  <Col md={4}>
                    {!tokenListLoading() ? (
                      <>
                        <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                          <Spinner animation="border" variant="info" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            void addInput();
                          }}
                        >
                          Add Token
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            void removeInput();
                          }}
                        >
                          Remove Token
                        </Button>
                        <div>
                          {inputs().map((value, index) => (
                            <>
                              <Form.Select
                                onChange={(e) => {
                                  void handleSelectChange(e, index);
                                }}
                                value={value}
                              >
                                {swapTokenList2().map((token) => (
                                  <option value={token.address}>
                                    {token.address}
                                  </option>
                                ))}
                              </Form.Select>
                              <p>{inputsMsg()[index]}</p>
                            </>
                          ))}
                        </div>
                      </>
                    )}
                  </Col>
                  <Col md={4}>
                    {!tokenListLoading() ? (
                      <>
                        <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                          <Spinner animation="border" variant="info" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Form.Label>Estimate Swap Ratio</Form.Label>
                        <br></br>
                        <Form.Label>input amount</Form.Label>
                        <Form.Control
                          onInput={(e) => {
                            void handleInputAmountChange(e);
                          }}
                          placeholder="Please enter the amount to be swapped"
                        ></Form.Control>
                        <p>{msg()}</p>

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
                          {!tokenListLoading() ? (
                            <>
                              <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                                <Spinner animation="border" variant="info" />
                              </div>
                            </>
                          ) : (
                            <>
                              <Form.Group>
                                <Form.Label>Swap Token</Form.Label>
                                <br></br>
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    void addInputR();
                                  }}
                                >
                                  Add Token
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    void removeInputR();
                                  }}
                                >
                                  Remove Token
                                </Button>
                                <div>
                                  {inputsR().map((value, index) => (
                                    <>
                                      <Form.Select
                                        onChange={(e) => {
                                          void handleSelectChangeR(e, index);
                                        }}
                                        value={value}
                                      >
                                        {swapTokenList2().map((token) => (
                                          <option value={token.address}>
                                            {token.address}
                                          </option>
                                        ))}
                                      </Form.Select>
                                      <p>{inputsMsgR()[index]}</p>
                                    </>
                                  ))}
                                </div>
                                <Form.Label>input amount</Form.Label>
                                <Form.Control
                                  onInput={(e) => {
                                    handleInputAmountChangeR(e);
                                  }}
                                  placeholder="Please enter the amount to be swapped"
                                ></Form.Control>
                                <p>{msgR()}</p>
                                <Button onClick={handleSubmit}>Submit</Button>
                                <p>{resultMsg()}</p>
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
                                        <p>swap list</p>
                                        {inputsR().map((value, index) => (
                                          <>
                                            <p>
                                              token{index} : {value}
                                            </p>
                                          </>
                                        ))}
                                        <p>inputAmount: {inputAmountR()}</p>
                                        <Button onClick={handleSubmitR}>
                                          Submit
                                        </Button>
                                        <Button onClick={handleCancel}>
                                          Cancel
                                        </Button>

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
                        </>
                      )}
                    </>
                  </Col>
                  <Col md={8}>
                    {calculationLoading() ? (
                      <>
                        <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                          <Spinner animation="border" variant="info" />
                          계산 대기 중
                        </div>
                      </>
                    ) : (
                      <>
                        {!isCalculated() ? (
                          <>
                            <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                              <Spinner animation="border" variant="info" />
                              계산 중
                            </div>
                          </>
                        ) : (
                          <>
                            {estimateError() !== '' ? (
                              <>
                                <p>{estimateError()}</p>
                              </>
                            ) : (
                              <>
                                <div>
                                  {estimateResult().map((value: any) => (
                                    <Table>
                                      <thead>
                                        <tr>
                                          <th></th>
                                          <th>Token0</th>
                                          <th>Token1</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>address</td>
                                          <td>{value.token0}</td>
                                          <td>{value.token1}</td>
                                        </tr>
                                        <tr>
                                          <td>reserve</td>
                                          <td>{value.reserve0}</td>
                                          <td>{value.reserve1}</td>
                                        </tr>
                                        <tr>
                                          <td>change</td>
                                          <td>+{value.input}</td>
                                          <td>-{value.output}</td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </>
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
