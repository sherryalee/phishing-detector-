import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);

  const checkLink = (e) => {
    e.preventDefault();
    
    if (!url) return;

    let score = 0;
    let reasons = [];

    // Rule 1: Check HTTP vs HTTPS
    if (url.startsWith('http://')) {
      score += 40;
      reasons.push("Insecure Protocol: URL is using HTTP instead of HTTPS (Missing SSL Certificate).");
    }

    // Rule 2: Suspicious Keywords in URL
    const badWords = ['free', 'login', 'verify', 'update', 'bank', 'gift', 'win', 'lucky', 'netflix'];
    badWords.forEach(word => {
      if (url.toLowerCase().includes(word)) {
        score += 30;
        reasons.push(`Suspicious Keyword Detected: The URL contains the high-risk word "${word}".`);
      }
    });

    // Rule 3: Check Suspicious Domains/Extensions
    const badExtensions = ['.xyz', '.top', '.club', '.free', '.live', '.cc'];
    badExtensions.forEach(ext => {
      if (url.toLowerCase().includes(ext)) {
        score += 30;
        reasons.push(`Uncommon Domain Extension: Using "${ext}" which is frequently used in phishing attacks.`);
      }
    });

    // Rule 4: Subdomain flooding (Too many dots)
    const dotCount = (url.match(/\./g) || []).length;
    if (dotCount > 3) {
      score += 20;
      reasons.push("Subdomain Flooding: URL contains too many dots (.), a common technique to spoof legitimate domains.");
    }

    // Final Decision
    if (score >= 60) {
      setResult({ status: 'DANGEROUS', color: '#ff4d4d', reasons });
    } else if (score >= 30) {
      setResult({ status: 'SUSPICIOUS', color: '#ffa500', reasons });
    } else {
      setResult({ status: 'SAFE', color: '#2ecc71', reasons: ['No major phishing indicators or vulnerabilities detected.'] });
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Real-Time Phishing Link Detector</h2>
      <p style={{ color: '#666' }}>Information Security Mini-Project</p>
      
      <form onSubmit={checkLink} style={{ margin: '30px 0' }}>
        <input 
          type="text" 
          placeholder="Paste URL here (e.g., http://free-netflix.xyz)..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '80%', padding: '12px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px 20px', marginLeft: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Analyze
        </button>
      </form>

      {result && (
        <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9', border: `2px solid ${result.color}`, textAlign: 'left' }}>
          <h3>Result: <span style={{ color: result.color }}>{result.status}</span></h3>
          <h4>Vulnerability Report:</h4>
          <ul>
            {result.reasons.map((r, i) => <li key={i} style={{ margin: '8px 0', lineHeight: '1.4' }}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;