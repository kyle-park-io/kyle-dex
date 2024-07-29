import { type Component, type JSX } from 'solid-js';
import { DexHeader } from './layout/DexHeader';
import { Swap } from './components/Swap';

const DexSwap: Component = (): JSX.Element => {
  return (
    <div class="tw-w-full">
      <DexHeader></DexHeader>
      <Swap></Swap>
    </div>
  );
};

export default DexSwap;
