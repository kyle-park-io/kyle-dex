import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';

// global css
import './css/global.css';

// basic
import Header from './layout/Header';
import Footer from './layout/Footer';

// route
import App from './app/App';
import AccountIndex from './account/Account.index';
import DexChartIndex from './dex/Dex.index';
import DexStaking from './dex/Dex.staking';
import DexSwap from './dex/Dex.swap';
import DexBridge from './dex/Dex.bridge';
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
              <Route
                path="/dex/account/:network/:address"
                component={AccountIndex}
              />
              <Route path="/dex/chart" component={DexChartIndex} />
              <Route path="/dex/staking" component={DexStaking} />
              <Route path="/dex/swap" component={DexSwap} />
              <Route path="/dex/bridge" component={DexBridge} />
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
