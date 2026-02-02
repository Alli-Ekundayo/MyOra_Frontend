import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';

// Configure Amplify
Amplify.configure(awsConfig);

// Silence logs in production
if (import.meta.env.PROD) {
  console.log = () => { };
  console.debug = () => { };
  console.warn = () => { };
  // console.error is kept for critical error tracking
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
