import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WalletTransactions from "./components/WalletTransactions";
import Tracking from "./components/tracking";
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  return (
    <div className="App">
      <div id="app">
        <Router>
          <Routes>
            <Route path={`/`} element={<WalletTransactions />} />
            <Route path={`/tracking`} element={<Tracking />} />
          </Routes>
        </Router>
      </div>
    </div>    
  );
}

export default App;
