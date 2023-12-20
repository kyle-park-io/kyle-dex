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
      <div class="flex-grow flex flex-col">
        <div>
          <h1 class="underline">KYLE-DEX WILL OPEN SOON!</h1>
        </div>
        <div class="flex-grow center-flex"></div>
      </div>
    </>
  );
};

export default App;
