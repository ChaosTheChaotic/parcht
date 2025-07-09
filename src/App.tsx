import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [command, setCommand] = useState('');

  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
      setYear(now.toLocaleString([], {year: 'numeric'}));
    };
    
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Terminal commands functionality
  const executeCommand = () => {
    window.location.href = `https://google.com/search?q=${encodeURIComponent(command)}`;
    
    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') executeCommand();
  };

  // Quick links data
  const quickLinks = [
    { name: 'github', url: 'https://github.com' },
    { name: 'reddit', url: 'https://reddit.com' },
    { name: 'youtube', url: 'https://youtube.com' },
    { name: 'gmail', url: 'https://mail.google.com' },
  ];

  return (
    <div className="app">
      {/* Header with clock */}
      <div className="header">
        <div className="terminal-prompt">
	  <svg className="prompt-symbol" viewBox="0 0 24 24" width="20" height="20">
  	    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
  	  </svg>
        </div>
	<div className="clock">{time}</div>
	<div className="date-year-container">
  	  <div className="year">{year}</div>
  	  <div className="date">{date}</div>
  	</div>
      </div>

      {/* Main terminal area */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-title">chaos@chaosfox: ~</div>
        </div>
        
        <div className="terminal-body">
          <div className="output">
          </div>
          
          <div className="input-line">
            <span className="prompt">~ $</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              placeholder="Search here"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        {quickLinks.map((link, i) => (
          <a 
            key={i} 
            href={link.url} 
            className="link-button"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default App;
