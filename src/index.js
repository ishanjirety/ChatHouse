import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom'
import { AuthContext } from './context'

ReactDOM.render(
  <React.StrictMode>
    <AuthContext>
      <Router>
          <App />
      </ Router>
    </AuthContext>
  </React.StrictMode>,
  document.getElementById('root')
);
