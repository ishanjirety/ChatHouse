import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom'
import { AuthContext,UserContext } from './context'

ReactDOM.render(
  <React.StrictMode>
    <UserContext>
    <AuthContext>
        <Router>
            <App />
        </ Router>
    </AuthContext>
  </UserContext>
  </React.StrictMode>,
  document.getElementById('root')
);
