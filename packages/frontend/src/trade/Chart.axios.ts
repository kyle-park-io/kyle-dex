import axios from 'axios';

export async function getReserve(url: string, param: any): Promise<string> {
  const res = await axios.get(`${url}/chart/getReserve`, param);
  return res.data;
}
