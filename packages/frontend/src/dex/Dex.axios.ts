// import {
//   type Pair,
//   type Sync,
//   type Mint,
//   type Burn,
//   type Swap,
// } from './interfaces/trade.interface';
import axios from 'axios';

export async function getTokenContractList(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.get(`${url}/token/getTokenContractList`, param);
  return res.data;
}

export async function getPairList(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairList`, param);
  return res.data;
}

export async function getPairsCurrentReserve(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairsCurrentReserve`, param);
  return res.data;
}

export async function getPairCurrentReserve(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.post(`${url}/chart/getPairCurrentReserve`, param);
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

export async function getClientPairsEvent(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.post(`${url}/chart/getClientPairsEvent`, param);
  return res.data;
}

export async function getClientPairEvent(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.post(`${url}/chart/getClientPairEvent`, param);
  return res.data;
}

// branch
export async function getClient(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/chart/getClient`, param);
  return res.data;
}

export async function balanceOf(url: string, param: any): Promise<string> {
  const res = await axios.post(`${url}/token/balanceOf`, param);
  return res.data.amount;
}

export async function calcPair(url: string, param: any): Promise<string> {
  const res = await axios.post(`${url}/utils/calcPair`, param);
  return res.data.address;
}
