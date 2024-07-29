import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { fromDexNavigate, setFromDexNavigate } from '../../global/global.store';
import { Container } from 'solid-bootstrap';
import { globalState } from '../../global/constants';

const [isCalled, setIsCalled] = createSignal(false);

export const Bridge: Component = (): JSX.Element => {
  const api = globalState.api_url;
  console.log(api);

  // init
  createEffect(() => {
    if (!isCalled() || fromDexNavigate.value) {
      void init();
    }
  });
  const init = async (): Promise<void> => {
    setIsCalled(true);

    setFromDexNavigate({ value: false });
  };

  return (
    <>
      <Container fluid class="tw-p-4 tw-bg-gray-300">
        <div class="tw-flex tw-items-center tw-justify-center">
          Comming Soon
        </div>
      </Container>
    </>
  );
};
