import axios from 'axios';

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
