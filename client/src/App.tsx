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
import { Collection } from './pages/Collection';
import { NFTS } from './pages/NFTS';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import { Stats } from './pages/Stats';
import { Resources } from './pages/Resources';
import { CreateNFT } from './pages/CreateNFT';
import { Profile } from './pages/Profile';
import { Wallet } from './pages/Wallet';
import { Collections } from './pages/Collections';
import { CreateCollection } from './pages/CreateCollection';

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
            <Route path="/collections" element={<Collections />} />
            <Route path="/collection/:id" element={<Collection />} />
            <Route path="/nfts/:id" element={<NFTS />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/createNFT" element={<CreateNFT />} />
            <Route path="/createCollection" element={<CreateCollection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </Router>
      </div>
    </ThirdwebWeb3Provider>
  );
};

export default App;
