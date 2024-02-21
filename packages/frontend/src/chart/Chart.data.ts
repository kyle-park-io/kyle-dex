/* eslint-disable @typescript-eslint/naming-convention */
import {
  getPairReserveAll,
  getPairsCurrentReserve,
  getClientPairsEvent,
  // getClientPairEvent,
} from '../dex/Dex.axios';
import { type ChartData, type ChartOptions } from 'chart.js';

const env = import.meta.env.VITE_ENV;
let api;
if (env === 'DEV') {
  api = import.meta.env.VITE_DEV_API_URL;
} else if (env === 'PROD') {
  api = import.meta.env.VITE_PROD_API_URL;
} else {
  throw new Error('url env error');
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
console.log(chartOptions);

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
          return `${point.pair}: (${point.x}, ${point.y})`;
        },
      },
    },
  };

  return { data: pairData, dataset: pairDataset, option: chartOption };
}

export async function getAllData(network: string): Promise<any> {
  const data = await getPairsCurrentReserve(api, {
    network,
  });

  const test: any[] = [];
  const step = '5000';
  const x_min = '0';
  let x_max = '0';
  const y_min = '0';
  let y_max = '0';

  for (let i = 0; i < data.length; i++) {
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
          return `${point.pair}: (${point.x}, ${point.y})`;
        },
      },
    },
  };

  return { data: allData, dataset: allDataset, option: chartOption };
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
