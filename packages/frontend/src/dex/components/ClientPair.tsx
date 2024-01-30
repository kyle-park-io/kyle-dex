import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type ClientPairProps } from '../interfaces/component.interfaces';
import { getClientPair } from '../Dex.axios';
import { ListGroup, ListGroupItem } from 'solid-bootstrap';

const [isCalled, setIsCalled] = createSignal(false);

export const ClientPair: Component<ClientPairProps> = (props): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let api;
  if (env === 'DEV') {
    api = import.meta.env.VITE_DEV_API_URL;
  } else if (env === 'PROD') {
    api = import.meta.env.VITE_PROD_API_URL;
  } else {
    throw new Error('url env error');
  }

  const [items, setItems] = createSignal([]);

  createEffect(() => {
    setIsCalled(true);
    if (!isCalled()) {
      if (props.currentPair !== '') {
        void test();
        setIsCalled(true);
      }
    }
    if (props.currentPair !== '' && props.currentAccount !== '') {
      void test();
    }
  });

  async function test(): Promise<void> {
    const data = await getClientPair(api, {
      network: 'hardhat',
      userAddress: props.currentAccount,
      pairAddress: props.currentPair,
    });
    for (let i = 0; i < data.length; i++) {
      data[i].shortPairAddress = data[i].pair.slice(0, 5);
    }
    setItems(data);
  }

  return (
    <div>
      <ListGroup>
        <For each={items()}>
          {(item: any) => (
            <ListGroupItem>
              {item.event}:{item.shortPairAddress + '...'}
            </ListGroupItem>
          )}
        </For>
      </ListGroup>
    </div>
  );
};
