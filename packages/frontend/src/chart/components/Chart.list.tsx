import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount, For } from 'solid-js';
import { type ChartListProps } from '../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { ButtonGroup, Button } from 'solid-bootstrap';

const [isNetwork, setIsNetwork] = createSignal(false);

export const ChartList: Component<ChartListProps> = (props): JSX.Element => {
  const params = useParams();

  const [events, setEvents] = createSignal<string[]>([]);

  createEffect(() => {
    if (params.id === undefined) {
      setIsNetwork(false);
    } else {
      setIsNetwork(true);
    }
    // // currently unused
    // if (fromHeaderNavigate.value) {
    // }
  });

  onMount(() => {
    setEvents(['all', 'one-pair', 'my-pair']);
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
          <ButtonGroup aria-label="Basic example" class="tw-flex-wrap">
            <For each={events()}>
              {(event) => (
                <Button
                  variant="secondary"
                  onClick={() => {
                    props.handleCurrentChart(event);
                  }}
                >
                  {event}
                </Button>
              )}
            </For>
          </ButtonGroup>
        </>
      )}
    </>
  );
};
