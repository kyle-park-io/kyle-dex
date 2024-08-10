import { type Component, type JSX } from 'solid-js';
import { createSignal } from 'solid-js';

const [test, setTest] = createSignal('');

const handleTest = (e) => {
  console.log(e);
};

console.log(test, setTest, handleTest);

const Test: Component = (): JSX.Element => {
  return <></>;
};

export default Test;
