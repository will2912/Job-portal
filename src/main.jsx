import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { dark } from '@clerk/themes'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider 
   appearance={{
        baseTheme: dark,
      }}
     publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
      <App  />
    </ClerkProvider>
)