/* eslint-disable @typescript-eslint/naming-convention */
import {
  getPairProperty,
  getPairReserveAll,
  getPairsCurrentReserve,
} from '../dex/axios/Dex.axios.pair';
import {
  getClientPairsEvent,
  // getClientPairEvent,
} from '../dex/axios/Dex.axios.client';
import { type ChartData, type ChartOptions } from 'chart.js';
import { randomColors } from './Chart.utils';
import { globalState } from '../global/constants';
import axios from 'axios';

const api = globalState.api_url;

export async function getAllData(network: string): Promise<any> {
  try {
    const step = '100';
    const x_min = '0';
    let x_max = '0';
    const y_min = '0';
    let y_max = '0';

    const data = await getPairsCurrentReserve(api, {
      network,
    });

    // reserve data
    const reserve: any[] = [];
    for (let i = 0; i < data.length; i++) {
      const pair_property = await getPairProperty(api, {
        network,
        pairAddress: data[i].pair,
      });

      let x = '';
      let y = '';
      let x_address = '';
      let y_address = '';
      if (pair_property.token0 === globalState.hardhat_weth_address) {
        // switch x, y
        x = data[i].eventData.reserve1;
        y = String(
          BigInt(data[i].eventData.reserve0) /
            BigInt(Math.pow(10, 18).toString()),
        );
        x_address = pair_property.token1;
        y_address = pair_property.token0;
      } else if (pair_property.token1 === globalState.hardhat_weth_address) {
        x = data[i].eventData.reserve0;
        y = String(
          BigInt(data[i].eventData.reserve1) /
            BigInt(Math.pow(10, 18).toString()),
        );
        x_address = pair_property.token0;
        y_address = pair_property.token1;
      } else {
        x = data[i].eventData.reserve0;
        y = data[i].eventData.reserve1;
        x_address = pair_property.token0;
        y_address = pair_property.token1;
      }

      if (BigInt(x) > BigInt(x_max)) {
        x_max = x;
      }
      if (BigInt(y) > BigInt(y_max)) {
        y_max = y;
      }

      reserve.push({
        pair: data[i].pair,
        token0: x_address,
        token1: y_address,
        x,
        y,
      });
    }
    const allData = reserve;

    const chartData: ChartData = {
      datasets: [],
    };
    chartData.datasets = [
      {
        label: 'Pair All Reserve',
        data: reserve,
        backgroundColor: randomColors,
        borderColor: randomColors,
        pointRadius: 4,
      },
    ];
    const allDataset = chartData;

    // option
    const chartOption: ChartOptions = {};
    chartOption.scales = {
      x: {
        title: {
          display: true,
          text: 'reserve0',
        },
        ticks: {
          stepSize: Number(step),
        },
        type: 'linear',
        position: 'bottom',
        min: Number(x_min),
        max: Number((BigInt(x_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
      },
      y: {
        title: {
          display: true,
          text: 'reserve1',
        },
        ticks: {
          stepSize: Number(step),
        },
        type: 'linear',
        position: 'left',
        min: Number(y_min),
        max: Number((BigInt(y_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
      },
    };
    chartOption.plugins = {
      tooltip: {
        callbacks: {
          label: function (context) {
            const point: any = context.raw;
            if (point.token1 === globalState.hardhat_weth_address) {
              const arr = [
                `pair: ${point.pair}`,
                `token0:${point.token0.slice(0, 20)}...`,
                `token1:${point.token1.slice(0, 20)}...(WETH)`,
                `reserve0, reserve1: (${point.x}, ${point.y})`,
              ];
              return arr;
            } else {
              const arr = [
                `pair: ${point.pair}`,
                `token0:${point.token0.slice(0, 20)}...`,
                `token1:${point.token1.slice(0, 20)}...`,
                `reserve0, reserve1: (${point.x}, ${point.y})`,
              ];
              return arr;
            }
          },
        },
      },
    };

    return { data: allData, dataset: allDataset, option: chartOption };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return { data: null, dataset: null, option: null };
      }
    }
  }
}

export async function getPairData(network: string, pair: string): Promise<any> {
  const data = await getPairReserveAll(api, {
    network,
    pairAddress: pair,
  });

  const test: any[] = [];
  const step = '5000';
  const x_min = '0';
  let x_max = '0';
  const y_min = '0';
  let y_max = '0';

  for (let i = 1; i < data.length; i++) {
    const x = data[i].eventData.reserve0;
    const y = data[i].eventData.reserve0;
    if (BigInt(x) > BigInt(x_max)) {
      x_max = x;
    }
    if (BigInt(y) > BigInt(y_max)) {
      y_max = y;
    }

    test.push({
      pair: data[i].pair,
      x,
      y,
    });
  }
  const pairData = test;

  const chartData: ChartData = {
    datasets: [],
  };
  chartData.datasets = [
    {
      label: 'Pair Reserve',
      data: pairData,
      backgroundColor: 'rgb(255, 99, 132)',
    },
  ];
  const pairDataset = chartData;

  const chartOption: ChartOptions = {};
  chartOption.scales = {
    x: {
      title: {
        display: true,
        text: 'reserve0',
      },
      ticks: {
        stepSize: 5000,
      },
      type: 'linear',
      position: 'bottom',
      min: Number(x_min),
      max: Number((BigInt(x_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
    },
    y: {
      title: {
        display: true,
        text: 'reserve1',
      },
      ticks: {
        stepSize: 5000,
      },
      type: 'linear',
      position: 'left',
      min: Number(y_min),
      max: Number((BigInt(y_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
    },
  };
  chartOption.plugins = {
    tooltip: {
      callbacks: {
        label: function (context) {
          const point: any = context.raw;
          return `${point.token0}: (${point.x}, ${point.y})`;
        },
      },
    },
  };

  return { data: pairData, dataset: pairDataset, option: chartOption };
}

export async function getMyAllData(
  network: string,
  address: string,
): Promise<any> {
  const data = await getClientPairsEvent(api, {
    network,
    userAddress: address,
  });
  console.log(data);

  const test: any[] = [];
  const step = '5000';
  const x_min = '0';
  let x_max = '0';
  const y_min = '0';
  let y_max = '0';

  for (let i = 0; i < data.length; i++) {
    const x = data[i].eventData.amount0;
    const y = data[i].eventData.amount1;
    if (BigInt(x) > BigInt(x_max)) {
      x_max = x;
    }
    if (BigInt(y) > BigInt(y_max)) {
      y_max = y;
    }

    test.push({
      pair: data[i].pair,
      x,
      y,
    });
  }
  const allData = test;

  const chartData: ChartData = {
    datasets: [],
  };
  chartData.datasets = [
    {
      label: 'Pair All Reserve',
      data: allData,
      backgroundColor: 'rgb(255, 99, 132)',
    },
  ];
  const allDataset = chartData;

  const chartOption: ChartOptions = {};
  chartOption.scales = {
    x: {
      title: {
        display: true,
        text: 'amount0',
      },
      ticks: {
        stepSize: 5000,
      },
      type: 'linear',
      position: 'bottom',
      min: Number(x_min),
      max: Number((BigInt(x_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
    },
    y: {
      title: {
        display: true,
        text: 'amount1',
      },
      ticks: {
        stepSize: 5000,
      },
      type: 'linear',
      position: 'left',
      min: Number(y_min),
      max: Number((BigInt(y_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
    },
  };
  chartOption.plugins = {
    tooltip: {
      callbacks: {
        label: function (context) {
          const point: any = context.raw;
          return `${point.pair}: (${point.x}, ${point.y})`;
        },
      },
    },
  };

  return { data: allData, dataset: allDataset, option: chartOption };
}

export async function getMyAllDataByEvent(
  network: string,
  address: string,
  event: string,
): Promise<any> {
  const data = await getClientPairsEvent(api, {
    network,
    userAddress: address,
  });
  console.log(data);

  const test: any[] = [];
  const step = '5000';
  const x_min = '0';
  let x_max = '0';
  const y_min = '0';
  let y_max = '0';

  for (let i = 0; i < data.length; i++) {
    if (data[i].event !== event) {
      continue;
    }

    const x = data[i].eventData.amount0;
    const y = data[i].eventData.amount1;
    if (BigInt(x) > BigInt(x_max)) {
      x_max = x;
    }
    if (BigInt(y) > BigInt(y_max)) {
      y_max = y;
    }

    test.push({
      pair: data[i].pair,
      x,
      y,
    });
  }
  const allData = test;

  const chartData: ChartData = {
    datasets: [],
  };
  chartData.datasets = [
    {
      label: 'Pair All Reserve',
      data: allData,
      backgroundColor: 'rgb(255, 99, 132)',
    },
  ];
  const allDataset = chartData;

  const chartOption: ChartOptions = {};
  chartOption.scales = {
    x: {
      title: {
        display: true,
        text: 'amount0',
      },
      ticks: {
        stepSize: 5000,
      },
      type: 'linear',
      position: 'bottom',
      min: Number(x_min),
      max: Number((BigInt(x_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
    },
    y: {
      title: {
        display: true,
        text: 'amount1',
      },
      ticks: {
        stepSize: 5000,
      },
      type: 'linear',
      position: 'left',
      min: Number(y_min),
      max: Number((BigInt(y_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
    },
  };
  chartOption.plugins = {
    tooltip: {
      callbacks: {
        label: function (context) {
          const point: any = context.raw;
          return `${point.pair}: (${point.x}, ${point.y})`;
        },
      },
    },
  };

  return { data: allData, dataset: allDataset, option: chartOption };
}
