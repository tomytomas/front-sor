import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/buttons.css';
import './styles/forms.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

serviceWorker.unregister();