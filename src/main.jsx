import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react'
import { Provider } from "./components/ui/provider"


//able to preserve state of rendered data (no need to fetch API over and over again)
const queryClient = new QueryClient()

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
     <Provider>
     <QueryClientProvider client={queryClient}>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
        <App />
       </ClerkProvider>
     </QueryClientProvider>
     </Provider>
 </React.StrictMode>
);
