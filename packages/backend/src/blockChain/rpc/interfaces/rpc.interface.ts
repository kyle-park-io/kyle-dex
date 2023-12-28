export interface RpcService {
  getRpc(): string;

  getProvider(): any;

  getNetwork(): Promise<any>;

  // getRule(): any;
}
