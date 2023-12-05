import { render } from 'solid-js/web';

// global css
import 'normalize.css';

const root = document.getElementById('root');
if (root != null) {
  render(
    () => (
      <>
        <div></div>
      </>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
