import { globalState } from '../../global/constants';
import { getPairCurrentReserve, getReserve } from '../axios/Dex.axios.pair';
import { getFactory, calcPair } from '../axios/Dex.axios.utils';

const api = globalState.api_url;

export const calcPairFromFactory = async (
  tokenA: string,
  tokenB: string,
): Promise<string> => {
  const factory = await getFactory(api, {
    network: localStorage.getItem('network') as string,
  });

  const res = await calcPair(api, {
    network: localStorage.getItem('network') as string,
    userName: 'admin',
    contractName: 'DexCalc',
    factory,
    tokenA,
    tokenB,
  });
  return res;
};

export const getSpecifiedPairsReserve = async (
  pairs: string[],
): Promise<any> => {
  for (const value of pairs) {
    const reserve = await getPairCurrentReserve(api, {
      network: localStorage.getItem('network') as string,
      pairAddress: value,
    });
    console.log(reserve);

    const reserve2 = await getReserve(api, {
      network: localStorage.getItem('network') as string,
      pairAddress: value,
    });
    console.log(reserve2);
  }
};
