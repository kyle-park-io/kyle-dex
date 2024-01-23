import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { Container, Row, Col } from 'solid-bootstrap';
import { ChartIndex } from './Chart.index';
import { PairList } from './components/PairList';
import { ClientPair } from './components/ClientPair';

const TradeIndex: Component = (): JSX.Element => {
  const [pair, setPair] = createSignal('');
  // const [client, setClient] = createSignal('');

  const handleChangePair = (pair: string): void => {
    setPair(pair);
  };

  createEffect(() => {
    console.log(pair());
  });

  return (
    <>
      <Container fluid>
        <Row class="tw-gap-4 tw-items-center tw-justify-center">
          <Col class="tw-bg-purple-300 tx-p-4">Chart</Col>
          <Col class="tw-bg-purple-300 tx-p-4">Staking</Col>
          <Col class="tw-bg-purple-300 tx-p-4">Swap</Col>
          <Col class="tw-bg-purple-300 tx-p-4">Bridge</Col>
        </Row>
        <Row>
          <Col md={8} class="tw-bg-blue-300 tw-p-4">
            <h2>Chart</h2>
            <div>
              <ChartIndex currentPair={pair()}></ChartIndex>
            </div>
          </Col>
          <Col md={2} class="tw-bg-green-300 tw-p-4">
            <h3>Pair</h3>
            <PairList
              currentPair={pair()}
              changePair={handleChangePair}
            ></PairList>
          </Col>
          <Col md={2} class="tw-bg-red-300 tw-p-4">
            <h3>Client</h3>
            <ClientPair currentPair={pair()}></ClientPair>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TradeIndex;
