import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount, For } from 'solid-js';
import { type ChartListProps } from '../interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { ButtonGroup, Button } from 'solid-bootstrap';
import { setFromChartListNavigate } from '../../global/global.store';

let initialized = false;

const [isNetwork, setIsNetwork] = createSignal(false);

const [charts, setCharts] = createSignal<string[]>([]);

export const ChartList: Component<ChartListProps> = (props): JSX.Element => {
  const params = useParams();

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
    if (!initialized) {
      setCharts(['all', 'one-pair', 'my-pair']);

      initialized = true;
    }
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
            <For each={charts()}>
              {(chart) => (
                <Button
                  variant="secondary"
                  onClick={() => {
                    props.handleCurrentChart(chart);
                    setFromChartListNavigate({ value: true });
                  }}
                >
                  {chart}
                </Button>
              )}
            </For>
          </ButtonGroup>
        </>
      )}
    </>
  );
};
