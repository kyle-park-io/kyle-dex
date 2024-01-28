import axios from 'axios';

export async function getClientList(url: string, param: any): Promise<any> {
  const res = await axios.get(`${url}/client/getClientList`, param);
  return res.data;
}

export async function getClient(url: string, param: any): Promise<any> {
  const res = await axios.post(`${url}/client/getClient`, param);
  return res.data;
}
