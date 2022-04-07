import {
  Navbar,
  Welcome,
  Footer,
  Services,
  Transactions,
  Loader,
} from './components';

const App = () => {
  return (
    <div className="min-h-screen">
      <div>
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
};

export default App;
