import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';
import { lazy } from 'solid-js';

// global css
import './css/global.css';

// basic
import Header from './layout/Header';
import Footer from './layout/Footer';

// route - lazy loaded for code splitting
const App = lazy(() => import('./app/App'));
const About = lazy(() => import('./about/About'));
const AccountIndex = lazy(() => import('./account/Account.index'));
const DexChartIndex = lazy(() => import('./dex/Dex.index'));
const DexStaking = lazy(() => import('./dex/Dex.staking'));
const DexSwap = lazy(() => import('./dex/Dex.swap'));
const DexBridge = lazy(() => import('./dex/Dex.bridge'));
const NotFoundPage = lazy(() => import('./components/404/NotFoundPage'));

// test - lazy loaded
const Test = lazy(() => import('./test/Test'));

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
      <div class="tw-flex tw-flex-col tw-flex-1" style={{ "background-color": "var(--color-bg-primary)", "min-height": "100vh" }}>
        <Router>
          {/* Header */}
          <div class="tw-h-14 tw-border-b" style={{ "background-color": "var(--color-header-bg)", "border-color": "var(--color-border-primary)" }}>
            <Header></Header>
          </div>
          {/* Main Content */}
          <div class="tw-flex-1 tw-flex tw-flex-col" style={{ "background-color": "var(--color-bg-primary)" }}>
            <Routes>
              <Route path="/dex" component={App} />
              <Route path="/dex/about" component={About} />
              <Route
                path="/dex/account/:network/:address"
                component={AccountIndex}
              />
              <Route path="/dex/chart" component={DexChartIndex} />
              <Route path="/dex/chart/:id" component={DexChartIndex} />
              <Route path="/dex/staking" component={DexStaking} />
              <Route path="/dex/staking/:id" component={DexStaking} />
              <Route path="/dex/swap" component={DexSwap} />
              <Route path="/dex/swap/:id" component={DexSwap} />\
              <Route path="/dex/bridge" component={DexBridge} />
              <Route path="/dex/bridge/:id" component={DexBridge} />
              {/* test component */}
              <Route path="/dex/test" component={Test} />
              <Route path="*" component={NotFoundPage} />
            </Routes>
          </div>
          {/* Footer */}
          <div class="tw-h-12 tw-border-t" style={{ "background-color": "var(--color-footer-bg)", "border-color": "var(--color-border-primary)" }}>
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
