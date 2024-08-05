import { onMount, type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type ClientPairProps } from '../../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import {
  getClientPairEvent,
  getClientPairsEvent,
} from '../../axios/Dex.axios.client';
import { ListGroup, ListGroupItem, CloseButton } from 'solid-bootstrap';
import { globalState } from '../../../global/constants';
import {
  fromHeaderNavigate,
  setFromHeaderNavigate,
} from '../../../global/global.store';
import axios from 'axios';

const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);

const [currentEvent, setCurrentEvent] = createSignal('my-all-event');

const [eventExisted, setEventExisted] = createSignal(false);

// pair
const [pairEvents, setPairEvents] = createSignal<any>([]);
const [pairEventCount, setPairEventCount] = createSignal(0);
const [pairMintEvents, setPairMintEvents] = createSignal<any>([]);
const [pairMintEventCount, setPairMintEventCount] = createSignal(0);
const [pairBurnEvents, setPairBurnEvents] = createSignal<any>([]);
const [pairBurnEventCount, setPairBurnEventCount] = createSignal(0);
const [pairSwapEvents, setPairSwapEvents] = createSignal<any>([]);
const [pairSwapEventCount, setPairSwapEventCount] = createSignal(0);

// pairs
const [pairsEvents, setPairsEvents] = createSignal<any>([]);
const [pairsEventCount, setPairsEventCount] = createSignal(0);
const [pairsMintEvents, setPairsMintEvents] = createSignal<any>([]);
const [pairsMintEventCount, setPairsMintEventCount] = createSignal(0);
const [pairsBurnEvents, setPairsBurnEvents] = createSignal<any>([]);
const [pairsBurnEventCount, setPairsBurnEventCount] = createSignal(0);
const [pairsSwapEvents, setPairsSwapEvents] = createSignal<any>([]);
const [pairsSwapEventCount, setPairsSwapEventCount] = createSignal(0);

export const ClientPair: Component<ClientPairProps> = (props): JSX.Element => {
  const api = globalState.api_url;

  const params = useParams();

  // toggle
  const [pairEventShow, setPairEventShow] = createSignal<boolean[]>([false]);
  const pairToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairEventCount(); i++) {
      if (i === index) arr.push(!pairEventShow()[index]);
      else arr.push(false);
    }
    setPairEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairToggle2();
    }
  });
  const pairToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairEventCount(); i++) {
      arr.push(false);
    }
    setPairEventShow(arr);
  };

  // mint toggle
  const [pairMintEventShow, setPairMintEventShow] = createSignal<boolean[]>([
    false,
  ]);
  const pairMintToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairMintEventCount(); i++) {
      if (i === index) arr.push(!pairMintEventShow()[index]);
      else arr.push(false);
    }
    setPairMintEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairMintToggle2();
    }
  });
  const pairMintToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairMintEventCount(); i++) {
      arr.push(false);
    }
    setPairMintEventShow(arr);
  };

  // burn toggle
  const [pairBurnEventShow, setPairBurnEventShow] = createSignal<boolean[]>([
    false,
  ]);
  const pairBurnToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairBurnEventCount(); i++) {
      if (i === index) arr.push(!pairBurnEventShow()[index]);
      else arr.push(false);
    }
    setPairBurnEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairBurnToggle2();
    }
  });
  const pairBurnToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairBurnEventCount(); i++) {
      arr.push(false);
    }
    setPairBurnEventShow(arr);
  };

  // swap toggle
  const [pairSwapEventShow, setPairSwapEventShow] = createSignal<boolean[]>([
    false,
  ]);
  const pairSwapToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairSwapEventCount(); i++) {
      if (i === index) arr.push(!pairSwapEventShow()[index]);
      else arr.push(false);
    }
    setPairSwapEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairSwapToggle2();
    }
  });
  const pairSwapToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairSwapEventCount(); i++) {
      arr.push(false);
    }
    setPairSwapEventShow(arr);
  };

  // toggle
  const [pairsEventShow, setPairsEventShow] = createSignal<boolean[]>([false]);
  const pairsToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsEventCount(); i++) {
      if (i === index) arr.push(!pairsEventShow()[index]);
      else arr.push(false);
    }
    setPairsEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairsToggle2();
    }
  });
  const pairsToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsEventCount(); i++) {
      arr.push(false);
    }
    setPairsEventShow(arr);
  };

  // mint toggle
  const [pairsMintEventShow, setPairsMintEventShow] = createSignal<boolean[]>([
    false,
  ]);
  const pairsMintToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsMintEventCount(); i++) {
      if (i === index) arr.push(!pairsMintEventShow()[index]);
      else arr.push(false);
    }
    setPairsMintEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairsMintToggle2();
    }
  });
  const pairsMintToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsMintEventCount(); i++) {
      arr.push(false);
    }
    setPairsMintEventShow(arr);
  };

  // burn toggle
  const [pairsBurnEventShow, setPairsBurnEventShow] = createSignal<boolean[]>([
    false,
  ]);
  const pairsBurnToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsBurnEventCount(); i++) {
      if (i === index) arr.push(!pairsBurnEventShow()[index]);
      else arr.push(false);
    }
    setPairsBurnEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairsBurnToggle2();
    }
  });
  const pairsBurnToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsBurnEventCount(); i++) {
      arr.push(false);
    }
    setPairsBurnEventShow(arr);
  };

  // swap toggle
  const [pairsSwapEventShow, setPairsSwapEventShow] = createSignal<boolean[]>([
    false,
  ]);
  const pairsSwapToggle = (index: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsSwapEventCount(); i++) {
      if (i === index) arr.push(!pairsSwapEventShow()[index]);
      else arr.push(false);
    }
    setPairsSwapEventShow(arr);
    props.handleCurrentFocusedComponent('ClientPair');
  };
  createEffect(() => {
    const current = props.currentFocusedComponent;
    if (current !== 'ClientPair') {
      pairsSwapToggle2();
    }
  });
  const pairsSwapToggle2 = () => {
    const arr: boolean[] = [];
    for (let i = 0; i < pairsSwapEventCount(); i++) {
      arr.push(false);
    }
    setPairsSwapEventShow(arr);
  };

  createEffect(() => {
    const pair = props.currentPair;
    if (fromHeaderNavigate.value) {
      if (params.id === undefined) {
        setIsNetwork(false);
        setIsAccount(false);
      } else {
        setIsNetwork(true);
        if (pair !== '') {
          if ((localStorage.getItem('address') as string) !== 'null') {
            void getPairsEvents();
            void getPairEvents();
            setIsAccount(true);
          } else {
            setIsAccount(false);
          }
        } else {
          setPairEvents([]);
          setPairMintEvents([]);
          setPairBurnEvents([]);
          setPairSwapEvents([]);
          setPairEventCount(0);
          setPairMintEventCount(0);
          setPairSwapEventCount(0);
          setPairBurnEventCount(0);
        }
      }
      setFromHeaderNavigate({ value: false });
    } else {
      setIsNetwork(true);
      if (pair !== '') {
        if ((localStorage.getItem('address') as string) !== 'null') {
          void getPairEvents();
          setIsAccount(true);
        } else {
          setIsAccount(false);
        }
      } else {
        setPairEvents([]);
        setPairMintEvents([]);
        setPairBurnEvents([]);
        setPairSwapEvents([]);
        setPairEventCount(0);
        setPairMintEventCount(0);
        setPairSwapEventCount(0);
        setPairBurnEventCount(0);
      }
    }
  });
  async function getPairEvents(): Promise<void> {
    try {
      const data = await getClientPairEvent(api, {
        network: localStorage.getItem('network') as string,
        userAddress: localStorage.getItem('address') as string,
        pairAddress: props.currentPair,
      });

      const arr: any[] = [];
      const mintArr: any[] = [];
      const burnArr: any[] = [];
      const swapArr: any[] = [];
      let mintIndex = 0;
      let burnIndex = 0;
      let swapIndex = 0;
      for (let i = 0; i < data.length; i++) {
        arr.push({ tx: data[i].txHash, event: data[i].event });
        arr[i].shortTx = data[i].txHash.slice(0, 10);
        arr[i].data = JSON.stringify(data[i], undefined, 2);
        if (data[i].event === 'Mint') {
          mintArr.push(arr[i]);
          mintIndex++;
        }
        if (data[i].event === 'Burn') {
          burnArr.push(arr[i]);
          burnIndex++;
        }
        if (data[i].event === 'Swap') {
          swapArr.push(arr[i]);
          swapIndex++;
        }
      }
      setPairEvents(arr);
      setPairMintEvents(mintArr);
      setPairBurnEvents(burnArr);
      setPairSwapEvents(swapArr);

      setPairEventCount(data.length);
      setPairMintEventCount(mintIndex);
      setPairBurnEventCount(burnIndex);
      setPairSwapEventCount(swapIndex);

      // setEventExisted(true);
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

          // setEventExisted(false);
        }
      }
    }
  }

  onMount(() => {
    if (params.id === undefined) {
      setIsNetwork(false);
      setIsAccount(false);
    } else {
      setIsNetwork(true);
      if ((localStorage.getItem('address') as string) !== 'null') {
        void getPairsEvents();
        setIsAccount(true);
      } else {
        setIsAccount(false);
      }
    }
  });
  async function getPairsEvents(): Promise<void> {
    try {
      const data = await getClientPairsEvent(api, {
        network: localStorage.getItem('network') as string,
        userAddress: localStorage.getItem('address') as string,
      });

      const arr: any[] = [];
      const mintArr: any[] = [];
      const burnArr: any[] = [];
      const swapArr: any[] = [];
      let mintIndex = 0;
      let burnIndex = 0;
      let swapIndex = 0;
      for (let i = 0; i < data.length; i++) {
        arr.push({ tx: data[i].txHash, event: data[i].event });
        arr[i].shortTx = data[i].txHash.slice(0, 10);
        arr[i].data = JSON.stringify(data[i], undefined, 2);
        if (data[i].event === 'Mint') {
          mintArr.push(arr[i]);
          mintIndex++;
        }
        if (data[i].event === 'Burn') {
          burnArr.push(arr[i]);
          burnIndex++;
        }
        if (data[i].event === 'Swap') {
          swapArr.push(arr[i]);
          swapIndex++;
        }
      }
      setPairsEvents(arr);
      setPairsMintEvents(mintArr);
      setPairsBurnEvents(burnArr);
      setPairsSwapEvents(swapArr);

      setPairsEventCount(data.length);
      setPairsMintEventCount(mintIndex);
      setPairsBurnEventCount(burnIndex);
      setPairsSwapEventCount(swapIndex);

      setEventExisted(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setPairsEvents([]);
          setPairsMintEvents([]);
          setPairsBurnEvents([]);
          setPairsSwapEvents([]);
          setPairsEventCount(0);
          setPairsMintEventCount(0);
          setPairsSwapEventCount(0);
          setPairsBurnEventCount(0);

          setEventExisted(false);
        }
      }
    }
  }

  createEffect(() => {
    const event = props.currentMyEvent;
    pairToggle2();
    pairMintToggle2();
    pairBurnToggle2();
    pairSwapToggle2();
    pairsToggle2();
    pairsMintToggle2();
    pairsBurnToggle2();
    pairsSwapToggle2();
    setCurrentEvent(event);
  });

  return (
    <>
      {!isNetwork() ? (
        <>
          <h3>My Event</h3>
        </>
      ) : (
        <>
          <div class="tw-h-full tw-flex tw-flex-col">
            <h3>My Event</h3>
            {/* {props.currentPair === '' ? (
              <>
                <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                  Select pair please!
                </div>
              </>
            ) : (
              <></>
            )} */}
            {!isAccount() ? (
              <>
                <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                  Select account please!
                </div>
              </>
            ) : (
              <>
                {eventExisted() ? (
                  <ListGroup class="tw-flex-grow">
                    <>
                      {currentEvent() === 'my-all-event' ? (
                        <>
                          <For each={pairsEvents()}>
                            {(item: any, index) => (
                              <div class="tw-flex tw-relative">
                                {pairsEventShow()[index()] && (
                                  <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                    <CloseButton
                                      onClick={pairsToggle2}
                                    ></CloseButton>
                                    <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                      {item.data}
                                    </pre>
                                  </div>
                                )}
                                <ListGroupItem
                                  onClick={() => {
                                    pairsMintToggle2();
                                    pairsBurnToggle2();
                                    pairsSwapToggle2();
                                    pairToggle2();
                                    pairMintToggle2();
                                    pairBurnToggle2();
                                    pairSwapToggle2();
                                    pairsToggle(index());
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
                          {currentEvent() === 'my-event-Mint' ? (
                            <>
                              {pairsMintEventCount() === 0 ? (
                                <>
                                  <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                    Mint 이벤트가 없습니다
                                  </div>
                                </>
                              ) : (
                                <>
                                  <For each={pairsMintEvents()}>
                                    {(item: any, index) => (
                                      <div class="tw-flex tw-relative">
                                        {pairsMintEventShow()[index()] && (
                                          <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                            <CloseButton
                                              onClick={pairsMintToggle2}
                                            ></CloseButton>
                                            <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                              {item.data}
                                            </pre>
                                          </div>
                                        )}
                                        <ListGroupItem
                                          onClick={() => {
                                            pairsToggle2();
                                            pairsBurnToggle2();
                                            pairsSwapToggle2();
                                            pairToggle2();
                                            pairMintToggle2();
                                            pairBurnToggle2();
                                            pairSwapToggle2();
                                            pairsMintToggle(index());
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
                              {currentEvent() === 'my-event-Burn' ? (
                                <>
                                  {pairsBurnEventCount() === 0 ? (
                                    <>
                                      <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                        Burn 이벤트가 없습니다
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <For each={pairsBurnEvents()}>
                                        {(item: any, index) => (
                                          <div class="tw-flex tw-relative">
                                            {pairsBurnEventShow()[index()] && (
                                              <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                <CloseButton
                                                  onClick={pairsBurnToggle2}
                                                ></CloseButton>
                                                <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                  {item.data}
                                                </pre>
                                              </div>
                                            )}
                                            <ListGroupItem
                                              onClick={() => {
                                                pairsToggle2();
                                                pairsMintToggle2();
                                                pairsSwapToggle2();
                                                pairToggle2();
                                                pairMintToggle2();
                                                pairBurnToggle2();
                                                pairSwapToggle2();
                                                pairsBurnToggle(index());
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
                                  {currentEvent() === 'my-event-Swap' ? (
                                    <>
                                      {pairsSwapEventCount() === 0 ? (
                                        <>
                                          <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                            Swap 이벤트가 없습니다
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <For each={pairsSwapEvents()}>
                                            {(item: any, index) => (
                                              <div class="tw-flex tw-relative">
                                                {pairsSwapEventShow()[
                                                  index()
                                                ] && (
                                                  <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                    <CloseButton
                                                      onClick={pairsSwapToggle2}
                                                    ></CloseButton>
                                                    <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                      {item.data}
                                                    </pre>
                                                  </div>
                                                )}
                                                <ListGroupItem
                                                  onClick={() => {
                                                    pairsToggle2();
                                                    pairsMintToggle2();
                                                    pairsBurnToggle2();
                                                    pairToggle2();
                                                    pairMintToggle2();
                                                    pairBurnToggle2();
                                                    pairSwapToggle2();
                                                    pairsSwapToggle(index());
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
                                      {currentEvent() ===
                                      'my-pair-all-event' ? (
                                        <>
                                          {pairEventCount() === 0 ? (
                                            <>
                                              {props.currentPair === '' ? (
                                                <>
                                                  <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                                    Select pair please!
                                                  </div>
                                                </>
                                              ) : (
                                                <>
                                                  <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                                    해당 Pair 이벤트가 없습니다
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              <For each={pairEvents()}>
                                                {(item: any, index) => (
                                                  <div class="tw-flex tw-relative">
                                                    {pairEventShow()[
                                                      index()
                                                    ] && (
                                                      <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                        <CloseButton
                                                          onClick={pairToggle2}
                                                        ></CloseButton>
                                                        <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                          {item.data}
                                                        </pre>
                                                      </div>
                                                    )}
                                                    <ListGroupItem
                                                      onClick={() => {
                                                        pairsToggle2();
                                                        pairsMintToggle2();
                                                        pairsBurnToggle2();
                                                        pairsSwapToggle2();
                                                        pairMintToggle2();
                                                        pairBurnToggle2();
                                                        pairSwapToggle2();
                                                        pairToggle(index());
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
                                          {currentEvent() ===
                                          'my-pair-event-Mint' ? (
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
                                                        {pairMintEventShow()[
                                                          index()
                                                        ] && (
                                                          <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                            <CloseButton
                                                              onClick={
                                                                pairMintToggle2
                                                              }
                                                            ></CloseButton>
                                                            <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                              {item.data}
                                                            </pre>
                                                          </div>
                                                        )}
                                                        <ListGroupItem
                                                          onClick={() => {
                                                            pairsToggle2();
                                                            pairsMintToggle2();
                                                            pairsBurnToggle2();
                                                            pairsSwapToggle2();
                                                            pairToggle2();
                                                            pairBurnToggle2();
                                                            pairSwapToggle2();
                                                            pairMintToggle(
                                                              index(),
                                                            );
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
                                                              Latest:{' '}
                                                              {item.event}:
                                                              {item.shortTx +
                                                                '...'}
                                                            </>
                                                          ) : (
                                                            <>
                                                              {item.event}:
                                                              {item.shortTx +
                                                                '...'}
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
                                              {currentEvent() ===
                                              'my-pair-event-Burn' ? (
                                                <>
                                                  {pairBurnEventCount() ===
                                                  0 ? (
                                                    <>
                                                      <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                                        Burn 이벤트가 없습니다
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <For
                                                        each={pairBurnEvents()}
                                                      >
                                                        {(item: any, index) => (
                                                          <div class="tw-flex tw-relative">
                                                            {pairBurnEventShow()[
                                                              index()
                                                            ] && (
                                                              <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                                <CloseButton
                                                                  onClick={
                                                                    pairBurnToggle2
                                                                  }
                                                                ></CloseButton>
                                                                <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                                  {item.data}
                                                                </pre>
                                                              </div>
                                                            )}
                                                            <ListGroupItem
                                                              onClick={() => {
                                                                pairsToggle2();
                                                                pairsMintToggle2();
                                                                pairsBurnToggle2();
                                                                pairsSwapToggle2();
                                                                pairToggle2();
                                                                pairMintToggle2();
                                                                pairSwapToggle2();
                                                                pairBurnToggle(
                                                                  index(),
                                                                );
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
                                                                  Latest:{' '}
                                                                  {item.event}:
                                                                  {item.shortTx +
                                                                    '...'}
                                                                </>
                                                              ) : (
                                                                <>
                                                                  {item.event}:
                                                                  {item.shortTx +
                                                                    '...'}
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
                                                  {pairSwapEventCount() ===
                                                  0 ? (
                                                    <>
                                                      <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                                                        Swap 이벤트가 없습니다
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <For
                                                        each={pairSwapEvents()}
                                                      >
                                                        {(item: any, index) => (
                                                          <div class="tw-flex tw-relative">
                                                            {pairSwapEventShow()[
                                                              index()
                                                            ] && (
                                                              <div class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-50">
                                                                <CloseButton
                                                                  onClick={
                                                                    pairSwapToggle2
                                                                  }
                                                                ></CloseButton>
                                                                <pre class="tw-bg-white tw-whitespace-pre-wrap">
                                                                  {item.data}
                                                                </pre>
                                                              </div>
                                                            )}
                                                            <ListGroupItem
                                                              onClick={() => {
                                                                pairsToggle2();
                                                                pairsMintToggle2();
                                                                pairsBurnToggle2();
                                                                pairsSwapToggle2();
                                                                pairToggle2();
                                                                pairMintToggle2();
                                                                pairBurnToggle2();
                                                                pairSwapToggle(
                                                                  index(),
                                                                );
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
                                                                  Latest:{' '}
                                                                  {item.event}:
                                                                  {item.shortTx +
                                                                    '...'}
                                                                </>
                                                              ) : (
                                                                <>
                                                                  {item.event}:
                                                                  {item.shortTx +
                                                                    '...'}
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
