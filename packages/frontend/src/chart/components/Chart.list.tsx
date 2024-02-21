import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, For } from 'solid-js';
import { type ChartListProps } from '../interfaces/component.interfaces';
import { ButtonGroup, Button } from 'solid-bootstrap';

const [isCalled, setIsCalled] = createSignal(false);

export const ChartList: Component<ChartListProps> = (props): JSX.Element => {
  const [items, setItems] = createSignal<string[]>([]);

  createEffect(() => {
    if (!isCalled()) {
      setItems([
        'all',
        'pair-event',
        'pair-event-Mint',
        'pair-event-Burn',
        'pair-event-Swap',
        // 'my-all',
        // 'my-pair',
        'my-event-all',
        'my-event-Mint',
        'my-event-Burn',
        'my-event-Swap',
        'my-pair-event',
        'my-pair-event-Mint',
        'my-pair-event-Burn',
        'my-pair-event-Swap',
      ]);
      setIsCalled(true);
    }
  });

  return (
    <>
      <ButtonGroup aria-label="Basic example">
        <For each={items()}>
          {(item) => (
            <Button
              variant="secondary"
              onClick={() => {
                props.handleCurrentChart(item);
              }}
            >
              {item}
            </Button>
          )}
        </For>
      </ButtonGroup>
    </>
  );
};
