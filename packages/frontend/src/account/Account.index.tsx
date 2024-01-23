import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
// import { useParams } from '@solidjs/router';
// import axios from 'axios';
import { Spinner, Container, Row, Col } from 'solid-bootstrap';

const AccountIndex: Component = (): JSX.Element => {
  // const params = useParams();
  const [isProd, setIsProd] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  // const [account, setAccount] = createSignal('');

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
  console.log(url);

  onMount(() => {
    if (isProd()) {
      async function fetchData(): Promise<void> {
        try {
          // const res = await axios.get(
          //   `${url}/api-dex/api/dex/account/${params.id}`,
          // );
          // setAccount(res.data);
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
      // setAccount('Dev: Testing');
      setLoading(true);
    }
  });

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1>Account Info</h1>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {!loading() ? (
              <div>
                Loading...
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div>
                {error() !== null ? (
                  <div>{error()?.message}</div>
                ) : (
                  <div>
                    Testing...
                    {/* <div>{account()}</div> */}
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AccountIndex;
