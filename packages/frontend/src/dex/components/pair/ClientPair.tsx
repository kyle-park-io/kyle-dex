import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type ClientPairProps } from '../../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { getClientPairEvent } from '../../axios/Dex.axios.client';
import { ListGroup, ListGroupItem } from 'solid-bootstrap';
import { globalState } from '../../../global/constants';
import {
  fromHeaderNavigate,
  setFromHeaderNavigate,
} from '../../../global/global.store';
import axios from 'axios';

const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);

const [pairEvents, setPairEvents] = createSignal<any>([]);
const [eventExisted, setEventExisted] = createSignal(false);

export const ClientPair: Component<ClientPairProps> = (props): JSX.Element => {
  const api = globalState.api_url;

  const params = useParams();

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
            void getEvents();
            setIsAccount(true);
          } else {
            setIsAccount(false);
          }
        } else {
          setPairEvents([]);
        }
      }
      setFromHeaderNavigate({ value: false });
    } else {
      setIsNetwork(true);
      if (pair !== '') {
        if ((localStorage.getItem('address') as string) !== 'null') {
          void getEvents();
          setIsAccount(true);
        } else {
          setIsAccount(false);
        }
      } else {
        setPairEvents([]);
      }
    }
  });

  async function getEvents(): Promise<void> {
    try {
      const data = await getClientPairEvent(api, {
        network: localStorage.getItem('network') as string,
        userAddress: localStorage.getItem('address') as string,
        pairAddress: props.currentPair,
      });
      const arr: any[] = [];
      for (let i = 1; i < data.length; i++) {
        arr.push({ tx: data[i].txHash, event: data[i].event });
        arr[i - 1].shortTx = data[i].txHash.slice(0, 10);
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
          <h3>My Event</h3>
        </>
      ) : (
        <>
          <div class="tw-h-full tw-flex tw-flex-col">
            <h3>My Event</h3>
            {props.currentPair === '' ? (
              <>
                <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                  Select pair please!
                </div>
              </>
            ) : (
              <>
                {!isAccount() ? (
                  <>
                    <div class="tw-flex-grow tw-flex tw-items-center tw-justify-center">
                      Select account please!
                    </div>
                  </>
                ) : (
                  <>
                    {eventExisted() ? (
                      <ListGroup>
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
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
