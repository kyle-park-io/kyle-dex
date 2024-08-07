import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Container, Row, Col } from 'solid-bootstrap';
import {
  ChartCard,
  StakingCard,
  SwapCard,
  BridgeCard,
} from '../components/card/Card';
import { globalState } from '../global/constants';
import { setFromAppNavigate } from '../global/global.store';

const App: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const handleChartClick = (): void => {
    if ((localStorage.getItem('network') as string) === 'null') {
      setFromAppNavigate({ value: true });
      navigate('/dex/chart');
    }
    if ((localStorage.getItem('network') as string) === 'hardhat') {
      setFromAppNavigate({ value: true });
      navigate('/dex/chart/hardhat');
    }
    if ((localStorage.getItem('network') as string) === 'sepolia') {
      setFromAppNavigate({ value: true });
      navigate('/dex/chart/sepolia');
    }
    if ((localStorage.getItem('network') as string) === 'amoy') {
      setFromAppNavigate({ value: true });
      navigate('/dex/chart/amoy');
    }
  };
  const handleStakingClick = (): void => {
    if ((localStorage.getItem('network') as string) === 'null') {
      setFromAppNavigate({ value: true });
      navigate('/dex/staking');
    }
    if ((localStorage.getItem('network') as string) === 'hardhat') {
      setFromAppNavigate({ value: true });
      navigate('/dex/staking/hardhat');
    }
    if ((localStorage.getItem('network') as string) === 'sepolia') {
      setFromAppNavigate({ value: true });
      navigate('/dex/staking/sepolia');
    }
    if ((localStorage.getItem('network') as string) === 'amoy') {
      setFromAppNavigate({ value: true });
      navigate('/dex/staking/amoy');
    }
  };
  const handleSwapClick = (): void => {
    navigate('/dex/swap');
  };
  const handleBridgeClick = (): void => {
    navigate('/dex/bridge');
  };

  return (
    <>
      {globalState.isOpen ? (
        <>
          <Container fluid class="tw-p-4">
            <Row class="tw-items-center tw-h-full">
              <Col md={3} xs={6} class="tw-flex tw-justify-center tw-gap-4">
                <button onClick={handleChartClick} class="transparent">
                  <ChartCard></ChartCard>
                </button>
              </Col>
              <Col md={3} xs={6} class="tw-flex tw-justify-center tw-gap-4">
                <button onClick={handleStakingClick} class="transparent ">
                  <StakingCard></StakingCard>
                </button>
              </Col>
              <Col md={3} xs={6} class="tw-flex tw-justify-center tw-gap-4">
                <button onClick={handleSwapClick} class="transparent">
                  <SwapCard></SwapCard>
                </button>
              </Col>
              <Col md={3} xs={6} class="tw-flex tw-justify-center tw-gap-4">
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
