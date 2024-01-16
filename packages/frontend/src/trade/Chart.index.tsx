import { type Component, type JSX, onMount, createSignal } from 'solid-js';
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js';
import { DefaultChart, Line, Scatter } from 'solid-chartjs';
import { getReserve } from './Chart.axios';
import 'chart.js/auto';

export const MyChart: Component = (): JSX.Element => {
  const [data, setData] = createSignal('');

  /**
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    async function test(): Promise<void> {
      const api = import.meta.env.VITE_DEV_API_URL;
      Chart.register(Title, Tooltip, Legend, Colors);

      const data = await getReserve(api, '');
      setData(data);
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
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

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
