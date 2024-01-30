import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type PairListProps } from '../interfaces/component.interfaces';
import { type Pair2 } from '../interfaces/trade.interface';
import { getPairList } from '../Dex.axios';
import { ListGroup, ListGroupItem, Button } from 'solid-bootstrap';

const [isCalled, setIsCalled] = createSignal(false);

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

  // const [items, setItems] = createSignal<Pair[]>([]);
  const [items, setItems] = createSignal<Pair2[]>([]);

  createEffect(() => {
    if (!isCalled()) {
      void test();
      setIsCalled(true);
    }
  });

  async function test(): Promise<void> {
    const data = await getPairList(api, { network: 'hardhat' });
    const test: Pair2[] = [];
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].pair);
      test.push(data[i]);
      test[i].shortPairAddress = data[i].pair.slice(0, 5);
    }
    setItems(test);
  }

  return (
    <div>
      <ListGroup>
        <For each={items()}>
          {(item) => (
            <ListGroupItem>
              <Button
                variant="outline-primary"
                onClick={() => {
                  props.changePair(item.pair);
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
