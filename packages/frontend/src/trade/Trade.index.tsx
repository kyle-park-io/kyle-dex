import { type Component, type JSX, createSignal, createEffect } from 'solid-js';
import { ChartIndex } from './Chart.index';
import { PairList } from './components/PairList';
import { ClientPair } from './components/ClientPair';
import { Container, Row, Col } from 'solid-bootstrap';

const TradeIndex: Component = (): JSX.Element => {
  const [pair, setPair] = createSignal('');
  const [client, setClient] = createSignal('');

  const handleChangePair = (pair: string): void => {
    setPair(pair);
  };

  createEffect(() => {
    console.log(pair());
  });

  return (
    <>
      {/* container */}
      <div class="mx-auto p-4">
        <Container>
          <Row class="gap-4">
            <Col class="bg-purple-300 p-4">Chart</Col>
            <Col class="bg-purple-300 p-4">Staking</Col>
            <Col class="bg-purple-300 p-4">Swap</Col>
            <Col class="bg-purple-300 p-4">Bridge</Col>
          </Row>
        </Container>

        <div class="grid grid-cols-5 gap-4">
          <div class="col-span-3 bg-blue-300 p-4">
            Chart
            <div>
              <ChartIndex currentPair={pair()}></ChartIndex>
            </div>
          </div>
          <div class="col-span-1 bg-green-300 p-4">
            <h3>Pair</h3>
            <PairList
              currentPair={pair()}
              changePair={handleChangePair}
            ></PairList>
          </div>
          <div class="col-span-1 bg-green-300 p-4">
            <h3>Client</h3>
            <ClientPair currentPair={pair()}></ClientPair>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeIndex;
