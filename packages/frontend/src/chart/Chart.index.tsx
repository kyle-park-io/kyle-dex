/* eslint-disable @typescript-eslint/naming-convention */
import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount } from 'solid-js';
import { type ChartProps } from './interfaces/component.interfaces';
import { Spinner } from 'solid-bootstrap';
import {
  fromChartListNavigate,
  setFromChartListNavigate,
  fromPairNavigate,
  setFromPairNavigate,
  fromDexNavigate,
  setFromDexNavigate,
  fromAppNavigate,
  setFromAppNavigate,
  HeaderNavigateType,
  fromHeaderNavigate2,
  setFromHeaderNavigate2,
} from '../global/global.store';
import {
  getAllData,
  getPairData,
  getMyAllData,
  // getMyAllDataByEvent,
} from './Chart.data';
import { fallback } from './Chart.utils';

// chart.js
// import 'chart.js/auto';
import { DefaultChart } from 'solid-chartjs';
import {
  type ChartData,
  type ChartOptions,
  Chart,
  registerables,
  // Title,
  // Tooltip,
  // Legend,
  // Colors,
  // ScatterController,
  // LineController,
  // BarController,
  // CategoryScale,
  // LinearScale,
  // PointElement,
  // LineElement,
} from 'chart.js';

let initialized = false;

const [loading, setLoading] = createSignal(false);

const [isFirst, setIsFirst] = createSignal(true);
const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);

// chart data
const [, setAllData] = createSignal<any[] | undefined>([]);
const [allDataset, setAllDataset] = createSignal<ChartData | undefined>();
const [allDataOption, setAllDataOption] = createSignal<
  ChartOptions | undefined
>();

const [, setPairData] = createSignal<any[] | undefined>([]);
const [pairDataset, setPairDataset] = createSignal<ChartData | undefined>();
const [pairDataOption, setPairDataOption] = createSignal<
  ChartOptions | undefined
>();

const [, setMyAllData] = createSignal<any[] | undefined>([]);
const [myAllDataset, setMyAllDataset] = createSignal<ChartData | undefined>();
const [myAllDataOption, setMyAllDataOption] = createSignal<
  ChartOptions | undefined
>();

// const [, setMyAllDataMint] = createSignal<any[]>([]);
// const [, setMyAllDataMint2] = createSignal<any>({});
// const [, setMyAllOptionMint] = createSignal<ChartOptions>({});

export const ChartIndex: Component<ChartProps> = (props): JSX.Element => {
  async function all(): Promise<void> {
    const { data, dataset, option } = await getAllData(
      localStorage.getItem('network') as string,
    );
    setAllData(data);
    setAllDataset(dataset);
    setAllDataOption(option);
  }

  async function onePair(pair: string): Promise<void> {
    if (pair === '') return;

    const { data, dataset, option } = await getPairData(
      localStorage.getItem('network') as string,
      pair,
    );
    setPairData(data);
    setPairDataset(dataset);
    setPairDataOption(option);
  }

  async function myAll(network: string, address: string): Promise<void> {
    if (network === 'null' || address === 'null') return;

    const { data, dataset, option } = await getMyAllData(network, address);
    setMyAllData(data);
    setMyAllDataset(dataset);
    setMyAllDataOption(option);

    // const { data2, dataset2, option2 } = await getMyAllDataByEvent(
    //   localStorage.getItem('network') as string,
    //   localStorage.getItem('address') as string,
    //   'Mint',
    // );
    // setMyAllDataMint(data2);
    // setMyAllDataMint2(dataset2);
    // setMyAllOptionMint(option2);
  }

  onMount(() => {
    if (!initialized) {
      Chart.register(
        // Title,
        // Tooltip,
        // Legend,
        // Colors,
        // ScatterController,
        // LineController,
        // BarController,
        // CategoryScale,
        // LinearScale,
        // PointElement,
        // LineElement,
        ...registerables,
      );
      initialized = true;
    }
  });

  createEffect(() => {
    const fn = async () => {
      const network = localStorage.getItem('network') as string;
      const address = localStorage.getItem('address') as string;
      const chart = props.currentChart;
      const pair = props.currentPair;

      if (fromChartListNavigate.value) {
        if (network === 'null') {
          setIsNetwork(false);
          setFromChartListNavigate({ value: false });
          return;
        }

        setIsNetwork(true);
        setLoading(false);
        switch (chart) {
          case 'all': {
            await all();
            break;
          }
          case 'one-pair': {
            await onePair(pair);
            break;
          }
          case 'my-pair': {
            if (address === 'null') {
              setIsAccount(false);
              break;
            }

            await myAll(network, address);
            setIsAccount(true);
            break;
          }
        }
        setFromChartListNavigate({ value: false });
        setLoading(true);
        return;
      }
      if (fromPairNavigate.value) {
        if (pair === '') {
          setFromPairNavigate({ value: false });
          return;
        }

        setLoading(false);
        switch (chart) {
          case 'one-pair': {
            await onePair(pair);
            break;
          }
          case 'my-pair': {
            if (address === 'null') break;

            await myAll(network, address);
            setIsAccount(true);
            break;
          }
        }
        setFromPairNavigate({ value: false });
        setLoading(true);
        return;
      }
      if (fromDexNavigate.value) {
        if (network === 'null') {
          setIsNetwork(false);
          setFromDexNavigate({ value: false });
          return;
        }

        setIsNetwork(true);
        setLoading(false);
        await all();
        props.handleCurrentChart('all');
        setFromDexNavigate({ value: false });
        setLoading(true);
        return;
      }
      if (fromAppNavigate.value) {
        if (network === 'null') {
          setIsNetwork(false);
          setFromAppNavigate({ value: false });
          return;
        }

        setIsNetwork(true);
        setLoading(false);
        await all();
        props.handleCurrentChart('all');
        setFromAppNavigate({ value: false });
        setLoading(true);
        return;
      }
      if (fromHeaderNavigate2.value) {
        if (network === 'null') {
          setIsNetwork(false);
          setFromHeaderNavigate2({ value: false, type: '' });
          return;
        }

        setIsNetwork(true);
        setLoading(false);
        switch (chart) {
          case 'all': {
            if (fromHeaderNavigate2.type !== HeaderNavigateType.address) {
              await all();
            }
            break;
          }
          case 'one-pair': {
            if (fromHeaderNavigate2.type !== HeaderNavigateType.address) {
              await onePair(pair);
            }
            break;
          }
          case 'my-pair': {
            if (address === 'null') {
              setIsAccount(false);
              break;
            }

            await myAll(network, address);
            setIsAccount(true);
            break;
          }
        }
        setFromHeaderNavigate2({ value: false, type: '' });
        setLoading(true);
        return;
      }

      if (isFirst()) {
        if (network === 'null') {
          setIsNetwork(false);
          setIsFirst(false);
          return;
        }

        setIsNetwork(true);
        setLoading(false);
        await all();
        setIsFirst(false);
        setLoading(true);
      }
    };
    void fn();
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
          {!loading() ? (
            <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
              <Spinner animation="border" variant="info" />
            </div>
          ) : (
            <div class="tw-h-full">
              {props.currentChart === 'all' ? (
                <>
                  {allDataset() === undefined ? (
                    <>
                      <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                        No data!
                      </div>
                    </>
                  ) : (
                    <>
                      <DefaultChart
                        type="scatter"
                        data={allDataset()}
                        options={allDataOption()}
                        fallback={fallback()}
                      ></DefaultChart>
                    </>
                  )}
                </>
              ) : (
                <>
                  {props.currentChart === 'one-pair' ? (
                    <>
                      {props.currentPair === '' ? (
                        <>
                          <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                            Select pair please!
                          </div>
                        </>
                      ) : (
                        <>
                          {pairDataset() === undefined ? (
                            <>
                              <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                                No data!
                              </div>
                            </>
                          ) : (
                            <>
                              <DefaultChart
                                type="line"
                                data={pairDataset()}
                                options={pairDataOption()}
                                fallback={fallback()}
                              ></DefaultChart>
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {!isAccount() ? (
                        <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                          Select account please!
                        </div>
                      ) : (
                        <>
                          {myAllDataset() === undefined ? (
                            <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                              No data!
                            </div>
                          ) : (
                            <>
                              <DefaultChart
                                type="bar"
                                data={myAllDataset()}
                                options={myAllDataOption()}
                                fallback={fallback()}
                              ></DefaultChart>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};
