import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { Spinner, Container, Row, Col } from 'solid-bootstrap';
// api
import { balanceOf, calcPair } from './Dex.axios';

const DexIndex: Component = (): JSX.Element => {
  const [, setIsProd] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);

  const [B_TOKENA, setTokenA] = createSignal('');
  const [B_TOKENB, setTokenB] = createSignal('');
  const [pairAddress, setPairAddress] = createSignal('');
  const [B_PAIR, setPair] = createSignal('');

  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
    setIsProd(true);
  } else {
    throw new Error('env error');
  }

  const user = import.meta.env.VITE_ADDRESS;
  const factory = import.meta.env.VITE_FACTORY;
  const tokenA = import.meta.env.VITE_TOKENA;
  const tokenB = import.meta.env.VITE_TOKENB;

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const B_TOKENA = await balanceOf(url, {
          userAddress: user,
          contractAddress: tokenA,
          name: 'tokenA',
          address: user,
        });
        setTokenA(B_TOKENA);

        const B_TOKENB = await balanceOf(url, {
          userAddress: user,
          contractAddress: tokenA,
          name: 'tokenB',
          address: user,
        });
        setTokenB(B_TOKENB);

        const pair = await calcPair(url, {
          userAddress: user,
          name: 'DexCalc',
          factory: factory,
          tokenA: tokenA,
          tokenB: tokenB,
        });
        setPairAddress(pair);

        // const B_PAIR = await balanceOf(url, {
        //   userAddress: user,
        //   contractAddress: pair,
        //   name: 'Pair',
        //   address: user,
        // });
        // setPair(B_PAIR);
        setPair('0');

        setLoading(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
        setLoading(true);
      }
    }
    void fetchData();
  });

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1>DEX Info</h1>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {!loading() ? (
              <div>
                Loading...
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div>
                {error() !== null ? (
                  <div>{error()?.message}</div>
                ) : (
                  <div>
                    <div>
                      <h3>tokenA</h3>
                      {B_TOKENA()}
                    </div>
                    <div>
                      <h3>tokenB</h3>
                      {B_TOKENB()}
                    </div>
                    <div>
                      <h3>pair : {pairAddress()}</h3>
                      {B_PAIR()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DexIndex;
