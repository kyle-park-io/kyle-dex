import { type Component, type JSX } from 'solid-js';

const TradeIndex: Component = (): JSX.Element => {
  return (
    <>
      <div class="container mx-auto p-4">
        <div class="grid grid-cols-4 gap-4">
          <div class="col-span-3 bg-blue-300 p-4">Chart</div>
          <div class="bg-green-300 p-4">Side box</div>
        </div>
      </div>
    </>
  );
};

export default TradeIndex;
