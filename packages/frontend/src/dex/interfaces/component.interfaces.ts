export interface PairListProps {
  currentPair: string;
  handleCurrentPair: (pair: string) => void;

  currentFocusedComponent: string;
  handleCurrentFocusedComponent: (component: string) => void;
}

export interface PairEventListProps {
  currentPairEvent: string;
  handleCurrentPairEvent: (event: string) => void;

  currentMyEvent: string;
  handleCurrentMyEvent: (event: string) => void;
}

export interface PairEventProps {
  currentPair: string;

  currentFocusedComponent: string;
  handleCurrentFocusedComponent: (component: string) => void;

  currentPairEvent: string;
  handleCurrentPairEvent: (event: string) => void;
}

export interface ClientPairProps {
  currentPair: string;

  currentFocusedComponent: string;
  handleCurrentFocusedComponent: (component: string) => void;

  currentMyEvent: string;
  handleCurrentMyEvent: (event: string) => void;
}
