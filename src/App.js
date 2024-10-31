// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes/*, Switch */} from 'react-router-dom';
import NavBar from './components/NavBar';
import Button from './components/Button';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<NavBar />} />
        <Route path="/" element={<Button label="Add" onClick={() => alert('Button clicked')} type='add' />} />
      </Routes>
    </Router>
  );
}

export default App;
