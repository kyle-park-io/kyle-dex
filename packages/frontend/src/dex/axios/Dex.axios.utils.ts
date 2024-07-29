import axios from 'axios';

export async function getFactory(url: string, param: any): Promise<string> {
  const res = await axios.get(`${url}/utils/getFactory`, {
    params: param,
  });
  return res.data;
}

export async function calcPair(url: string, param: any): Promise<string> {
  const res = await axios.post(`${url}/utils/calcPair`, param);
  return res.data;
}
