import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, API_URL } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';

const AppContent: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings dynamically to feed into footer links
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading layout settings:", err));
  }, []);

  // Track session engagement duration
  useEffect(() => {
    let activeTime = 0;
    const interval = setInterval(() => {
      activeTime += 10; // check every 10s
      
      // Send engagement heartbeats in batches of 30 seconds
      if (activeTime % 30 === 0) {
        fetch(`${API_URL}/analytics/engagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seconds: 30 })
        }).catch((err) => console.error("Engagement record error:", err));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer settings={settings} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
