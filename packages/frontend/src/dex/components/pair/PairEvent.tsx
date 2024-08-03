import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type PairEventProps } from '../../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { getPairEventAll } from '../../axios/Dex.axios.pair';
import { ListGroup, ListGroupItem } from 'solid-bootstrap';
import { globalState } from '../../../global/constants';
import axios from 'axios';

const [isNetwork, setIsNetwork] = createSignal(false);

const [pairEvents, setPairEvents] = createSignal<any>([]);
const [eventExisted, setEventExisted] = createSignal(false);

export const PairEvent: Component<PairEventProps> = (props): JSX.Element => {
  const api = globalState.api_url;

  const params = useParams();

  createEffect(() => {
    const pair = props.currentPair;
    if (params.id === undefined) {
      setIsNetwork(false);
    } else {
      setIsNetwork(true);
      if (pair !== '') {
        void getEvents();
      } else {
        setPairEvents([]);
      }
    }
  });

  async function getEvents(): Promise<void> {
    try {
      const data = await getPairEventAll(api, {
        network: localStorage.getItem('network') as string,
        pairAddress: props.currentPair,
      });

      const arr: any[] = [];
      let index = 0;
      for (let i = 1; i < data.length; i++) {
        if (data[i].event === 'Sync') {
          continue;
        }
        arr.push({ tx: data[i].txHash, event: data[i].event });
        arr[index].shortTx = data[i].txHash.slice(0, 10);
        index++;
      }
      setPairEvents(arr);
      setEventExisted(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setPairEvents([]);
          setEventExisted(false);
        }
      }
    }
  }

  return (
    <>
      {!isNetwork() ? (
        <>
          <h3>Pair Event</h3>
        </>
      ) : (
        <>
          <div class="tw-h-full tw-flex tw-flex-col">
            <h3>Pair Event</h3>
            {props.currentPair === '' ? (
              <>
                <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                  Select pair please!
                </div>
              </>
            ) : (
              <>
                {eventExisted() ? (
                  <ListGroup class="tw-flex-grow">
                    <For each={pairEvents()}>
                      {(item: any) => (
                        <ListGroupItem>
                          {item.event}:{item.shortTx + '...'}
                        </ListGroupItem>
                      )}
                    </For>
                  </ListGroup>
                ) : (
                  <>
                    <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                      해당 이벤트가 없습니다
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
