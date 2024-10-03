import './App.css';
import LeftPart from './components/leftPart';
import RightPart from './components/rightPart';
import IpDashboard from './components/ipDashboard';
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  const socket = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Initialise `socket` une seule fois lors du montage du composant
    socket.current = io('http://localhost:8080');

    socket.current.on('connect', () => {
      setSocketConnected(true);
      console.log('WebSocket connected');
    });

    socket.current.on('disconnect', () => {
      setSocketConnected(false);
      console.log('WebSocket disconnected');
    });

    // Nettoyage à la déconnexion
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Configuration des routes */}
        <Routes>
          <Route path="/" element={
            <div className="grid-container">
              <LeftPart socket={socket.current}/>
              <RightPart socket={socket.current}/>
            </div>
          } />
          <Route path="/ip-dashboard" element={
            <IpDashboard socket={socket.current} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;