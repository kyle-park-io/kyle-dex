import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type PairListProps } from '../interfaces/component.interfaces';
// import { type Pair2 } from '../interfaces/trade.interface';
import { getPairList } from '../axios/Dex.axios.pair';
import { ListGroup, ListGroupItem, Button } from 'solid-bootstrap';

import { globalNetwork } from '../../global/global.store';

const [isCalled, setIsCalled] = createSignal(false);

// const [items, setItems] = createSignal<Pair[]>([]);
// const [items, setItems] = createSignal<Pair2[]>([]);
const [items, setItems] = createSignal<string[]>([]);

export const PairList: Component<PairListProps> = (props): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let api;
  if (env === 'DEV') {
    api = import.meta.env.VITE_DEV_API_URL;
  } else if (env === 'PROD') {
    api = import.meta.env.VITE_PROD_API_URL;
  } else {
    throw new Error('url env error');
  }

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
  }

  return (
    <div>
      <ListGroup>
        <For each={items()}>
          {(item: any) => (
            <ListGroupItem>
              <Button
                variant="outline-primary"
                onClick={() => {
                  props.handleCurrentPair(item.pair);
                }}
              >
                {item.shortPairAddress + '...'}: {item.timestamp}
              </Button>
            </ListGroupItem>
          )}
        </For>
      </ListGroup>
    </div>
  );
};
