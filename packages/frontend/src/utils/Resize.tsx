import { type Component, type JSX } from 'solid-js';
import { onCleanup, onMount } from 'solid-js';
// css
import './Resize.css';

const Resize: Component = (): JSX.Element => {
  const enforceMinSize = (): void => {
    if (window.innerWidth < 800) {
      window.resizeTo(800, window.innerHeight);
    }
    if (window.innerHeight < 600) {
      window.resizeTo(window.innerWidth, 600);
    }
  };

  onMount(() => {
    window.addEventListener('resize', enforceMinSize);
    enforceMinSize();
  });

  onCleanup(() => {
    window.removeEventListener('resize', enforceMinSize);
  });

  return <></>;
};

export default Resize;
