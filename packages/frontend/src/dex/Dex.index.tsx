import { type Component, type JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { DexHeader } from './layout/DexHeader';
import { Container, Row, Col } from 'solid-bootstrap';
import { ChartIndex } from '../chart/Chart.index';
import { ChartList } from '../chart/components/Chart.list';
import { PairList } from './components/pair/PairList';
import { PairEventList } from './components/pair/PairEventList';
import { PairEvent } from './components/pair/PairEvent';
import { ClientPair } from './components/pair/ClientPair';

const [currentChart, setCurrentChart] = createSignal('all');
const propsHandleCurrentChart = (chart: string): void => {
  setCurrentChart(chart);
};

const [pair, setPair] = createSignal('');
const propsHandleCurrentPair = (pair2: string): void => {
  if (pair() === pair2) {
    setPair('');
  } else {
    setPair(pair2);
  }
};

const DexChartIndex: Component = (): JSX.Element => {
  // event
  const [currentPairEvent, setCurrentPairEvent] =
    createSignal('pair-all-event');
  const propsHandleCurrentPairEvent = (event: string): void => {
    setCurrentPairEvent(event);
  };
  const [currentMyEvent, setCurrentMyEvent] = createSignal('my-all-event');
  const propsHandleCurrentMyEvent = (event: string): void => {
    setCurrentMyEvent(event);
  };

  const [currentFocusedComponent, setCurrentFocusedComponent] =
    createSignal('PairList');
  const propsHandleCurrentFocusedComponent = (component: string): void => {
    setCurrentFocusedComponent(component);
  };

  return (
    <div class="tw-w-full tw-flex tw-flex-col">
      <DexHeader></DexHeader>
      <Container fluid class="tw-flex-grow">
        <Row class="tw-h-full">
          <Col md={6} class="tw-bg-gray-300 tw-p-4">
            <ChartList
              currentChart={currentChart()}
              handleCurrentChart={propsHandleCurrentChart}
            ></ChartList>
          </Col>
          <Col md={6} class="tw-bg-gray-300 tw-p-4">
            <PairEventList
              currentPairEvent={currentPairEvent()}
              handleCurrentPairEvent={propsHandleCurrentPairEvent}
              currentMyEvent={currentMyEvent()}
              handleCurrentMyEvent={propsHandleCurrentMyEvent}
            ></PairEventList>
          </Col>
          <Col md={6} class="tw-bg-blue-300 tw-p-4">
            <ChartIndex
              currentChart={currentChart()}
              currentPair={pair()}
              handleCurrentChart={propsHandleCurrentChart}
            ></ChartIndex>
          </Col>
          <Col md={2} class="tw-bg-yellow-300 tw-p-4">
            <PairList
              currentPair={pair()}
              handleCurrentPair={propsHandleCurrentPair}
              currentFocusedComponent={currentFocusedComponent()}
              handleCurrentFocusedComponent={propsHandleCurrentFocusedComponent}
            ></PairList>
          </Col>
          <Col md={2} class="tw-bg-green-300 tw-p-4">
            <PairEvent
              currentPair={pair()}
              currentFocusedComponent={currentFocusedComponent()}
              handleCurrentFocusedComponent={propsHandleCurrentFocusedComponent}
              currentPairEvent={currentPairEvent()}
              handleCurrentPairEvent={propsHandleCurrentPairEvent}
            ></PairEvent>
          </Col>
          <Col md={2} class="tw-bg-red-300 tw-p-4">
            <ClientPair
              currentPair={pair()}
              currentFocusedComponent={currentFocusedComponent()}
              handleCurrentFocusedComponent={propsHandleCurrentFocusedComponent}
              currentMyEvent={currentMyEvent()}
              handleCurrentMyEvent={propsHandleCurrentMyEvent}
            ></ClientPair>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DexChartIndex;
