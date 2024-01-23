import { type Component, type JSX } from 'solid-js';
import { onMount, createSignal } from 'solid-js';
import { getPairList } from './Chart.axios';
import { type ChartProps } from './interfaces/component.interfaces';
import { type Pair } from './interfaces/trade.interface';

// chart.js
import 'chart.js/auto';
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js';
import { Scatter } from 'solid-chartjs';

export const ChartIndex: Component<ChartProps> = (props): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let api;
  if (env === 'DEV') {
    api = import.meta.env.VITE_DEV_API_URL;
  } else if (env === 'PROD') {
    api = import.meta.env.VITE_PROD_API_URL;
  } else {
    throw new Error('url env error');
  }

  const [data2, setData] = createSignal<Pair[]>([]);
  console.log(props.currentPair);

  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    async function test(): Promise<void> {
      Chart.register(Title, Tooltip, Legend, Colors);

      const data = await getPairList(api, { network: 'hardhat' });
      setData(data);
      console.log(data2());
    }

    void test();
  });

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [50, 60, 70, 80, 90],
      },
    ],
  };
  console.log(chartData);
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  console.log(chartOptions);

  const chartData2 = {
    // datasets: aa(),
    datasets: [
      {
        label: 'Scatter Dataset',
        data: [
          {
            x: -10,
            y: 0,
          },
          {
            x: 0,
            y: 10,
          },
          {
            x: 10,
            y: 5,
          },
          {
            x: 0.5,
            y: 5.5,
          },
        ],
        backgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const chartOptions2 = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: -15, // x축 최소값
        max: 15, // x축 최대값
      },
      y: {
        type: 'linear',
        min: -5, // y축 최소값
        max: 15, // y축 최대값
      },
    },
  };

  return (
    <div>
      {/* <Line data={chartData} options={chartOptions} width={500} height={500} /> */}
      {/* <DefaultChart type="line" data={chartData} options={chartOptions} /> */}
      <Scatter type="scatter" data={chartData2} options={chartOptions2} />
    </div>
  );
};
