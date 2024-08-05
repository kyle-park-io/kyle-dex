/* eslint-disable @typescript-eslint/naming-convention */
import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount } from 'solid-js';
import { type ChartProps } from './interfaces/component.interfaces';
import { useParams } from '@solidjs/router';
import { Spinner } from 'solid-bootstrap';
// import {
//   fromHeaderNavigate,
//   setFromHeaderNavigate,
// } from '../global/global.store';
import {
  // getPairData,
  getAllData,
  // getMyAllData,
  // getMyAllDataByEvent,
} from './Chart.data';

// chart.js
// import 'chart.js/auto';
import { DefaultChart } from 'solid-chartjs';
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import {
  type ChartData,
  type ChartOptions,
  // Chart,
  // Title,
  // Tooltip,
  // Legend,
  // Colors,
  // Plugin,
} from 'chart.js';

const [loading, setLoading] = createSignal(false);

const [isNetwork, setIsNetwork] = createSignal(false);
const [isAccount, setIsAccount] = createSignal(false);
console.log(isNetwork(), isAccount());

export const ChartIndex: Component<ChartProps> = (props): JSX.Element => {
  const params = useParams();

  // const [, setMyAllData] = createSignal<any[]>([]);
  // const [, setMyAllData2] = createSignal<any>({});
  // const [, setMyAllOption] = createSignal<ChartOptions>({});

  // const [, setMyAllDataMint] = createSignal<any[]>([]);
  // const [, setMyAllDataMint2] = createSignal<any>({});
  // const [, setMyAllOptionMint] = createSignal<ChartOptions>({});

  // const [, setPairData] = createSignal<any[]>([]);
  // const [pairData2, setPairData2] = createSignal<any>({});
  // const [pairOption, setPairOption] = createSignal<ChartOptions>({});

  const [, setAllData] = createSignal<any[]>([]);
  const [allDataset, setAllDataset] = createSignal<ChartData>();
  const [allDataOption, setAllDataOption] = createSignal<ChartOptions>();

  async function all(): Promise<void> {
    const { data, dataset, option } = await getAllData(
      localStorage.getItem('network') as string,
    );
    setAllData(data);
    setAllDataset(dataset);
    setAllDataOption(option);

    // setCurrentPair('');
    props.handleCurrentChart('all');

    setLoading(true);
  }

  // async function myAll(): Promise<void> {
  //   const { data, dataset, option } = await getMyAllData(
  //     localStorage.getItem('network') as string,
  //     localStorage.getItem('address') as string,
  //   );
  //   setMyAllData(data);
  //   setMyAllData2(dataset);
  //   setMyAllOption(option);

  //   const { data2, dataset2, option2 } = await getMyAllDataByEvent(
  //     localStorage.getItem('network') as string,
  //     localStorage.getItem('address') as string,
  //     'Mint',
  //   );
  //   setMyAllDataMint(data2);
  //   setMyAllDataMint2(dataset2);
  //   setMyAllOptionMint(option2);

  //   setCurrentAccount(localStorage.getItem('address') as string);
  //   setCurrentPair('');
  //   setCurrentChart('all');
  // }

  // async function pair(): Promise<void> {
  //   const { data, dataset, option } = await getPairData(
  //     localStorage.getItem('network') as string,
  //     props.currentPair,
  //   );
  //   setPairData(data);
  //   setPairData2(dataset);
  //   setPairOption(option);

  //   setCurrentPair(props.currentPair);
  //   setCurrentChart('pair');

  //   props.handleCurrentChart('pair');
  // }

  createEffect(() => {
    if (params.id === undefined) {
      setIsNetwork(false);
      setIsAccount(false);
    } else {
      setLoading(false);
      setIsNetwork(true);

      if ((localStorage.getItem('network') as string) !== 'null') {
        void all();
        setIsAccount(true);
      } else {
        setIsAccount(false);
      }

      // if (props.currentChart.includes('all')) {
      //   // if (!currentChart().includes('all')) {
      //   // }
      //   console.log('how?');
      //   void all();
      //   // TODO
      //   if (
      //     props.currentChart.includes('my') &&
      //     (localStorage.getItem('address') as string) !== 'null' &&
      //     currentAccount() !== (localStorage.getItem('address') as string)
      //   ) {
      //     void myAll();
      //   }
      // }

      // if (props.currentChart.includes('pair')) {
      //   if (!currentChart().includes('pair')) {
      //     if (
      //       props.currentPair !== '' &&
      //       props.currentPair !== currentPair()
      //     ) {
      //       void pair();
      //     }
      //     if (
      //       props.currentChart.includes('my') &&
      //       (localStorage.getItem('address') as string) !== 'null' &&
      //       currentAccount() !== (localStorage.getItem('address') as string)
      //     ) {
      //       // void allACC();
      //     }
      //   }
      // }
    }
  });

  onMount(() => {
    Chart.register(
      Title,
      Tooltip,
      Legend,
      Colors,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
    );
  });

  return (
    <>
      {!loading() ? (
        <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
          <Spinner animation="border" variant="info" />
        </div>
      ) : (
        <div class="tw-h-full">
          <DefaultChart
            type="scatter"
            data={allDataset()}
            options={allDataOption()}
          ></DefaultChart>
        </div>
      )}
    </>
  );
};
