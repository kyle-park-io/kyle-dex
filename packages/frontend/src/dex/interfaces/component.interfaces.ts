export interface PairListProps {
  currentPair: string;
  handleCurrentPair: (pair: string) => void;
}

export interface PairEventProps {
  currentPair: string;
}

export interface ClientPairProps {
  currentPair: string;
}

export interface StakingListProps {
  handleTokenA: (token: string) => void;
  handleTokenB: (token: string) => void;
  handlePair: (pair: string) => void;
}
