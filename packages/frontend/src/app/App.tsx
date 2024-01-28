import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Container, Row, Col } from 'solid-bootstrap';

import {
  ChartCard,
  StakingCard,
  SwapCard,
  BridgeCard,
} from '../components/card/Card';

const App: Component = (): JSX.Element => {
  const isProd = true;

  const navigate = useNavigate();
  const handleChartClick = (): void => {
    navigate('/dex/chart');
  };
  const handleStakingClick = (): void => {
    navigate('/dex/staking');
  };
  const handleSwapClick = (): void => {
    navigate('/dex/swap');
  };
  const handleBridgeClick = (): void => {
    navigate('/dex/bridge');
  };

  return (
    <>
      {isProd ? (
        <>
          <Container fluid>
            <Row class="tw-items-center tw-h-full">
              <Col md={3} class="tw-flex tw-justify-center tw-gap-4">
                <button onClick={handleChartClick} class="transparent">
                  <ChartCard></ChartCard>
                </button>
              </Col>
              <Col md={3} class="tw-flex tw-justify-center tw-gap-4">
                <button onClick={handleStakingClick} class="transparent">
                  <StakingCard></StakingCard>
                </button>
              </Col>
              <Col md={3} class="tw-flex tw-justify-center tw-gap-4">
                <button onClick={handleSwapClick} class="transparent">
                  <SwapCard></SwapCard>
                </button>
              </Col>
              <Col md={3} class="tw-flex tw-justify-center tw-gap-4">
                <button onClick={handleBridgeClick} class="transparent">
                  <BridgeCard></BridgeCard>
                </button>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <>
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
            <h1 class="tw-underline">KYLE-DEX WILL OPEN SOON!</h1>
          </div>
        </>
      )}
    </>
  );
};

export default App;
