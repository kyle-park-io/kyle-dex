import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';
import { getClient } from './Account.axios';
import { type AccountInfo } from './interfaces/component.interface';
import { Spinner, Container, Row, Col } from 'solid-bootstrap';
import { globalState } from '../global/constants';

const AccountIndex: Component = (): JSX.Element => {
  const params = useParams();

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [account, setAccount] = createSignal<AccountInfo>();

  const apiUrl = globalState.api_url;

  createEffect(() => {
    if (globalState.isOpen) {
      if (params.network !== 'null' && params.address !== 'null') {
        async function fetchData(): Promise<void> {
          try {
            const res = await getClient(apiUrl, {
              network: params.network,
              userAddress: params.address,
            });
            setAccount(res);
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
      }
      if (params.network === 'null' || params.address === 'null') {
        setAccount();
        setLoading(true);
      }
    }
  });

  return (
    <>
      <Container fluid class="tw-p-4">
        <Row class="tw-h-full tw-flex tw-flex-col">
          <Col md={12}>
            <h1>Account Info</h1>
          </Col>
          <div class="tw-flex-1 tw-flex tw-justify-center tw-items-center tw-flex-col">
            {!loading() ? (
              <>
                <span>Loading...</span>
                <Spinner animation="border" variant="primary" />
              </>
            ) : (
              <>
                {error() !== null ? (
                  <span>{error()?.message}</span>
                ) : (
                  <div>
                    {account() !== undefined ? (
                      <div>
                        <h2>Account</h2>
                        {account()?.network === 'unknown' ? (
                          <p>network : hardhat</p>
                        ) : (
                          <p>network : {account()?.network}</p>
                        )}
                        <p>name : {account()?.name}</p>
                        <p>address : {account()?.address}</p>
                        <p>nonce : {account()?.nonce}</p>
                        <p>balance : {account()?.balance}</p>
                      </div>
                    ) : (
                      <>
                        {params.network === 'null' ? (
                          <>
                            <div>Please select network!</div>
                          </>
                        ) : (
                          <>
                            <div>Please select account!</div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default AccountIndex;
