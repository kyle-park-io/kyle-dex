import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type StakingListProps } from '../interfaces/component.interfaces';
import { getPairList, getTokenContractList } from '../Dex.axios';

import { Form } from 'solid-bootstrap';

import { globalNetwork } from '../../global/global.store';

const [isCalled, setIsCalled] = createSignal(false);

// const [items, setItems] = createSignal<Pair[]>([]);
// const [items, setItems] = createSignal<Pair2[]>([]);
const [items, setItems] = createSignal<string[]>([]);
const [tokens, setTokens] = createSignal<any[]>([]);

export const StakingListSelect: Component<StakingListProps> = (
  props,
): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let api;
  if (env === 'DEV') {
    api = import.meta.env.VITE_DEV_API_URL;
  } else if (env === 'PROD') {
    api = import.meta.env.VITE_PROD_API_URL;
  } else {
    throw new Error('url env error');
  }

  console.log(props);
  const [method, setMethod] = createSignal('t');

  const handleChange = (event): void => {
    setMethod(event.target.value);
  };

  createEffect(() => {
    if (!isCalled()) {
      void test();
      setIsCalled(true);
    }
  });

  async function test(): Promise<void> {
    const data = await getPairList(api, { network: globalNetwork.network });
    const test: any[] = [];
    for (let i = 0; i < data.length; i++) {
      test.push({ pair: data[i].eventData.pair });
      test[i].shortPairAddress = data[i].eventData.pair.slice(0, 10);
    }
    setItems(test);

    const tokens = await getTokenContractList(api, {});
    setTokens(tokens);
  }

  return (
    <>
      <Form>
        <div class="mb-3">
          <Form.Label>Method</Form.Label>
          <Form.Check
            checked
            name="method"
            type="radio"
            label="Select Tokens"
            value="t"
            onChange={handleChange}
          />
          <Form.Check
            name="method"
            type="radio"
            label="Select Pair"
            value="p"
            onChange={handleChange}
          />
        </div>

        <Form.Group class="mb-3" controlId="formBasicEmail">
          {method() === 't' ? (
            <>
              <Form.Label>Token A</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Open this select menu</option>
                <For each={tokens()}>
                  {(token) => (
                    <option value={token.target}>{token.target}</option>
                  )}
                </For>
              </Form.Select>
              <Form.Label>Token B</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Open this select menu</option>
                <For each={tokens()}>
                  {(token) => (
                    <option value={token.target}>{token.target}</option>
                  )}
                </For>
              </Form.Select>
            </>
          ) : (
            <>
              <Form.Label>Pair</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Open this select menu</option>
                <For each={items()}>
                  {(item: any) => (
                    <option value={item.shortPairAddress}>
                      {item.shortPairAddress + '...'}
                    </option>
                  )}
                </For>
              </Form.Select>
            </>
          )}
        </Form.Group>
      </Form>
    </>
  );
};
