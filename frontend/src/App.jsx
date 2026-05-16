//import { useState } from 'react';
import TopBar from './components/TopBar';
import Home from './pages/Home';

import './styles/styles.css';
function App() {

  return (
    <>
    <div className="app-container">
      <TopBar />
      <Home />
    </div>
    </>
  )
}

export default App
