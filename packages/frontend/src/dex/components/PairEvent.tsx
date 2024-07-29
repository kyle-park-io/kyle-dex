import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type PairEventProps } from '../interfaces/component.interfaces';
import { getPairEventAll } from '../axios/Dex.axios.pair';
import { ListGroup, ListGroupItem } from 'solid-bootstrap';

import { globalNetwork } from '../../global/global.store';

const [isCalled, setIsCalled] = createSignal(false);

export const PairEvent: Component<PairEventProps> = (props): JSX.Element => {
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
      if (props.currentPair !== '' && globalNetwork.network !== 'null') {
        void test();
      } else {
        setItems([]);
      }
    } else {
      setIsCalled(true);
    }
  });

  async function test(): Promise<void> {
    const data = await getPairEventAll(api, {
      network: globalNetwork.network,
      pairAddress: props.currentPair,
    });
    const test: any[] = [];
    let index = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i].event === 'Sync') {
        continue;
      }
      test.push({ tx: data[i].txHash, event: data[i].event });
      test[index].shortTx = data[i].txHash.slice(0, 10);
      index++;
    }
    setItems(test);
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
