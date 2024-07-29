import { type Component, type JSX } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { setFromDexNavigate } from '../../global/global.store';
import { Container } from 'solid-bootstrap';

export const DexHeader: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChartClick = (): void => {
    if (location.pathname !== '/dex/chart') {
      setFromDexNavigate({ value: true });
      navigate('/dex/chart');
    }
  };
  const handleStakingClick = (): void => {
    if (location.pathname !== '/dex/staking') {
      setFromDexNavigate({ value: true });
      navigate('/dex/staking');
    }
  };
  const handleSwapClick = (): void => {
    if (location.pathname !== '/dex/swap') {
      setFromDexNavigate({ value: true });
      navigate('/dex/swap');
    }
  };
  const handleBridgeClick = (): void => {
    if (location.pathname !== '/dex/bridge') {
      setFromDexNavigate({ value: true });
      navigate('/dex/bridge');
    }
  };

  return (
    <>
      <Container fluid class="tw-h-10 tw-p-0">
        <div class="tw-h-full tw-flex tw-gap-4">
          <div
            class="tw-flex-1 tw-flex  tw-items-center tw-justify-center tw-bg-purple-300 tw-cursor-pointer"
            onClick={handleChartClick}
          >
            Chart
          </div>
          <div
            class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tw-cursor-pointer"
            onClick={handleStakingClick}
          >
            Staking
          </div>
          <div
            class="tw-flex-1 tw-flex  tw-items-center tw-justify-center tw-bg-purple-300 tw-cursor-pointer"
            onClick={handleSwapClick}
          >
            Swap
          </div>
          <div
            class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tw-cursor-pointer"
            onClick={handleBridgeClick}
          >
            Bridge
          </div>
        </div>
      </Container>
    </>
  );
};
