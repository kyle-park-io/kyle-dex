export interface ChartProps {
  currentPair: string;
}

export interface PairListProps {
  currentPair: string;
  changePair: (pair: string) => void;
}

export interface ClientPairProps {
  currentPair: string;
}
