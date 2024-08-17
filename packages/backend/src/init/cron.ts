import cron from 'node-cron';
import axios from 'axios';
import { constants } from '../constants/constants';

export function startCronJobs() {
  cron.schedule('*/5 * * * *', async () => {
    console.log('Check network status: ');
    try {
      const network = ['hardhat', 'sepolia', 'amoy'];
      for (const value of network) {
        // await axios.get(`${constants.api_url}/network/getNetwork`, {
        //   params: { network: value },
        // });
        // // TODO: network
        // await axios.get(`${constants.api_url}/network/reconnectNetwork`, {
        //   params: { network: value },
        // });
        // await axios.get(`${constants.api_url}/network/reconnectEventListener`, {
        //   params: { network: value },
        // });
      }
      console.log('Reconnect network success!', Date.now());
    } catch (err) {
      if (axios.isAxiosError(err) && err.config) {
        console.log('Try reconnect network: ', err.config.params.network);
        await axios.get(`${constants.api_url}/network/reconnectNetwork`, {
          params: { network: err.config.params.network },
        });
        console.log('Try reconnect eventlistener: ', err.config.params.network);
        await axios.get(`${constants.api_url}/network/reconnectEventListener`, {
          params: { network: err.config.params.network },
        });
      }
    }
  });
}
