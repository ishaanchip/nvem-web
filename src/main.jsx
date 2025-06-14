import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import App from './App';


//able to preserve state of rendered data (no need to fetch API over and over again)
const queryClient = new QueryClient()


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
     <QueryClientProvider client={queryClient}>
       <App />
     </QueryClientProvider>
 </React.StrictMode>
);
