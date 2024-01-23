import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';

// global css
import './css/global.css';

// basic
import Header from './layout/Header';
import Footer from './layout/Footer';

// route
import App from './app/App';
import AccountIndex from './account/account.index';
import DexIndex from './dex/Dex.index';
import TradeIndex from './trade/Trade.index';
import NotFoundPage from './components/404/NotFoundPage';

const root = document.getElementById('root');
if (root != null) {
  render(
    () => (
      <div class="tw-flex tw-flex-col tw-min-h-screen">
        <Router>
          <div class="tw-bg-white tw-h-12 tw-overflow-auto">
            <Header></Header>
          </div>
          <div class="tw-bg-white tw-flex-grow tw-flex tw-flex-wrap">
            <Routes>
              <Route path="/dex" component={App} />
              <Route path="/dex/account" component={AccountIndex} />
              <Route path="/dex/dex" component={DexIndex} />
              <Route path="/dex/trade" component={TradeIndex} />
              <Route path="*" component={NotFoundPage} />
            </Routes>
          </div>
          <div class="tw-bg-gray-400 tw-h-8">
            <Footer></Footer>
          </div>
        </Router>
      </div>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
