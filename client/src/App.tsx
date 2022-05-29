import {
  Navbar,
  Welcome,
  Footer,
  Services,
  Transactions,
  Loader,
  Login,
} from './components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Collections } from './pages/Collections';
import { NFTS } from './pages/NFTS';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

/**
 * The chain ID 4 represents the Rinkeby network
 * The 'injected' connector is a web3 connection method used by Metamask
 */
const supportedChainIds = [4];
const connectors = {
  injected: {},
};

const App = () => {
  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <div className="min-h-screen">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/collections/:id" element={<Collections />} />
            <Route path="/nfts/:id" element={<NFTS />} />
          </Routes>
        </Router>
      </div>
    </ThirdwebWeb3Provider>
  );
};

export default App;
