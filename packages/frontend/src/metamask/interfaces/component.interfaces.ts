export interface MetamaskIndexProps {
  chainId: string;
  network: string;
  currentNetwork: string;
  loadMetamask: boolean;
  handleLoadMetamask: () => void;
  isConnected: boolean;
  handleConnect: () => void;
  disconnect: boolean;
  handleDisconnect: () => void;
  change: boolean;
  handleChange: () => void;
  onError: (error: Error) => void;
}
