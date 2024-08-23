import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { Offcanvas, ListGroup } from 'solid-bootstrap';
import { type AccountBalanceOfProps } from '../interfaces/component.interface';
import { getClientBalanceOf } from '../Account.axios';
import { globalState } from '../../global/constants';
import axios from 'axios';

const api = globalState.api_url;

const [isNull, setIsNull] = createSignal(true);
const [isEmpty, setIsEmpty] = createSignal(true);
const [balancesOf, setBalancesOf] = createSignal<any>([]);

const AccountBalanceOf: Component<AccountBalanceOfProps> = (
  props,
): JSX.Element => {
  createEffect(() => {
    const show = props.show;
    const fn = async (): Promise<void> => {
      try {
        if (!show) return;
        setIsEmpty(true);
        setIsNull(false);
        const network = localStorage.getItem('network') as string;
        const address = localStorage.getItem('address') as string;
        if (network === 'null' || address === 'null') {
          setIsNull(true);
          return;
        }

        const result = await getClientBalanceOf(api, {
          network,
          userAddress: address,
        });
        setIsEmpty(false);
        setBalancesOf(result);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setIsEmpty(true);
            setBalancesOf([]);
          }
        }
      }
    };
    void fn();
  });

  return (
    <>
      <Offcanvas
        show={props.show}
        onHide={props.onHide}
        placement={'end'}
        scroll={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Account BalancesOf (Token)</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isNull() ? (
            <>
              <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                Check network or address
              </div>
            </>
          ) : (
            <>
              {!isEmpty() ? (
                <>
                  <ListGroup>
                    {balancesOf().map((value) => (
                      <>
                        <ListGroup.Item class="tw-flex tw-flex-col tw-break-words">
                          <p>{value.type}</p>
                          <p>{value.address}</p>
                          <p>{value.balanceOf}</p>
                        </ListGroup.Item>
                      </>
                    ))}
                  </ListGroup>
                </>
              ) : (
                <>
                  <div class="tw-h-full tw-flex tw-items-center tw-justify-center">
                    Balance is not existed
                  </div>
                </>
              )}
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AccountBalanceOf;
