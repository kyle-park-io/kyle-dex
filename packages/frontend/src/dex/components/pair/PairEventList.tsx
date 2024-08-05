import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount, For } from 'solid-js';
import { type PairEventListProps } from '../../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { ButtonGroup, Button } from 'solid-bootstrap';

const [isNetwork, setIsNetwork] = createSignal(false);

export const PairEventList: Component<PairEventListProps> = (
  props,
): JSX.Element => {
  const params = useParams();

  const [pairEvents, setPairEvents] = createSignal<string[]>([]);
  const [myEvents, setMyEvents] = createSignal<string[]>([]);

  createEffect(() => {
    if (params.id === undefined) {
      setIsNetwork(false);
    } else {
      setIsNetwork(true);
    }
  });

  onMount(() => {
    setPairEvents([
      'pair-all-event',
      'pair-event-Mint',
      'pair-event-Burn',
      'pair-event-Swap',
    ]);
    setMyEvents([
      'my-all-event',
      'my-event-Mint',
      'my-event-Burn',
      'my-event-Swap',
      'my-pair-all-event',
      'my-pair-event-Mint',
      'my-pair-event-Burn',
      'my-pair-event-Swap',
    ]);
  });

  return (
    <>
      {!isNetwork() ? (
        <>
          <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
            Select network please!
          </div>
        </>
      ) : (
        <>
          <div class="tw-flex tw-gap-4">
            <ButtonGroup aria-label="Basic example" class="tw-flex-wrap">
              <For each={pairEvents()}>
                {(event) => (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      props.handleCurrentPairEvent(event);
                    }}
                  >
                    {event}
                  </Button>
                )}
              </For>
            </ButtonGroup>
            <ButtonGroup aria-label="Basic example" class="tw-flex-wrap">
              <For each={myEvents()}>
                {(event) => (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      props.handleCurrentMyEvent(event);
                    }}
                  >
                    {event}
                  </Button>
                )}
              </For>
            </ButtonGroup>
          </div>
        </>
      )}
    </>
  );
};
