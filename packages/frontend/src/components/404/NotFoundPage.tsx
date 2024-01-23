import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Button } from 'solid-bootstrap';

import './NotFoundPage.css';

const NotFoundPage: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const handleButtonClick = (): void => {
    navigate('/dex');
  };

  return (
    <>
      <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
        <h1>Oops!</h1>
        <h2>404 - Page not found</h2>
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        <Button onClick={handleButtonClick} variant="info">
          Go To Homepage
        </Button>
      </div>
    </>
  );
};

export default NotFoundPage;
