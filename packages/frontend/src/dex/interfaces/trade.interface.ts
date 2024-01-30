export interface Pair {
  timestamp: number;
  token0: string;
  token1: string;
  pair: string;
  index: number;
}

export interface Pair2 {
  timestamp: number;
  token0: string;
  token1: string;
  pair: string;
  index: number;
  shortPairAddress?: string;
}

export interface Sync {
  timestamp: number;
  pair: string;
  reserve0: string;
  reserve1: string;
}

export interface Mint {
  timestamp: number;
  event: string;
  pair: string;
  sender: string;
  amount0: string;
  amount1: string;
}

export interface Burn {
  timestamp: number;
  event: string;
  pair: string;
  sender: string;
  amount0: string;
  amount1: string;
  to: string;
}

export interface Swap {
  timestamp: number;
  event: string;
  pair: string;
  sender: string;
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  to: string;
}
