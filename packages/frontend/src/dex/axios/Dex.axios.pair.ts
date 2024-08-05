// import {
//   type Pair,
//   type Sync,
//   type Mint,
//   type Burn,
//   type Swap,
// } from './interfaces/trade.interface';
import axios from 'axios';

export async function getPairList(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairList`, param);
  return res.data;
}

export async function getPairProperty(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairProperty`, param);
  return res.data;
}

export async function getPairCurrentReserve(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairCurrentReserve`, param);
  return res.data;
}

export async function getPairsCurrentReserve(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairsCurrentReserve`, param);
  return res.data;
}

export async function getPairReserveAll(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairReserveAll`, param);
  return res.data;
}

export async function getPairEventAll(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairEventAll`, param);
  return res.data;
}
