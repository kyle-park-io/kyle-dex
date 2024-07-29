import axios from 'axios';

export async function getTokenContractList(
  url: string,
  param: any,
): Promise<any> {
  const res = await axios.get(`${url}/token/getTokenContractList`, {
    params: param,
  });
  return res.data;
}

export async function balanceOf(url: string, param: any): Promise<string> {
  const res = await axios.post(`${url}/token/balanceOf`, param);
  return res.data.amount;
}
