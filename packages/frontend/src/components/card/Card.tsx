import { type Component, type JSX } from 'solid-js';
import { Card } from 'solid-bootstrap';
// image
import Chart from '/chart-bg.jpg?url';
import Staking from '/staking-bg.jpg?url';
import Swap from '/swap-bg.jpg?url';
import Bridge from '/bridge-bg.jpg?url';

import './Card.css';

export const ChartCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img variant="top" src={Chart} style={{ height: '20rem' }} />
        <Card.Body class="tw-text-black">
          <Card.Title>CHART</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const StakingCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img variant="top" src={Staking} style={{ height: '20rem' }} />
        <Card.Body class="tw-text-black">
          <Card.Title>STAKING</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const SwapCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img variant="top" src={Swap} style={{ height: '20rem' }} />
        <Card.Body class="tw-text-black">
          <Card.Title>SWAP</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const BridgeCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img variant="top" src={Bridge} style={{ height: '20rem' }} />
        <Card.Body class="tw-text-black">
          <Card.Title>BRIDGE</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};
