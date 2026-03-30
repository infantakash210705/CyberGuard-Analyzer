import React, { useState } from 'react';
import './index.css';
import ScannerUi from './components/ScannerUi';
import ResultPanel from './components/ResultPanel';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [lastInput, setLastInput] = useState(null);
  const [lastMode, setLastMode] = useState(null);
  const [resetKey, setResetKey] = useState(Date.now());
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if(newTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  const handleUploadClick = () => {
    setResult(null);
    setResetKey(Date.now());
  };

  const handleInfoClick = () => {
    alert("CyberGuard Analyzer\nProvides Static, Dynamic, and Intelligence-based Threat Detection for Files and URLs.");
  };

  const handleScan = async (inputVar, mode) => {
    setLastInput(inputVar);
    setLastMode(mode);
    setLoading(true);
    setResult(null);
    setError(null);
    try {
       if (mode === 'URL') {
           const res = await fetch('http://localhost:5000/api/scan-url', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ url: inputVar })
           });
           const data = await res.json();
           if (!res.ok) throw new Error(data.error || 'Failed to scan URL');
           setResult(data);
       } else {
           const formData = new FormData();
           formData.append('file', inputVar);
           const res = await fetch('http://localhost:5000/api/scan-file', {
               method: 'POST',
               body: formData
           });
           const data = await res.json();
           if (!res.ok) throw new Error(data.error || 'Failed to scan file');
           setResult(data);
       }
    } catch(e) {
       setError(e.message);
    } finally {
       setLoading(false);
    }
  };

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter' && globalSearch) {
      handleScan(globalSearch, 'URL');
    }
  }

  return (
    <div className="app-container">
      <header className="topbar">
        <div className="topbar-logo" onClick={() => setResult(null)} style={{cursor:'pointer'}}>
          <svg viewBox="0 0 24 24">
            <defs>
              <linearGradient id="topShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#b341f4" />
              </linearGradient>
            </defs>
            <path fill="url(#topShieldGrad)" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>
        <div className="topbar-search">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="URL, IP address, domain or file hash" 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleGlobalSearch}
          />
        </div>
        <div className="topbar-actions">
          <svg onClick={handleUploadClick} title="Upload File" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <svg onClick={handleInfoClick} title="Information" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <svg onClick={toggleTheme} title="Toggle Theme" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {theme === 'dark' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            )}
          </svg>
        </div>
      </header>
      
      <main className="main-content">
         {!result && !loading && !error && (
           <ScannerUi key={resetKey} onScan={handleScan} />
         )}

         {error && <div style={{color: '#f43f5e', margin: '40px'}}>{error}</div>}
         
         {loading && (
           <div style={{marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
             <div style={{width: 50, height: 50, border: '4px solid #182234', borderTopColor: '#759cff', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
             <p style={{marginTop: 20, color: '#94a3b8'}}>Analyzing... Please wait</p>
             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
           </div>
         )}

         {result && !loading && (
           <ResultPanel result={result} onReanalyze={() => handleScan(lastInput, lastMode)} />
         )}
      </main>
    </div>
  )
}

export default App;
