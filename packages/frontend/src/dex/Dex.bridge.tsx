import { type Component, type JSX } from 'solid-js';
import { DexHeader } from './layout/DexHeader';
import { Bridge } from './components/Bridge';

const DexBridge: Component = (): JSX.Element => {
  return (
    <div class="tw-w-full">
      <DexHeader></DexHeader>
      <Bridge></Bridge>
    </div>
  );
};

export default DexBridge;
