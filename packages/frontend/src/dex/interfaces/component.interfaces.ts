export interface PairListProps {
  currentPair: string;
  changePair: (pair: string) => void;
}

export interface ClientPairProps {
  currentPair: string;
  currentAccount: string;
}
