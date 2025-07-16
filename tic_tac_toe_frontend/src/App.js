import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Minimal Tic Tac Toe Board as a presentational component.
 * @param {Object} props - All props are required for rendering and gameplay logic.
 */
function Board({ squares, onClick, disabled }) {
  return (
    <div className="ttt-board">
      {squares.map((value, i) => (
        <button
          key={i}
          className={`ttt-cell${value ? " filled" : ""}`}
          onClick={() => onClick(i)}
          disabled={!!value || disabled}
          aria-label={`cell ${i + 1}, ${value ? value : "empty"}`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

/**
 * Game status and winner bar component
 */
function StatusBar({ status, winner }) {
  return (
    <div className={`ttt-status${winner ? " winner" : ""}`}>
      {status}
    </div>
  );
}

/**
 * Restart game button
 */
function RestartButton({ onClick }) {
  return (
    <button className="ttt-restart-btn" onClick={onClick}>
      Restart Game!!!
    </button>
  );
}

/**
 * Returns the winner ("X" or "O") or null and optionally the winning line
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // "X" always starts
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [theme, setTheme] = useState("light");

  // Effect to update winner info and check for draw after move
  useEffect(() => {
    const wInfo = calculateWinner(squares);
    setWinnerInfo(wInfo);
    if (!wInfo && squares.every((sq) => sq !== null)) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
    }
  }, [squares]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (squares[i] || winnerInfo) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo(null);
    setIsDraw(false);
  }

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  // PUBLIC_INTERFACE
  function getStatus() {
    if (winnerInfo) {
      return `Winner: ${winnerInfo.winner}!`;
    } else if (isDraw) {
      return "It's a draw!";
    } else {
      return `Next: ${xIsNext ? "X" : "O"}`;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <nav className="ttt-navbar">
          <span className="ttt-title">Tic Tac Toe</span>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </nav>
        <main className="ttt-container">
          <StatusBar status={getStatus()} winner={winnerInfo?.winner} />
          <Board
            squares={squares}
            onClick={handleClick}
            disabled={!!winnerInfo || isDraw}
          />
          <RestartButton onClick={handleRestart} />
        </main>
        <footer className="ttt-footer">
          <span>
            Local 2-player game |{" "}
            <a className="App-link" href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
              React
            </a>
          </span>
        </footer>
      </header>
    </div>
  );
}

export default App;
