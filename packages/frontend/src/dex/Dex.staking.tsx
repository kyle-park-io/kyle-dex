import { type Component, type JSX } from 'solid-js';
import { DexHeader } from './layout/DexHeader';
import { Staking } from './components/Staking';

const DexStaking: Component = (): JSX.Element => {
  return (
    <div class="tw-w-full">
      <DexHeader></DexHeader>
      <Staking></Staking>
    </div>
  );
};

export default DexStaking;
