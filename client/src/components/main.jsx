import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore'; 
import { BrowserRouter as Router} from 'react-router-dom';

const store = createStore({authType:'cookie', authName:'_auth', cookieDomain:window.location.hostname, cookieSecure: window.location.protocol === "https:"});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
    <AuthProvider store={store} >
      <App />
    </AuthProvider>
    </Router>
  </StrictMode>
);
