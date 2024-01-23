import {
  type Pair,
  type Sync,
  // type Mint,
  // type Burn,
  // type Swap,
} from './interfaces/trade.interface';
import axios from 'axios';

export async function getPairList(url: string, param: any): Promise<Pair[]> {
  const res = await axios.post(`${url}/chart/getPairList`, param);
  return res.data;
}

export async function getPair(url: string, param: any): Promise<Sync[]> {
  const res = await axios.post(`${url}/chart/getPair`, param);
  return res.data;
}

export async function getClientPair(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getClientPair`, param);
  return res.data;
}

export async function getClient(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getClient`, param);
  return res.data;
}
