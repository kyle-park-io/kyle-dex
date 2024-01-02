export interface MetamaskIndexProps {
  network: string;
  loadMetamask: boolean;
  initConnectStatus: () => void;
  currentNetwork: string;
  onError: (error: Error) => void;
}
