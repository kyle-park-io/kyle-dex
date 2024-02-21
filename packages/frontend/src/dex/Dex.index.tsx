import { type Component, type JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { DexHeader } from './layout/DexHeader';
import { Container, Row, Col } from 'solid-bootstrap';
import { ChartIndex } from '../chart/Chart.index';
import { ChartList } from '../chart/components/Chart.list';
import { PairList } from './components/PairList';
import { PairEvent } from './components/PairEvent';
import { ClientPair } from './components/ClientPair';

const DexChartIndex: Component = (): JSX.Element => {
  const [pair, setPair] = createSignal('');
  // const [client, setClient] = createSignal('');

  const [currentChart, setCurrentChart] = createSignal('all');

  const propsHandleCurrentPair = (pair2: string): void => {
    if (pair() === pair2) {
      setPair('');
    } else {
      setPair(pair2);
    }
  };

  const propsHandleCurrentChart = (chart: string): void => {
    if (chart === 'all') {
      setPair('');
    }
    setCurrentChart(chart);
  };

  return (
    <>
      <DexHeader></DexHeader>
      <Container fluid>
        <Row>
          <Col md={6} class="tw-bg-gray-300 tw-p-4">
            <ChartList
              currentChart={currentChart()}
              handleCurrentChart={propsHandleCurrentChart}
            ></ChartList>
          </Col>
          <Col md={6} class="tw-bg-gray-300 tw-p-4"></Col>
          <Col md={6} class="tw-bg-blue-300 tw-p-4">
            <h2>Chart</h2>
            <div>
              <ChartIndex
                currentChart={currentChart()}
                handleCurrentChart={propsHandleCurrentChart}
                currentPair={pair()}
              ></ChartIndex>
            </div>
          </Col>
          <Col md={2} class="tw-bg-yellow-300 tw-p-4">
            <h3>Pair</h3>
            <PairList
              currentPair={pair()}
              handleCurrentPair={propsHandleCurrentPair}
            ></PairList>
          </Col>
          <Col md={2} class="tw-bg-green-300 tw-p-4">
            <h3>Pair Event</h3>
            <PairEvent currentPair={pair()}></PairEvent>
          </Col>
          <Col md={2} class="tw-bg-red-300 tw-p-4">
            <h3>My Event</h3>
            <ClientPair currentPair={pair()}></ClientPair>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DexChartIndex;
