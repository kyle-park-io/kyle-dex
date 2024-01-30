import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { DexHeader } from './layout/DexHeader';
import { Container, Row, Col } from 'solid-bootstrap';
import { ChartIndex } from '../chart/Chart.index';
import { PairList } from './components/PairList';
import { ClientPair } from './components/ClientPair';

import { globalAccount } from '../layout/Header';

const DexChartIndex: Component = (): JSX.Element => {
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
      <DexHeader></DexHeader>
      <Container fluid>
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
            <ClientPair
              currentPair={pair()}
              currentAccount={globalAccount.address}
            ></ClientPair>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DexChartIndex;
