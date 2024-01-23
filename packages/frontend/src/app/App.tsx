import { type Component, type JSX } from 'solid-js';

const App: Component = (): JSX.Element => {
  // const env = import.meta.env.VITE_ENV;
  // let url;
  // if (env === 'DEV') {
  //   url = import.meta.env.VITE_DEV_URL;
  // } else if (env === 'PROD') {
  //   url = import.meta.env.VITE_PROD_URL;
  // } else {
  //   throw new Error('url env error');
  // }

  return (
    <>
      <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
        <h1 class="tw-underline">KYLE-DEX WILL OPEN SOON!</h1>
      </div>
    </>
  );
};

export default App;
