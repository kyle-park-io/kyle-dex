import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';
import axios from 'axios';
import Spinner from '../components/Spinner';

const AccountIndex: Component = (): JSX.Element => {
  const params = useParams();
  const [isProd, setIsProd] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [account, setAccount] = createSignal('');

  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
    setIsProd(true);
  } else {
    throw new Error('env error');
  }

  onMount(() => {
    if (isProd()) {
      async function fetchData(): Promise<void> {
        try {
          const res = await axios.get(
            `${url}/apis/api/dex/account/${params.id}`,
          );
          setAccount(res.data);
          setLoading(true);
        } catch (err) {
          if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error(String(err)));
          }
          setLoading(true);
        }
      }
      void fetchData();
    } else {
      setAccount('Dev: Testing');
      setLoading(true);
    }
  });

  return (
    <>
      <div class="flex-grow flex flex-col">
        <div>Account Info</div>
        {!loading() ? (
          <div class="flex-grow center-flex">
            Loading...
            <Spinner></Spinner>
          </div>
        ) : (
          <div>
            {error() !== null ? (
              <div>{error()?.message}</div>
            ) : (
              <div>{account()}</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountIndex;
