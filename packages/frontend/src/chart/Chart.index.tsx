/* eslint-disable @typescript-eslint/naming-convention */
import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { type ChartProps } from './interfaces/component.interfaces';
import {
  getPairData,
  getAllData,
  getMyAllData,
  getMyAllDataByEvent,
} from './Chart.data';

import { Scatter } from 'solid-chartjs';
import {
  type ChartOptions,
  // type ChartData,
  // Chart,
  // Title,
  // Tooltip,
  // Legend,
  // Colors,
  // Plugin,
} from 'chart.js';

// chart.js
import 'chart.js/auto';
/**
 * You must register optional elements before using the chart,
 * otherwise you will have the most primitive UI
 */
// Chart.register(Title, Tooltip, Legend, Colors);

const [isCalled, setIsCalled] = createSignal(false);

export const ChartIndex: Component<ChartProps> = (props): JSX.Element => {
  const [currentChart, setCurrentChart] = createSignal('all');
  const [currentPair, setCurrentPair] = createSignal('');
  const [currentAccount, setCurrentAccount] = createSignal('null');

  const [, setAllData] = createSignal<any[]>([]);
  const [allData2, setAllData2] = createSignal<any>({});
  const [allOption, setAllOption] = createSignal<ChartOptions>({});

  const [, setMyAllData] = createSignal<any[]>([]);
  const [, setMyAllData2] = createSignal<any>({});
  const [, setMyAllOption] = createSignal<ChartOptions>({});

  const [, setMyAllDataMint] = createSignal<any[]>([]);
  const [, setMyAllDataMint2] = createSignal<any>({});
  const [, setMyAllOptionMint] = createSignal<ChartOptions>({});

  const [, setPairData] = createSignal<any[]>([]);
  const [pairData2, setPairData2] = createSignal<any>({});
  const [pairOption, setPairOption] = createSignal<ChartOptions>({});

  async function all(): Promise<void> {
    const { data, dataset, option } = await getAllData(
      localStorage.getItem('network') as string,
    );
    setAllData(data);
    setAllData2(dataset);
    setAllOption(option);

    setCurrentPair('');
    setCurrentChart('all');
  }

  async function myAll(): Promise<void> {
    const { data, dataset, option } = await getMyAllData(
      localStorage.getItem('network') as string,
      localStorage.getItem('address') as string,
    );
    setMyAllData(data);
    setMyAllData2(dataset);
    setMyAllOption(option);

    const { data2, dataset2, option2 } = await getMyAllDataByEvent(
      localStorage.getItem('network') as string,
      localStorage.getItem('address') as string,
      'Mint',
    );
    setMyAllDataMint(data2);
    setMyAllDataMint2(dataset2);
    setMyAllOptionMint(option2);

    setCurrentAccount(localStorage.getItem('address') as string);
    setCurrentPair('');
    setCurrentChart('all');
  }

  async function pair(): Promise<void> {
    const { data, dataset, option } = await getPairData(
      localStorage.getItem('network') as string,
      props.currentPair,
    );
    setPairData(data);
    setPairData2(dataset);
    setPairOption(option);

    setCurrentPair(props.currentPair);
    setCurrentChart('pair');

    props.handleCurrentChart('pair');
  }

  createEffect(() => {
    if (isCalled()) {
      if ((localStorage.getItem('network') as string) !== 'null') {
        if (props.currentChart.includes('all')) {
          // if (!currentChart().includes('all')) {
          // }
          console.log('how?');
          void all();
          // TODO
          if (
            props.currentChart.includes('my') &&
            (localStorage.getItem('address') as string) !== 'null' &&
            currentAccount() !== (localStorage.getItem('address') as string)
          ) {
            void myAll();
          }
        }

        if (props.currentChart.includes('pair')) {
          if (!currentChart().includes('pair')) {
            if (
              props.currentPair !== '' &&
              props.currentPair !== currentPair()
            ) {
              void pair();
            }
            if (
              props.currentChart.includes('my') &&
              (localStorage.getItem('address') as string) !== 'null' &&
              currentAccount() !== (localStorage.getItem('address') as string)
            ) {
              // void allACC();
            }
          }
        }
      }
    } else {
      void all();
      setIsCalled(true);
    }
  });

  return (
    <div>
      {/* <Line data={chartData} options={chartOptions} width={500} height={500} /> */}
      {/* <DefaultChart type="line" data={chartData} options={chartOptions} /> */}

      {props.currentChart.includes('all') && (
        <>
          {props.currentChart.includes('my') ? (
            <>
              {currentAccount() === 'null' ? (
                <>
                  <div>Please select account!</div>
                </>
              ) : (
                // <>
                //   <Scatter
                //     type="scatter"
                //     data={myAllData2()}
                //     options={myAllOption()}
                //   />
                // </>

                <>
                  {props.currentChart.includes('Mint') && (
                    <>
                      <Scatter
                        type="scatter"
                        data={pairData2()}
                        options={pairOption()}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <>
                <Scatter
                  type="scatter"
                  data={allData2()}
                  options={allOption()}
                />
              </>
            </>
          )}
        </>
      )}

      {props.currentChart.includes('pair') && (
        <>
          {currentPair() === '' ? (
            <>
              <div>Please select pair!</div>
            </>
          ) : (
            <>
              {props.currentChart.includes('my') ? (
                <>
                  {currentAccount() === 'null' ? (
                    <>
                      <div>Please select account!</div>
                    </>
                  ) : (
                    <>
                      {props.currentChart.includes('Mint') && (
                        <>
                          <Scatter
                            type="scatter"
                            data={pairData2()}
                            options={pairOption()}
                          />
                        </>
                      )}
                      {props.currentChart.includes('Burn') && (
                        <>
                          <Scatter
                            type="scatter"
                            data={pairData2()}
                            options={pairOption()}
                          />
                        </>
                      )}
                      {props.currentChart.includes('Swap') && (
                        <>
                          <Scatter
                            type="scatter"
                            data={pairData2()}
                            options={pairOption()}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {props.currentChart.includes('Mint') && (
                    <>
                      <Scatter
                        type="scatter"
                        data={pairData2()}
                        options={pairOption()}
                      />
                    </>
                  )}
                  {props.currentChart.includes('Burn') && (
                    <>
                      <Scatter
                        type="scatter"
                        data={pairData2()}
                        options={pairOption()}
                      />
                    </>
                  )}
                  {props.currentChart.includes('Swap') && (
                    <>
                      <Scatter
                        type="scatter"
                        data={pairData2()}
                        options={pairOption()}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
