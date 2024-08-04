import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type PairEventProps } from '../../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { getPairEventAll } from '../../axios/Dex.axios.pair';
import { ListGroup, ListGroupItem, CloseButton } from 'solid-bootstrap';
import { globalState } from '../../../global/constants';
import axios from 'axios';

const [isNetwork, setIsNetwork] = createSignal(false);

const [pairEvents, setPairEvents] = createSignal<any>([]);
const [eventExisted, setEventExisted] = createSignal(false);
const [eventCount, setEventCount] = createSignal(0);

export const PairEvent: Component<PairEventProps> = (props): JSX.Element => {
  const api = globalState.api_url;

  const params = useParams();

  // toggle
  const [eventShow, setEventShow] = createSignal<boolean[]>([false]);
  const toggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < eventCount(); i++) {
      if (i === index) arr.push(!eventShow()[index]);
      else arr.push(false);
    }
    setEventShow(arr);
    props.handleCurrentFocusedComponent('PairEvent');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'PairEvent') {
      toggle2();
    }
  });
  const toggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < eventCount(); i++) {
      arr.push(false);
    }
    setEventShow(arr);
  };

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
      for (let i = 0; i < data.length; i++) {
        if (data[i].event === 'Sync') {
          continue;
        }
        arr.push({ tx: data[i].txHash, event: data[i].event });
        arr[index].shortTx = data[i].txHash.slice(0, 10);
        arr[index].data = JSON.stringify(data[i], undefined, 2);
        index++;
      }
      setPairEvents(arr);
      setEventExisted(true);
      setEventCount(data.length);
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
                      {(item: any, index) => (
                        <div class="tw-flex tw-relative">
                          {eventShow()[index()] && (
                            <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                              <CloseButton onClick={toggle2}></CloseButton>
                              <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                {item.data}
                              </pre>
                            </div>
                          )}
                          <ListGroupItem
                            onClick={() => toggle(index())}
                            class="tw-w-full"
                          >
                            {index() === 0 ? (
                              <>
                                Latest: {item.event}:{item.shortTx + '...'}
                              </>
                            ) : (
                              <>
                                {item.event}:{item.shortTx + '...'}
                              </>
                            )}
                          </ListGroupItem>
                        </div>
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
