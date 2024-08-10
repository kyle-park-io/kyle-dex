import axios from 'axios';

export async function submit(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/common/submit`, param);
  return res.data;
}
export async function submitWithETH(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/common/submitWithETH`, param);
  return res.data;
}
