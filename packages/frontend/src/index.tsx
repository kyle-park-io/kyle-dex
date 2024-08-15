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

// test
import Test from './test/Test';

// utils
import Resize from './utils/Resize';

// default
import { globalState } from './global/constants';
function initializeLocalStorage(): void {
  if (localStorage.getItem('network') === null) {
    localStorage.setItem('network', 'hardhat');
    console.log('Default network set in localStorage:', 'hardhat');
  }
  if (localStorage.getItem('address') === null) {
    localStorage.setItem('address', globalState.hardhat_admin_address);
    console.log(
      'Default address set in localStorage:',
      globalState.hardhat_admin_address,
    );
  }
  if (localStorage.getItem('isConnected') === null) {
    localStorage.setItem('isConnected', '0');
    console.log('Default isConnected set in localStorage:', '0');
  }
}
initializeLocalStorage();

const root = document.getElementById('root');
if (root != null) {
  render(
    () => (
      <div class="tw-flex tw-flex-col tw-min-h-screen">
        <Router>
          {/* tw-overflow-auto */}
          <div class="tw-bg-white tw-h-12">
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
              <Route path="/dex/chart/:id" component={DexChartIndex} />
              <Route path="/dex/staking" component={DexStaking} />
              <Route path="/dex/staking/:id" component={DexStaking} />
              <Route path="/dex/swap" component={DexSwap} />
              <Route path="/dex/bridge" component={DexBridge} />
              {/* test component */}
              <Route path="/dex/test" component={Test} />
              <Route path="*" component={NotFoundPage} />
            </Routes>
          </div>
          <div class="tw-bg-gray-400 tw-h-8">
            <Footer></Footer>
          </div>
        </Router>
        {/* resize */}
        <Resize />
      </div>
    ),
    root,
  );
} else {
  console.error('Cannot find the root element');
}
