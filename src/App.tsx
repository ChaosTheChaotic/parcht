import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [command, setCommand] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();

    // Retry focusing with increasing delays
    const retryFocus = () => {
      let attempts = 0;
      const maxAttempts = 5;

      const tryFocus = () => {
        if (
          !document.hasFocus() ||
          document.activeElement !== inputRef.current
        ) {
          focusInput();
          attempts++;
        }

        if (attempts < maxAttempts) {
          setTimeout(tryFocus, 100 * Math.pow(2, attempts));
        }
      };

      setTimeout(tryFocus, 300);
    };

    window.addEventListener("focus", retryFocus);
    return () => window.removeEventListener("focus", retryFocus);
  }, []);

  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      );
      setYear(now.toLocaleString([], { year: "numeric" }));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  // Terminal commands functionality
  const executeCommand = () => {
    window.location.href = `https://google.com/search?q=${encodeURIComponent(command)}`;

    setCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") executeCommand();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <div className={`app ${isLoaded ? "loaded" : ""}`}>
      {/* Header with clock */}
      <div className="header">
        <div className="terminal-prompt">
          <svg
            className="prompt-symbol"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              fill="currentColor"
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
            />
          </svg>
        </div>
        <div className="clock">{time}</div>
        <div className="date-year-container">
          <div className="year">{year}</div>
          <div className="date">{date}</div>
        </div>
      </div>

      {/* Main terminal area */}
      <div className="terminal" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-header">
          <div className="terminal-title">chaos@chaosfox: ~</div>
        </div>

        <div className="terminal-body">
          <div className="output"></div>
          <div className="output-line">
            {getGreeting()} Chaos. Please search below.
          </div>
        </div>

        <div className={`input-line ${isInputFocused ? "input-active" : ""}`}>
          <span className="prompt">~ $</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            autoFocus
            spellCheck={false}
            placeholder="Search here ..."
          />
          {command === "" && showCursor && <span className="cursor"></span>}
        </div>
      </div>
    </div>
  );
};

export default App;
