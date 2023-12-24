import axios from 'axios';

export async function balanceOf(url: string, param: any): Promise<string> {
  const res = await axios.post(`${url}/api-dex/api/token/balanceOf`, param);
  return res.data.amount;
}

export async function calcPair(url: string, param: any): Promise<string> {
  const res = await axios.post(`${url}/api-dex/api/utils/calcPair`, param);
  return res.data.address;
}
