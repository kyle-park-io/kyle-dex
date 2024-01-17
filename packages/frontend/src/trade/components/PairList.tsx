import { type Component, type JSX } from 'solid-js';
import { onMount, createSignal, createEffect, For } from 'solid-js';
import { type PairListProps } from '../interfaces/component.interfaces';
import { type Pair2 } from '../interfaces/trade.interface';
import { getPairList } from '../Chart.axios';
import { ListGroup, ListGroupItem, Button } from 'solid-bootstrap';

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

  onMount(() => {
    void test();
  });

  createEffect(() => {
    // void fetchData();
    // props.initConnectStatus();
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
