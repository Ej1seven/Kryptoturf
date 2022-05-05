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

const App = () => {
  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collections/:id" element={<Collections />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
