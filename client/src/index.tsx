import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TransactionProvider } from './context/TransactionContext';
/*React Query is a library used for managing server states. It provides a Hook for fetching,
 caching, and updating asynchronous data in React without touching any “global state” like Redux*/
const queryClient = new QueryClient();

ReactDOM.render(
  <TransactionProvider>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.StrictMode>
    ,
  </TransactionProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
