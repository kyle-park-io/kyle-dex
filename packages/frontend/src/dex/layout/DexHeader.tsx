import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Container, Row, Col } from 'solid-bootstrap';

export const DexHeader: Component = (): JSX.Element => {
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
      <Container fluid>
        <Row class="tw-gap-4 tw-items-center tw-justify-center">
          <Col
            onClick={handleChartClick}
            class="tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tx-p-4 tw-cursor-pointer"
          >
            Chart
          </Col>
          <Col
            onClick={handleStakingClick}
            class="tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tx-p-4 tw-cursor-pointer"
          >
            Staking
          </Col>
          <Col
            onClick={handleSwapClick}
            class="tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tx-p-4 tw-cursor-pointer"
          >
            Swap
          </Col>
          <Col
            onClick={handleBridgeClick}
            class="tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tx-p-4 tw-cursor-pointer"
          >
            Bridge
          </Col>
        </Row>
      </Container>
    </>
  );
};
