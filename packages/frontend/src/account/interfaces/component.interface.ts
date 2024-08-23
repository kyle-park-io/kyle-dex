export interface AccountInfo {
  network: string;
  name?: string;
  address: string;
  balance: string;
  nonce: string;
}

export interface AccountBalanceOfProps {
  show: boolean;
  onHide: () => void;
}
