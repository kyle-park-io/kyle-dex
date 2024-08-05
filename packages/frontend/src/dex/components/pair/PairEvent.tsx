import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type PairEventProps } from '../../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { getPairEventAll } from '../../axios/Dex.axios.pair';
import { ListGroup, ListGroupItem, CloseButton } from 'solid-bootstrap';
import { globalState } from '../../../global/constants';
import axios from 'axios';

const [isNetwork, setIsNetwork] = createSignal(false);

const [currentEvent, setCurrentEvent] = createSignal('pair-all-event');

const [eventExisted, setEventExisted] = createSignal(false);

const [pairEvents, setPairEvents] = createSignal<any>([]);
const [pairEventCount, setPairEventCount] = createSignal(0);
const [pairMintEvents, setPairMintEvents] = createSignal<any>([]);
const [pairMintEventCount, setPairMintEventCount] = createSignal(0);
const [pairBurnEvents, setPairBurnEvents] = createSignal<any>([]);
const [pairBurnEventCount, setPairBurnEventCount] = createSignal(0);
const [pairSwapEvents, setPairSwapEvents] = createSignal<any>([]);
const [pairSwapEventCount, setPairSwapEventCount] = createSignal(0);

export const PairEvent: Component<PairEventProps> = (props): JSX.Element => {
  const api = globalState.api_url;

  const params = useParams();

  // toggle
  const [pairEventShow, setPairEventShow] = createSignal<boolean[]>([false]);
  const toggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairEventCount(); i++) {
      if (i === index) arr.push(!pairEventShow()[index]);
      else arr.push(false);
    }
    setPairEventShow(arr);
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
    for (let i = 0; i < pairEventCount(); i++) {
      arr.push(false);
    }
    setPairEventShow(arr);
  };

  // mint toggle
  const [mintEventShow, setMintEventShow] = createSignal<boolean[]>([false]);
  const mintToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairMintEventCount(); i++) {
      if (i === index) arr.push(!mintEventShow()[index]);
      else arr.push(false);
    }
    setMintEventShow(arr);
    props.handleCurrentFocusedComponent('PairEvent');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'PairEvent') {
      mintToggle2();
    }
  });
  const mintToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairMintEventCount(); i++) {
      arr.push(false);
    }
    setMintEventShow(arr);
  };

  // burn toggle
  const [burnEventShow, setBurnEventShow] = createSignal<boolean[]>([false]);
  const burnToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairBurnEventCount(); i++) {
      if (i === index) arr.push(!burnEventShow()[index]);
      else arr.push(false);
    }
    setBurnEventShow(arr);
    props.handleCurrentFocusedComponent('PairEvent');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'PairEvent') {
      burnToggle2();
    }
  });
  const burnToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairBurnEventCount(); i++) {
      arr.push(false);
    }
    setBurnEventShow(arr);
  };

  // swap toggle
  const [swapEventShow, setSwapEventShow] = createSignal<boolean[]>([false]);
  const swapToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairSwapEventCount(); i++) {
      if (i === index) arr.push(!swapEventShow()[index]);
      else arr.push(false);
    }
    setSwapEventShow(arr);
    props.handleCurrentFocusedComponent('PairEvent');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'PairEvent') {
      swapToggle2();
    }
  });
  const swapToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairSwapEventCount(); i++) {
      arr.push(false);
    }
    setSwapEventShow(arr);
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
        setPairEventCount(0);
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
      const mintArr: any[] = [];
      const burnArr: any[] = [];
      const swapArr: any[] = [];
      let index = 0;
      let mintIndex = 0;
      let burnIndex = 0;
      let swapIndex = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].event === 'Sync') {
          continue;
        }
        arr.push({ tx: data[i].txHash, event: data[i].event });
        arr[index].shortTx = data[i].txHash.slice(0, 10);
        arr[index].data = JSON.stringify(data[i], undefined, 2);
        if (data[i].event === 'Mint') {
          mintArr.push(arr[index]);
          mintIndex++;
        }
        if (data[i].event === 'Burn') {
          burnArr.push(arr[index]);
          burnIndex++;
        }
        if (data[i].event === 'Swap') {
          swapArr.push(arr[index]);
          swapIndex++;
        }
        index++;
      }
      setPairEvents(arr);
      setPairMintEvents(mintArr);
      setPairBurnEvents(burnArr);
      setPairSwapEvents(swapArr);

      setPairEventCount(index);
      setPairMintEventCount(mintIndex);
      setPairBurnEventCount(burnIndex);
      setPairSwapEventCount(swapIndex);

      setEventExisted(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setPairEvents([]);
          setPairMintEvents([]);
          setPairBurnEvents([]);
          setPairSwapEvents([]);
          setPairEventCount(0);
          setPairMintEventCount(0);
          setPairSwapEventCount(0);
          setPairBurnEventCount(0);

          setEventExisted(false);
        }
      }
    }
  }

  createEffect(() => {
    const event = props.currentPairEvent;
    toggle2();
    mintToggle2();
    burnToggle2();
    swapToggle2();
    setCurrentEvent(event);
  });

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
                    <>
                      {currentEvent() === 'pair-all-event' ? (
                        <>
                          <For each={pairEvents()}>
                            {(item: any, index) => (
                              <div class="tw-flex tw-relative">
                                {pairEventShow()[index()] && (
                                  <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                    <CloseButton
                                      onClick={toggle2}
                                    ></CloseButton>
                                    <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                      {item.data}
                                    </pre>
                                  </div>
                                )}
                                <ListGroupItem
                                  onClick={() => {
                                    mintToggle2();
                                    burnToggle2();
                                    swapToggle2();
                                    toggle(index());
                                  }}
                                  class="tw-w-full"
                                  style={{
                                    background:
                                      index() === 0 ? 'lightyellow' : 'white',
                                  }}
                                >
                                  {index() === 0 ? (
                                    <>
                                      Latest: {item.event}:
                                      {item.shortTx + '...'}
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
                        </>
                      ) : (
                        <>
                          {currentEvent() === 'pair-event-Mint' ? (
                            <>
                              {pairMintEventCount() === 0 ? (
                                <>
                                  <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                    Mint 이벤트가 없습니다
                                  </div>
                                </>
                              ) : (
                                <>
                                  <For each={pairMintEvents()}>
                                    {(item: any, index) => (
                                      <div class="tw-flex tw-relative">
                                        {mintEventShow()[index()] && (
                                          <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                            <CloseButton
                                              onClick={mintToggle2}
                                            ></CloseButton>
                                            <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                              {item.data}
                                            </pre>
                                          </div>
                                        )}
                                        <ListGroupItem
                                          onClick={() => {
                                            toggle2();
                                            burnToggle2();
                                            swapToggle2();
                                            mintToggle(index());
                                          }}
                                          class="tw-w-full"
                                          style={{
                                            background:
                                              index() === 0
                                                ? 'lightyellow'
                                                : 'white',
                                          }}
                                        >
                                          {index() === 0 ? (
                                            <>
                                              Latest: {item.event}:
                                              {item.shortTx + '...'}
                                            </>
                                          ) : (
                                            <>
                                              {item.event}:
                                              {item.shortTx + '...'}
                                            </>
                                          )}
                                        </ListGroupItem>
                                      </div>
                                    )}
                                  </For>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {currentEvent() === 'pair-event-Burn' ? (
                                <>
                                  {pairBurnEventCount() === 0 ? (
                                    <>
                                      <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                        Burn 이벤트가 없습니다
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <For each={pairBurnEvents()}>
                                        {(item: any, index) => (
                                          <div class="tw-flex tw-relative">
                                            {burnEventShow()[index()] && (
                                              <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                <CloseButton
                                                  onClick={burnToggle2}
                                                ></CloseButton>
                                                <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                  {item.data}
                                                </pre>
                                              </div>
                                            )}
                                            <ListGroupItem
                                              onClick={() => {
                                                toggle2();
                                                mintToggle2();
                                                swapToggle2();
                                                burnToggle(index());
                                              }}
                                              class="tw-w-full"
                                              style={{
                                                background:
                                                  index() === 0
                                                    ? 'lightyellow'
                                                    : 'white',
                                              }}
                                            >
                                              {index() === 0 ? (
                                                <>
                                                  Latest: {item.event}:
                                                  {item.shortTx + '...'}
                                                </>
                                              ) : (
                                                <>
                                                  {item.event}:
                                                  {item.shortTx + '...'}
                                                </>
                                              )}
                                            </ListGroupItem>
                                          </div>
                                        )}
                                      </For>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {pairSwapEventCount() === 0 ? (
                                    <>
                                      <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                        Swap 이벤트가 없습니다
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <For each={pairSwapEvents()}>
                                        {(item: any, index) => (
                                          <div class="tw-flex tw-relative">
                                            {swapEventShow()[index()] && (
                                              <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                <CloseButton
                                                  onClick={swapToggle2}
                                                ></CloseButton>
                                                <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                  {item.data}
                                                </pre>
                                              </div>
                                            )}
                                            <ListGroupItem
                                              onClick={() => {
                                                toggle2();
                                                mintToggle2();
                                                burnToggle2();
                                                swapToggle(index());
                                              }}
                                              class="tw-w-full"
                                              style={{
                                                background:
                                                  index() === 0
                                                    ? 'lightyellow'
                                                    : 'white',
                                              }}
                                            >
                                              {index() === 0 ? (
                                                <>
                                                  Latest: {item.event}:
                                                  {item.shortTx + '...'}
                                                </>
                                              ) : (
                                                <>
                                                  {item.event}:
                                                  {item.shortTx + '...'}
                                                </>
                                              )}
                                            </ListGroupItem>
                                          </div>
                                        )}
                                      </For>
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
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
