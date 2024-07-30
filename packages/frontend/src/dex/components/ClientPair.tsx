import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type ClientPairProps } from '../interfaces/component.interfaces';
import { getClientPairEvent } from '../axios/Dex.axios.client';
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

  const [items, setItems] = createSignal<any>([]);

  createEffect(() => {
    if (isCalled()) {
      if (
        props.currentPair !== '' &&
        (localStorage.getItem('network') as string) !== 'null' &&
        (localStorage.getItem('address') as string) !== 'null'
      ) {
        void test();
      } else {
        setItems([]);
      }
    } else {
      setIsCalled(true);
    }
  });

  async function test(): Promise<void> {
    try {
      const data = await getClientPairEvent(api, {
        network: localStorage.getItem('network') as string,
        userAddress: localStorage.getItem('address') as string,
        pairAddress: props.currentPair,
      });

      const test: any[] = [];
      for (let i = 1; i < data.length; i++) {
        test.push({ tx: data[i].txHash, event: data[i].event });
        test[i - 1].shortTx = data[i].txHash.slice(0, 10);
      }
      setItems(test);
    } catch (err) {
      setItems([]);
    }
  }

  return (
    <div>
      <ListGroup>
        <For each={items()}>
          {(item: any) => (
            <ListGroupItem>
              {item.event}:{item.shortTx + '...'}
            </ListGroupItem>
          )}
        </For>
      </ListGroup>
    </div>
  );
};
