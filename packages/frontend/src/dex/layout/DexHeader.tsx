import { type Component, type JSX } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import {
  setFromDexNavigate,
  setFromDexNavigate2,
} from '../../global/global.store';
import { Container } from 'solid-bootstrap';

export const DexHeader: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChartClick = (): void => {
    const network = localStorage.getItem('network') as string;
    if (network === 'null') {
      if (location.pathname !== '/dex/chart') {
        setFromDexNavigate({ value: true });
        setFromDexNavigate2({ value: true });
        navigate(`/dex/chart`);
      }
    } else {
      if (location.pathname !== `/dex/chart/${network}`) {
        setFromDexNavigate({ value: true });
        setFromDexNavigate2({ value: true });
        navigate(`/dex/chart/${network}`);
      }
    }
  };
  const handleStakingClick = (): void => {
    const network = localStorage.getItem('network') as string;
    if (network === 'null') {
      if (location.pathname !== '/dex/staking') {
        setFromDexNavigate({ value: true });
        setFromDexNavigate2({ value: true });
        navigate(`/dex/staking`);
      }
    } else {
      if (location.pathname !== `/dex/staking/${network}`) {
        setFromDexNavigate({ value: true });
        setFromDexNavigate2({ value: true });
        navigate(`/dex/staking/${network}`);
      }
    }
  };
  const handleSwapClick = (): void => {
    if (location.pathname !== '/dex/swap') {
      setFromDexNavigate({ value: true });
      setFromDexNavigate2({ value: true });
      navigate('/dex/swap');
    }
  };
  const handleBridgeClick = (): void => {
    if (location.pathname !== '/dex/bridge') {
      setFromDexNavigate({ value: true });
      setFromDexNavigate2({ value: true });
      navigate('/dex/bridge');
    }
  };

  return (
    <>
      <Container fluid class="tw-h-10 tw-p-0">
        <div class="tw-h-full tw-flex tw-gap-4">
          <div
            class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tw-cursor-pointer"
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
            class="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-bg-purple-300 tw-cursor-pointer"
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
