import './App.css';
import './CSS/style.css';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import axios from 'axios';
import LoadingScreen from './components/LoadingScreen.jsx';
import Main from './pages/Main.jsx';
import SSIM from './pages/SSIM.jsx';
import Report from './pages/Report.jsx';
import React, { useEffect, useState } from 'react';

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [status, setStatus] = useState(null);

  // Check backend health
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5001/health");
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ok") {
            setBackendReady(true);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.log("⏳ Waiting for backend...");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Once backend is ready → check license
  useEffect(() => {
    if (backendReady) {
      const fetchStatus = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/License/status");
          console.log(res.data);
          if (res.data.status !== "valid") setStatus(false);
          else setStatus(true);
          alert(res.data.message);
        } catch (error) {
          console.error("License check failed:", error);
          setStatus(false);
        }
      };
      fetchStatus();
    }
  }, [backendReady]);

  if (!backendReady) {
    return <LoadingScreen />;
  }

  if (status === false) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h2>License Invalid</h2>
        <p>Please contact support.</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;