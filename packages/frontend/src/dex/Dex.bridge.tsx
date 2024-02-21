import { type Component, type JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { DexHeader } from './layout/DexHeader';
import { Container, Row, Col } from 'solid-bootstrap';
import { PairList } from './components/PairList';

const DexBridge: Component = (): JSX.Element => {
  const [pair, setPair] = createSignal('');
  // const [client, setClient] = createSignal('');

  const propsHandleCurrentPair = (pair2: string): void => {
    if (pair() === pair2) {
      setPair('');
    } else {
      setPair(pair2);
    }
  };

  return (
    <>
      <DexHeader></DexHeader>
      <Container fluid>
        <Row>
          <Col md={6} class="tw-bg-gray-300 tw-p-4">
            <PairList
              currentPair={pair()}
              handleCurrentPair={propsHandleCurrentPair}
            ></PairList>
          </Col>
          <Col md={6} class="tw-bg-gray-300 tw-p-4">
            input
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DexBridge;
