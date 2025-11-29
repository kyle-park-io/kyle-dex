import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type PairListProps } from '../../interfaces/component.interfaces';
// import { type Pair2 } from '../interfaces/trade.interface';
import { useParams } from '@solidjs/router';
import { getPairList } from '../../axios/Dex.axios.pair';
import { ListGroup, ListGroupItem, Button } from 'solid-bootstrap';
import { globalState } from '../../../global/constants';
import {
  setFromPairNavigate,
  setFromPairNavigate2,
} from '../../../global/global.store';
import axios from 'axios';

const [isNetwork, setIsNetwork] = createSignal(false);

// const [items, setItems] = createSignal<Pair[]>([]);
// const [items, setItems] = createSignal<Pair2[]>([]);
const [pairExisted, setPairExisted] = createSignal(false);
const [pairs, setPairs] = createSignal<string[]>([]);
const [pairButtonId, setPairButtonId] = createSignal<number>(-1);

export const PairList: Component<PairListProps> = (props): JSX.Element => {
  const api = globalState.api_url;

  const params = useParams();

  const handlePairButtonClick = (event): void => {
    const id = event.currentTarget.getAttribute('tabIndex');
    if (pairButtonId() === id) {
      setPairButtonId(-1);
      setFromPairNavigate({ value: true });
      setFromPairNavigate2({ value: true });
    } else {
      setPairButtonId(id);
      setFromPairNavigate({ value: true });
      setFromPairNavigate2({ value: true });
    }
  };

  createEffect(() => {
    if (params.id === undefined) {
      setIsNetwork(false);
    } else {
      setIsNetwork(true);
      void getPairs();
    }
  });

  async function getPairs(): Promise<void> {
    try {
      const data = await getPairList(api, {
        network: localStorage.getItem('network') as string,
      });
      const arr: any[] = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({ pair: data[i].eventData.pair });
        arr[i].shortPairAddress = data[i].eventData.pair.slice(0, 10);
      }
      setPairs(arr);
      setPairExisted(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setPairExisted(false);
        }
      }
    }
  }

  return (
    <>
      {!isNetwork() ? (
        <>
          <h3>Pair</h3>
        </>
      ) : (
        <>
          {pairExisted() ? (
            <div class="tw-h-full tw-flex tw-flex-col">
              <h3>Pair</h3>
              <ListGroup class="tw-flex-grow">
                <For each={pairs()}>
                  {(item: any, index) => (
                    <ListGroupItem>
                      <Button
                        tabIndex={index()}
                        style={{
                          background:
                            pairButtonId() == index() ? 'lightblue' : 'white',
                        }}
                        onClick={(event) => {
                          handlePairButtonClick(event);
                          props.handleCurrentPair(item.pair);
                          props.handleCurrentFocusedComponent('PairList');
                        }}
                        class="tw-w-full tw-border-blue-500 tw-text-black hover:tw-text-blue-500"
                      >
                        {item.shortPairAddress + '...'}: {item.timestamp}
                      </Button>
                    </ListGroupItem>
                  )}
                </For>
              </ListGroup>
            </div>
          ) : (
            <>
              <div class="tw-h-full tw-flex tw-flex-col">
                <h3>Pair</h3>
                <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                  No pairs exist on the current network
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
