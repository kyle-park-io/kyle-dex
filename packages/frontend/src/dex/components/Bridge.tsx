import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import {
  fromDexNavigate,
  setFromDexNavigate,
  // setFromDexNavigate2,
  fromAppNavigate,
  setFromAppNavigate,
  // HeaderNavigateType,
  fromHeaderNavigate,
  setFromHeaderNavigate,
} from '../../global/global.store';
import { Container } from 'solid-bootstrap';
import { globalState } from '../../global/constants';

const api = globalState.api_url;
console.log(api);

const [isError, setIsError] = createSignal(false);
console.log(isError, setIsError);

export const Bridge: Component = (): JSX.Element => {
  createEffect(() => {
    const fn = async (): Promise<void> => {
      if (fromDexNavigate.value) {
        setFromDexNavigate({ value: false });
        return;
      }
      if (fromAppNavigate.value) {
        setFromAppNavigate({ value: false });
        return;
      }
      if (fromHeaderNavigate.value) {
        setFromHeaderNavigate({ value: false });
        return;
      }
    };
    void fn;
  });

  return (
    <>
      <Container fluid class="tw-flex-grow tw-p-4 tw-bg-gray-300">
        <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
          Comming Soon
        </div>
      </Container>
    </>
  );
};
