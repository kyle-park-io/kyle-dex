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
import { randomColors, addDecimalPoint } from './Chart.utils';
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
        x: Number(x),
        y: Number(y),
      });
    }
    const allData = reserve;

    const chartData: ChartData = {
      datasets: [],
    };
    chartData.datasets = [
      {
        label: 'Pair All Reserve',
        data: allData,
        backgroundColor: randomColors,
        borderColor: randomColors,
        pointRadius: 6,
      },
    ];
    const allDataset = chartData;

    // option
    const stepNum = Number(step);
    const xMaxNum = Number(x_max);
    const yMaxNum = Number(y_max);
    const chartOption: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };
    chartOption.scales = {
      x: {
        title: {
          display: true,
          text: 'reserve0',
        },
        ticks: {
          stepSize: stepNum,
        },
        type: 'linear',
        position: 'bottom',
        min: Number(x_min),
        max: Math.ceil(xMaxNum / stepNum + 1) * stepNum,
      },
      y: {
        title: {
          display: true,
          text: 'reserve1',
        },
        ticks: {
          stepSize: stepNum,
        },
        type: 'linear',
        position: 'left',
        min: Number(y_min),
        max: Math.ceil(yMaxNum / stepNum + 1) * stepNum,
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
        return { data: undefined, dataset: undefined, option: undefined };
      }
    }
  }
}

export async function getPairData(network: string, pair: string): Promise<any> {
  try {
    const step = '100';
    const x_min = '0';
    let x_max = '0';
    const y_min = '0';
    let y_max = '0';

    const data = await getPairReserveAll(api, {
      network,
      pairAddress: pair,
    });

    const pair_property = await getPairProperty(api, {
      network,
      pairAddress: pair,
    });
    let token0 = '';
    let token1 = '';
    let token1Text = '';
    if (pair_property.token0 === globalState.hardhat_weth_address) {
      token1 = pair_property.token0;
      token0 = pair_property.token1;
    } else {
      token0 = pair_property.token0;
      token1 = pair_property.token1;
    }
    if (token1 === globalState.hardhat_weth_address) {
      token1Text = `${token1}(WETH)`;
    } else {
      token1Text = token1;
    }

    const reserve0Data: number[] = [];
    const reserve1Data: number[] = [];
    const labels: string[] = [];
    for (let i = 1; i < data.length; i++) {
      let r0 = '';
      let r1 = '';

      if (pair_property.token0 === globalState.hardhat_weth_address) {
        // switch x, y
        r0 = data[i].eventData.reserve1;
        r1 = String(
          BigInt(data[i].eventData.reserve0) /
            BigInt(Math.pow(10, 18).toString()),
        );
      } else if (pair_property.token1 === globalState.hardhat_weth_address) {
        r0 = data[i].eventData.reserve0;
        r1 = String(
          BigInt(data[i].eventData.reserve1) /
            BigInt(Math.pow(10, 18).toString()),
        );
      } else {
        r0 = data[i].eventData.reserve0;
        r1 = data[i].eventData.reserve1;
      }

      if (BigInt(r0) > BigInt(x_max)) {
        x_max = r0;
      }
      if (BigInt(r1) > BigInt(y_max)) {
        y_max = r1;
      }

      labels.push(String(i));
      reserve0Data.push(Number(r0));
      reserve1Data.push(Number(r1));
    }
    const pairData = { reserve0Data, reserve1Data };

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: `Reserve0 (token0)`,
          data: reserve0Data,
          backgroundColor: randomColors[0],
          borderColor: randomColors[0],
          pointRadius: 4,
          fill: false,
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: `Reserve1 (token1)`,
          data: reserve1Data,
          backgroundColor: randomColors[1],
          borderColor: randomColors[1],
          pointRadius: 4,
          fill: false,
          tension: 0.1,
          yAxisID: 'y1',
        },
      ],
    };
    const pairDataset = chartData;

    const stepNum = Number(step);
    const xMaxNum = Number(x_max);
    const yMaxNum = Number(y_max);
    const chartOption: ChartOptions = {};
    chartOption.scales = {
      x: {
        title: {
          display: true,
          text: 'Index',
        },
        position: 'bottom',
      },
      y: {
        title: {
          display: true,
          text: 'reserve0',
        },
        ticks: {
          stepSize: stepNum,
        },
        type: 'linear',
        position: 'left',
        min: Number(x_min),
        max: Math.ceil(xMaxNum / stepNum + 1) * stepNum,
      },
      y1: {
        title: {
          display: true,
          text: 'reserve1',
        },
        ticks: {
          stepSize: stepNum,
        },
        type: 'linear',
        position: 'right',
        min: Number(y_min),
        max: Math.ceil(yMaxNum / stepNum + 1) * stepNum,
        grid: {
          drawOnChartArea: false,
        },
      },
    };
    chartOption.plugins = {
      title: {
        display: true,
        text: [`Pair: ${pair}`, `token0: ${token0}`, `token1: ${token1Text}`],
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    };

    return { data: pairData, dataset: pairDataset, option: chartOption };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return { data: undefined, dataset: undefined, option: undefined };
      }
    }
  }
}

// bar chart
export async function getMyAllData(
  network: string,
  address: string,
): Promise<any> {
  try {
    const step = '100';

    const data = await getClientPairsEvent(api, {
      network,
      userAddress: address,
    });

    // balance data
    const balanceMap = new Map<string, string>();
    for (let i = 1; i < data.length; i++) {
      if (data[i].event !== 'Transfer') continue;

      const b = balanceMap.get(data[i].pair);
      if (b === undefined) {
        balanceMap.set(data[i].pair, data[i].eventData.value);
        continue;
      }
      if (data[i].eventData.to === address) {
        balanceMap.set(
          data[i].pair,
          BigInt(BigInt(b) + BigInt(data[i].eventData.value)).toString(),
        );
      } else if (data[i].eventData.from === 'address') {
        balanceMap.set(
          data[i].pair,
          BigInt(BigInt(b) - BigInt(data[i].eventData.value)).toString(),
        );
      } else {
        throw Error('Check Transfer Event');
      }
    }
    const labels: any[] = [];
    const balance: any[] = [];
    const result: any[] = [];
    let i = 1;
    for (const [key, value] of balanceMap) {
      const pair_property = await getPairProperty(api, {
        network,
        pairAddress: key,
      });
      if (
        pair_property.token0 === globalState.hardhat_weth_address ||
        pair_property.token1 === globalState.hardhat_weth_address
      ) {
        labels.push(i);
        const v = addDecimalPoint(value, 18);
        balance.push(v);
        result.push({ pair: key, y: Number(v) });
      } else {
        labels.push(i);
        balance.push(value);
        result.push({ pair: key, y: Number(value) });
      }
      i++;
    }
    const allData = balance;

    const chartData: ChartData = {
      labels,
      datasets: [],
    };
    chartData.datasets = [
      {
        label: "My Pair's balance",
        data: result,
        backgroundColor: randomColors,
        borderColor: randomColors,
      },
    ];
    const allDataset = chartData;

    const chartOption: ChartOptions = {};
    chartOption.scales = {
      x: {
        title: {
          display: true,
          text: 'pair',
        },
        position: 'bottom',
      },
      y: {
        title: {
          display: true,
          text: 'value',
        },
        ticks: {
          stepSize: Number(step),
        },
        position: 'left',
      },
    };
    chartOption.plugins = {
      tooltip: {
        callbacks: {
          label: function (context) {
            const point: any = context.raw;
            return `${point.pair}: ${point.y ?? context.parsed.y}`;
          },
        },
      },
    };

    return { data: allData, dataset: allDataset, option: chartOption };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return { data: undefined, dataset: undefined, option: undefined };
      }
    }
  }
}

// export async function getMyAllDataByEvent(
//   network: string,
//   address: string,
//   event: string,
// ): Promise<any> {
//   const data = await getClientPairsEvent(api, {
//     network,
//     userAddress: address,
//   });
//   console.log(data);

//   const test: any[] = [];
//   const step = '5000';
//   const x_min = '0';
//   let x_max = '0';
//   const y_min = '0';
//   let y_max = '0';

//   for (let i = 0; i < data.length; i++) {
//     if (data[i].event !== event) {
//       continue;
//     }

//     const x = data[i].eventData.amount0;
//     const y = data[i].eventData.amount1;
//     if (BigInt(x) > BigInt(x_max)) {
//       x_max = x;
//     }
//     if (BigInt(y) > BigInt(y_max)) {
//       y_max = y;
//     }

//     test.push({
//       pair: data[i].pair,
//       x,
//       y,
//     });
//   }
//   const allData = test;

//   const chartData: ChartData = {
//     datasets: [],
//   };
//   chartData.datasets = [
//     {
//       label: 'Pair All Reserve',
//       data: allData,
//       backgroundColor: 'rgb(255, 99, 132)',
//     },
//   ];
//   const allDataset = chartData;

//   const chartOption: ChartOptions = {};
//   chartOption.scales = {
//     x: {
//       title: {
//         display: true,
//         text: 'amount0',
//       },
//       ticks: {
//         stepSize: 5000,
//       },
//       type: 'linear',
//       position: 'bottom',
//       min: Number(x_min),
//       max: Number((BigInt(x_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
//     },
//     y: {
//       title: {
//         display: true,
//         text: 'amount1',
//       },
//       ticks: {
//         stepSize: 5000,
//       },
//       type: 'linear',
//       position: 'left',
//       min: Number(y_min),
//       max: Number((BigInt(y_max) / BigInt(step) + BigInt(1)) * BigInt(step)),
//     },
//   };
//   chartOption.plugins = {
//     tooltip: {
//       callbacks: {
//         label: function (context) {
//           const point: any = context.raw;
//           return `${point.pair}: (${point.x}, ${point.y})`;
//         },
//       },
//     },
//   };

//   return { data: allData, dataset: allDataset, option: chartOption };
// }
