import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { fromDexNavigate, setFromDexNavigate } from '../../global/global.store';
import { getPairList, getPairCurrentReserve } from '../axios/Dex.axios.pair';
import { getTokenContractList } from '../axios/Dex.axios.token';
import { getFactory, calcPair } from '../axios/Dex.axios.utils';
import { Container, Form, Row, Col } from 'solid-bootstrap';
import { globalState } from '../../global/constants';
import { globalNetwork } from '../../global/global.store';
import axios from 'axios';

const [isCalled, setIsCalled] = createSignal(false);

const [pairs, setPairs] = createSignal<any[]>([]);
const [tokens, setTokens] = createSignal<any[]>([]);

// const [items, setItems] = createSignal<Pair[]>([]);
// const [items, setItems] = createSignal<Pair2[]>([]);

export const Staking: Component = (): JSX.Element => {
  const api = globalState.api_url;

  // reserve
  const [isReserve, setIsReserve] = createSignal(false);
  const [getReserve, setGetReserve] = createSignal(false);
  const [reserve, setReserve] = createSignal<any>();

  // handle token, pair
  const [selectedTokenA, setSelectedTokenA] = createSignal('');
  const [selectedTokenB, setSelectedTokenB] = createSignal('');
  const [selectedPair, setSelectedPair] = createSignal('');
  const handleTokenAChange = (e) => {
    if (e.target.value === selectedTokenB()) {
      setSelectedTokenB(selectedTokenA());
      setSelectedTokenA(e.target.value);
    } else {
      setSelectedTokenA(e.target.value);
      setGetReserve(true);
    }
  };
  const handleTokenBChange = (e) => {
    if (e.target.value === selectedTokenA()) {
      setSelectedTokenA(selectedTokenB());
      setSelectedTokenB(e.target.value);
    } else {
      setSelectedTokenB(e.target.value);
      setGetReserve(true);
    }
  };
  const handlePairChange = (e) => {
    setSelectedPair(e.target.value);
    setGetReserve(true);
  };

  // handle method
  const [method, setMethod] = createSignal('t');
  const handleChangeT = async (event): Promise<void> => {
    setMethod(event.target.value);

    const t = await getTokenContractList(api, {
      network: globalNetwork.network,
    });
    setTokens(t);

    setSelectedTokenA(t[0].address);
    setSelectedTokenB(t[1].address);
    setSelectedPair('');

    setGetReserve(true);
  };
  const handleChangeP = async (event): Promise<void> => {
    setMethod(event.target.value);

    const data = await getPairList(api, { network: globalNetwork.network });

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
  };

  // init
  createEffect(() => {
    if (!isCalled() || fromDexNavigate.value) {
      void init();
    }
  });
  const init = async (): Promise<void> => {
    setIsCalled(true);

    // token list
    const t = await getTokenContractList(api, {
      network: globalNetwork.network,
    });
    setTokens(t);

    setSelectedTokenA(t[0].address);
    setSelectedTokenB(t[1].address);

    setGetReserve(true);

    setFromDexNavigate({ value: false });
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

      if (pair === '') {
        const factory = await getFactory(api, {
          network: globalNetwork.network,
        });

        const res = await calcPair(api, {
          network: globalNetwork.network,
          userName: 'user1',
          contractName: 'DexCalc',
          factory,
          tokenA: selectedTokenA(),
          tokenB: selectedTokenB(),
        });
        pair = res;
      }

      const r = await getPairCurrentReserve(api, {
        network: globalNetwork.network,
        pairAddress: pair,
      });
      setReserve(r.eventData);
      setIsReserve(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setIsReserve(false);
        }
      }
    }
  };

  return (
    <>
      <Container fluid class="tw-p-4 tw-bg-gray-300">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Method</Form.Label>
              <Form.Check
                checked
                name="method"
                type="radio"
                label="Select Tokens"
                value="t"
                onChange={handleChangeT}
              />
              <Form.Check
                name="method"
                type="radio"
                label="Select Pair"
                value="p"
                onChange={handleChangeP}
              />
            </Form.Group>
            <Form.Group>
              {method() === 't' ? (
                <>
                  <Form.Label>Token A</Form.Label>
                  <Form.Select
                    aria-label="Select Token A"
                    onChange={handleTokenAChange}
                    value={selectedTokenA()}
                  >
                    {tokens().map((token) => (
                      <option value={token.address}>{token.address}</option>
                    ))}
                  </Form.Select>
                  <Form.Label>Token B</Form.Label>
                  <Form.Select
                    aria-label="Select Token B"
                    onChange={handleTokenBChange}
                    value={selectedTokenB()}
                  >
                    {tokens()
                      // .filter((token) => token.address !== selectedTokenA())
                      .map((token) => (
                        <option value={token.address}>{token.address}</option>
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
          </Col>
          <Col md={4}>
            {isReserve() ? (
              <>
                <ul class="list-unstyled">
                  <li>토큰은 이름순으로 정렬되어 보여집니다</li>
                  <li>pair: {selectedPair()}</li>
                  <li>tokenA: {selectedTokenA()}</li>
                  <li>tokenB: {selectedTokenB()}</li>
                  <li>reserveA: {reserve().reserve0}</li>
                  <li>reserveB: {reserve().reserve1}</li>
                </ul>
              </>
            ) : (
              <>Pair 지금 없당 스테이킹 ㄱㄱ</>
            )}
          </Col>
          <Col md={4}>버튼</Col>
        </Row>
      </Container>
    </>
  );
};
