import { type Component, type JSX } from 'solid-js';
import HomeLogo from '/home.svg?url';

const Header: Component = (): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
  } else {
    throw new Error('url env error');
  }

  return (
    <>
      <div class="w-full h-full">
        <header class="offscreen">golang is forever !</header>
        <div class="w-full h-full center-flex justify-between">
          <a href={`${url}`} class="h-full">
            <img src={HomeLogo} alt="Home" class="h-full"></img>
          </a>
          <a href={`${url}`} class="basic">
            <h1 class="text-center flex-grow">KYLE PARK</h1>
          </a>
          <p class="text-right items-center">links</p>
          {/* 헤더 콘텐츠 */}
        </div>
      </div>
    </>
  );
};

export default Header;
