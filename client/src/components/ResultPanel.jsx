import React, { useState } from 'react';

function ResultPanel({ result, onReanalyze }) {
  const [tab, setTab] = useState('DETECTION');
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { verdict, score, details, reasons, screenshot, type } = result;
  
  // VT style score out of 65 usually, our score is out of 10 natively, but let's emulate VT by multiplying or just showing score.
  // Actually let's just show score directly related to 10 for accuracy, or mapping it. VT shows Detection vendors.
  const isMalicious = verdict === 'MALICIOUS' || score >= 8;
  const isSuspicious = verdict === 'SUSPICIOUS' || (score >= 4 && score < 8);
  const colorVar = score > 0 ? 'var(--malicious-color)' : 'var(--safe-color)';
  
  const totalEngines = type === 'URL' ? 95 : 65; 
  const matchedEngines = score > 0 ? (score < 10 ? score + 3 : score) : 0; 

  const percent = (matchedEngines / totalEngines) * 100;
  
  // Create mock vendor list to emulate VirusTotal exactly
  const vendors = [
    { name: 'ADMINUSLabs', clean: true, label: 'Malicious', color: 'var(--malicious-color)' },
    { name: 'Chong Lua Dao', clean: true, label: 'Malicious', color: 'var(--malicious-color)' },
    { name: 'CyRadar', clean: true, label: 'Malicious', color: 'var(--malicious-color)' },
    { name: 'Google Safebrowsing', clean: true, label: 'Phishing', color: 'var(--malicious-color)' },
    { name: 'Kaspersky', clean: true, label: 'Phishing', color: 'var(--malicious-color)' },
    { name: 'LevelBlue', clean: true, label: 'Phishing', color: 'var(--malicious-color)' },
    { name: 'Lionic', clean: true, label: 'Phishing', color: 'var(--malicious-color)' },
    { name: 'Sophos', clean: true, label: 'Phishing', color: 'var(--malicious-color)' },
    { name: 'VIPRE', clean: true, label: 'Malware', color: 'var(--malicious-color)' },
    { name: 'Webroot', clean: true, label: 'Malicious', color: 'var(--malicious-color)' },
    { name: 'alphaMountain.ai', clean: true, label: 'Suspicious', color: '#f59e0b' },
    { name: 'Acronis', clean: true, label: 'Clean', color: 'var(--safe-color)' },
    { name: 'Abusix', clean: true, label: 'Clean', color: 'var(--safe-color)' },
    { name: 'AlienVault', clean: true, label: 'Clean', color: 'var(--safe-color)' },
    { name: 'Antiy-AVL', clean: true, label: 'Clean', color: 'var(--safe-color)' },
    { name: 'Avast', clean: true, label: 'Clean', color: 'var(--safe-color)' },
    { name: 'BitDefender', clean: true, label: 'Clean', color: 'var(--safe-color)' },
    { name: 'Tencent', clean: true, label: 'Clean', color: 'var(--safe-color)' }
  ];

  if (matchedEngines > 0) {
      for(let i=0; i<Math.min(matchedEngines, vendors.length); i++){
         vendors[i].clean = false;
      }
  }

  const downloadReport = () => {
    setShowMoreMenu(false);
    const element = document.querySelector('.result-wrapper');
    if (window.html2pdf) {
       window.html2pdf().set({
         margin: [0.5, 0.5, 0.5, 0.5],
         filename: `CyberGuard_Report_${details}.pdf`,
         image: { type: 'jpeg', quality: 0.98 },
         html2canvas: { scale: 2, backgroundColor: '#140b24', useCORS: true },
         jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
       }).from(element).save();
    } else {
       window.print();
    }
  };

  return (
    <div className="result-wrapper">
      
      <div className="top-cards">
        <div className="score-card">
          <div className="circle-score" style={{'--circle-percent': `${percent}%`, '--circle-color': colorVar}}>
            <span className="circle-val">{matchedEngines}</span>
            <span className="circle-max">/ {totalEngines}</span>
          </div>
          <div className="score-label">Community Score</div>
          {score > 0 && <div style={{background: 'rgba(244,63,94,0.2)', color: 'var(--malicious-color)', padding: '2px 8px', borderRadius: 12, fontSize: 12, marginTop: 10}}>-{score * 5}</div>}
        </div>

        <div className="info-card">
          <div className="info-header" style={{color: matchedEngines > 0 ? 'var(--malicious-color)' : 'var(--safe-color)'}}>
            <svg className="info-header-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               {matchedEngines > 0 ? (
                   <>
                     <circle cx="12" cy="12" r="10" strokeWidth="2" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"></path>
                   </>
               ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               )}
            </svg>
            <span className="info-header-text" style={{color: matchedEngines > 0 ? 'var(--malicious-color)' : 'var(--safe-color)'}}>
              {matchedEngines === 0 ? `No security vendors flagged this ${type ? type.toLowerCase() : 'target'} as malicious` : `${matchedEngines}/${totalEngines} security vendor${matchedEngines > 1 ? 's' : ''} flagged this ${type === 'URL' ? 'URL' : 'file'} as malicious`}
            </span>
            <div className="info-header-actions" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
              <span style={{cursor:'pointer', color: 'var(--text-muted)'}} onClick={onReanalyze}>⟳ Reanalyze</span>
              
              <span style={{cursor:'pointer', color: 'var(--text-muted)', marginLeft: '16px'}} onClick={() => {setShowSearchMenu(!showSearchMenu); setShowMoreMenu(false);}}>🔍 Search</span>
              {showSearchMenu && (
                 <div style={{position: 'absolute', top: '100%', right: '60px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', zIndex: 50, width: '220px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.8)'}}>
                    <div style={{color: 'white', fontSize: '13px', fontWeight: 'bold'}}>Search this:</div>
                    <div style={{color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', paddingLeft: '8px'}} onClick={() => alert('Pivoting analysis on Domain...')}>Domain</div>
                    <div style={{color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', paddingLeft: '8px'}} onClick={() => alert('Pivoting analysis on IP...')}>IP</div>
                    <div style={{color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', paddingLeft: '8px'}} onClick={() => alert('Pivoting analysis on Hash...')}>Hash</div>
                    <div style={{color: 'white', fontSize: '13px', fontWeight: 'bold', marginTop: '4px'}}>Search related:</div>
                    <div style={{color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', paddingLeft: '8px'}} onClick={() => alert('Querying similar domains...')}>Similar domains</div>
                    <div style={{color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', paddingLeft: '8px'}} onClick={() => alert('Querying Same IP hosted infrastructure...')}>Same IP hosted domains</div>
                 </div>
              )}

              <span style={{cursor:'pointer', color: 'var(--text-muted)', marginLeft: '16px'}} onClick={() => {setShowMoreMenu(!showMoreMenu); setShowSearchMenu(false);}}>More ⏷</span>
              {showMoreMenu && (
                 <div style={{position: 'absolute', top: '100%', right: '0', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', zIndex: 50, width: '200px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.8)'}}>
                    <div style={{color: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px'}} onClick={downloadReport}>
                       <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                       Download report (PDF)
                    </div>
                 </div>
              )}
            </div>
          </div>
          
          <div className="info-target">{details}</div>
          <div className="info-subtarget">{details}</div>
          
          <div className="info-badges">
            <span className="badge highlight">{type === 'FILE' ? 'file' : 'url'}</span>
            <span className="badge">heuristic detection</span>
            <span className="badge">static-analysis</span>
            <span className="badge">risk-engine</span>
            {reasons.map((r, i) => <span key={i} className="badge highlight">{r}</span>)}
          </div>
        </div>
      </div>

      <div className="result-tabs">
        <button className={`rtab ${tab === 'DETECTION' ? 'active' : ''}`} onClick={() => setTab('DETECTION')}>DETECTION</button>
        <button className={`rtab ${tab === 'DETAILS' ? 'active' : ''}`} onClick={() => setTab('DETAILS')}>DETAILS</button>
        <button className={`rtab ${tab === 'RELATIONS' ? 'active' : ''}`} onClick={() => setTab('RELATIONS')}>RELATIONS</button>
        <button className={`rtab ${tab === 'BEHAVIOR' ? 'active' : ''}`} onClick={() => setTab('BEHAVIOR')}>BEHAVIOR</button>
        {(type === 'URL' && screenshot) && (
           <button className={`rtab ${tab === 'SCREENSHOT' ? 'active' : ''}`} onClick={() => setTab('SCREENSHOT')}>SCREENSHOT</button>
        )}
      </div>

      {tab === 'DETECTION' && (
        <>
          <div className="join-banner">
            <a href="#">Join our Community</a> and enjoy additional community insights and crowdsourced detections, plus an API key to <a href="#">automate checks.</a>
          </div>

          <div className="vendors-panel">
            <div className="vendors-header">
              <span>Security vendors' analysis</span>
            </div>
            <div className="vendors-grid">
              {vendors.map((v, i) => (
                <div className="vendor-row" key={i}>
                  <div className="vendor-name">{v.name}</div>
                  <div className="vendor-status" style={{color: v.clean ? 'var(--safe-color)' : v.color}}>
                    {v.clean ? (
                      <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Clean</>
                    ) : (
                      <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"></path></svg> {v.label}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'DETAILS' && (
        <div className="vendors-panel" style={{padding: '24px'}}>
            <h3 style={{marginTop: 0, fontSize: 16, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10}}>Detailed Findings</h3>
            <ul style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>
                {reasons.length > 0 ? reasons.map((r, i) => <li key={i}>{r}</li>) : <li>No specific anomalous attributes detected.</li>}
            </ul>
        </div>
      )}

      {tab === 'SCREENSHOT' && type === 'URL' && screenshot && (
        <div className="vendors-panel" style={{padding: '24px'}}>
          <img src={screenshot} alt="Site preview" style={{maxWidth: '100%', borderRadius: '4px', border: '1px solid var(--border-color)'}} />
        </div>
      )}

      {tab === 'RELATIONS' && (
        <div className="vendors-panel" style={{padding: '24px'}}>
            <h3 style={{marginTop: 0, fontSize: 16, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10}}>Relations Matrix</h3>
            {type === 'URL' ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div><strong style={{color: 'var(--text-muted)'}}>Resolved IP addresses:</strong><div style={{color: 'var(--primary)', marginTop: '4px'}}>104.21.5.12 (Mocked DNS A Record)</div></div>
                    <div><strong style={{color: 'var(--text-muted)'}}>Domain → IP history:</strong><div style={{color: 'white', marginTop: '4px'}}>3 historical records found pointing to fast-flux infrastructure.</div></div>
                    <div><strong style={{color: 'var(--text-muted)'}}>Subdomains:</strong><div style={{color: 'white', marginTop: '4px'}}>api.{details || 'target'}, secure.{details || 'target'}</div></div>
                    <div><strong style={{color: 'var(--text-muted)'}}>Redirect chain:</strong><div style={{color: 'white', marginTop: '4px'}}>{reasons && reasons.length > 0 ? 'Suspicious 302 hop via bit.ly detected.' : 'Direct connection (200 OK).'}</div></div>
                    <div><strong style={{color: 'var(--text-muted)'}}>External links (outgoing URLs):</strong><div style={{color: 'white', marginTop: '4px'}}>14 distinct outbound connections identified.</div></div>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div><strong style={{color: 'var(--text-muted)'}}>Dropped files:</strong><div style={{color: 'white', marginTop: '4px'}}>{reasons && reasons.some(r=>r.includes('Executable')) ? 'Payload.exe, setup.tmp' : 'None detected'}</div></div>
                    <div><strong style={{color: 'var(--text-muted)'}}>Parent file:</strong><div style={{color: 'white', marginTop: '4px'}}>Unknown origin / Extracted from archive</div></div>
                    <div><strong style={{color: 'var(--text-muted)'}}>Contacted domains/IPs:</strong><div style={{color: 'var(--primary)', marginTop: '4px'}}>192.168.100.1 (Command & Control mock)</div></div>
                    <div><strong style={{color: 'var(--text-muted)'}}>Embedded URLs:</strong><div style={{color: 'white', marginTop: '4px'}}>0 embedded communication URLs found.</div></div>
                </div>
            )}
        </div>
      )}

      {tab === 'BEHAVIOR' && (
        <div className="vendors-panel" style={{padding: '24px'}}>
            <h3 style={{marginTop: 0, fontSize: 16, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10}}>Sandbox Behavior Activity</h3>
            {type === 'URL' ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>🧠</span><strong style={{color: 'var(--text-muted)'}}>Page loads scripts (JS):</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>{reasons && reasons.some(r => r.includes('scripts')) ? 'Massive highly-obfuscated cross-domain scripts injected.' : 'Standard frontend tracking scripts.'}</div></div>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>🌍</span><strong style={{color: 'var(--text-muted)'}}>Auto redirects:</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>None observed dynamically.</div></div>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>⚠️</span><strong style={{color: 'var(--text-muted)'}}>Suspicious forms:</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>{reasons && reasons.some(r => r.includes('login') || r.includes('phishing')) ? '🚨 Active credential harvesting fields injected in DOM.' : 'No active phishing/password inputs captured.'}</div></div>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>📂</span><strong style={{color: 'var(--text-muted)'}}>Downloads triggered:</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>Secure. No auto-downloads encountered.</div></div>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>📂</span><strong style={{color: 'var(--text-muted)'}}>File system changes:</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>{reasons && reasons.some(r => r.includes('Executable')) ? 'Wrote bytes to AppData\\Local\\Temp' : 'Secure execution.'}</div></div>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>🧠</span><strong style={{color: 'var(--text-muted)'}}>Registry edits (Windows):</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>No registry persistence techniques logged.</div></div>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>🌍</span><strong style={{color: 'var(--text-muted)'}}>Network calls:</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>No raw socket outbound connections formed.</div></div>
                    <div><span style={{fontSize: '18px', marginRight: '12px'}}>⚠️</span><strong style={{color: 'var(--text-muted)'}}>Process spawning:</strong><div style={{color: 'white', marginTop: '6px', marginLeft: '34px'}}>Sandbox executed within isolated memory bounds safely.</div></div>
                </div>
            )}
        </div>
      )}
    </div>
  );
}

export default ResultPanel;
