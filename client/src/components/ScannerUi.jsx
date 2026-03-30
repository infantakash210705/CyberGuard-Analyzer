import React, { useState, useRef } from 'react';

function ScannerUi({ onScan }) {
  const [mode, setMode] = useState('FILE');
  const [url, setUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (url) {
      onScan(url, 'URL');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onScan(e.target.files[0], 'FILE');
    }
  };

  return (
    <div className="home-wrapper">
      <div className="big-logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <svg viewBox="0 0 24 24" style={{ width: 100, height: 100, filter: 'drop-shadow(0 0 16px rgba(179, 65, 244, 0.4))' }}>
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#5577ff" />
              <stop offset="100%" stopColor="#b341f4" />
            </linearGradient>
          </defs>
          <path fill="url(#shieldGrad)" opacity="0.2" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          <path fill="none" stroke="url(#shieldGrad)" strokeWidth="1.5" d="M12 1.5l-8.5 3.78v5.72c0 5.14 3.56 9.94 8.5 11.13 4.94-1.19 8.5-5.99 8.5-11.13v-5.72L12 1.5z" />
          <path fill="url(#shieldGrad)" d="M12 5.5c-2.76 0-5 2.24-5 5 0 2.22 1.43 4.11 3.42 4.79v-2.1a3.003 3.003 0 011.58-5.69 3.003 3.003 0 011.58 5.69v2.1A4.986 4.986 0 0012 5.5z" />
        </svg>
        <div style={{ textAlign: 'center', lineHeight: '1.2' }}>
          <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '56px', fontWeight: '800', color: 'white', letterSpacing: '4px' }}>CYBERGUARD</div>
          <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '24px', fontWeight: '600', color: 'var(--secondary)', letterSpacing: '12px' }}>ANALYZER</div>
        </div>
      </div>

      <p className="home-subtitle">
        Analyse suspicious files, domains, IPs and URLs to detect malware and other breaches, automatically checking them against local intelligence.
      </p>

      <div className="tabs-container">
        <button className={`tab ${mode === 'FILE' ? 'active' : ''}`} onClick={() => setMode('FILE')}>FILE</button>
        <button className={`tab ${mode === 'URL' ? 'active' : ''}`} onClick={() => setMode('URL')}>URL</button>
        <button className={`tab ${mode === 'SEARCH' ? 'active' : ''}`} onClick={() => setMode('SEARCH')}>SEARCH</button>
      </div>

      <div className="input-area-wrapper">
        {mode === 'FILE' && (
          <>
            <div className="upload-icon-wrapper">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div style={{ color: 'var(--text-main)', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', marginTop: '-45px', marginBottom: '20px', zIndex: 10, position: 'relative' }}>Max size 650MB</div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="action-btn primary" onClick={() => fileInputRef.current.click()}>
              Choose file
            </button>
          </>
        )}

        {mode === 'URL' && (
          <>
            <div className="upload-icon-wrapper" style={{ marginBottom: '40px' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
            </div>
            <form onSubmit={handleUrlSubmit} className="url-input-container">
              <input
                type="text"
                placeholder="Search or scan a URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </form>
            <button className="action-btn" onClick={handleUrlSubmit} style={{ marginTop: '20px' }}>
              Search
            </button>
          </>
        )}

        {mode === 'SEARCH' && (
          <>
            <div className="upload-icon-wrapper" style={{ marginBottom: '40px' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <form onSubmit={handleUrlSubmit} className="url-input-container">
              <input
                type="text"
                placeholder="Search URL, IP address, domain or file hash"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </form>
            <button className="action-btn" onClick={handleUrlSubmit} style={{ marginTop: '20px' }}>
              Search
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '60px', paddingBottom: '40px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
        &copy; 2026 Infant Akash W | CyberGuard Analyzer | All rights reserved.<br />
        Unauthorized use, reproduction, or distribution is strictly prohibited.
      </div>
    </div>
  );
}

export default ScannerUi;
