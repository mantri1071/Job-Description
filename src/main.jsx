import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(

    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>

);
