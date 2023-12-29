export interface RpcService {
  getRpc(): string;

  getProvider(): any;

  connectNetwork(): Promise<void>;

  // getRule(): any;
}
