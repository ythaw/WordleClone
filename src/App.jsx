import { useEffect, useState } from "react";
import Board from "./components/Board.jsx";
import Keyboard from "./components/Keyboard.jsx";
import Nav from "./components/Nav.jsx";
import { ANSWERS } from "./words/answers";
import "./App.css";

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getNextAnswer(answers) {
  // We store a shuffled "deck" + index in localStorage
  const deckKey = "wordle_answer_deck_v1";
  const idxKey = "wordle_answer_index_v1";

  let deck = JSON.parse(localStorage.getItem(deckKey) || "null");
  let idx = Number(localStorage.getItem(idxKey) || "0");

  // If first time or list changed size, rebuild deck
  if (!Array.isArray(deck) || deck.length !== answers.length) {
    deck = shuffle(answers);
    idx = 0;
  }

  // If we've used them all, reshuffle and start over (still “no repeats” until deck resets)
  if (idx >= deck.length) {
    deck = shuffle(answers);
    idx = 0;
  }

  localStorage.setItem(deckKey, JSON.stringify(deck));
  localStorage.setItem(idxKey, String(idx + 1));

  return deck[idx];
}

async function isValidWordDatamuse(word) {
  // word should be uppercase; Datamuse expects lowercase
  const w = word.toLowerCase();

  // Query exact spelling pattern, limit results
  const res = await fetch(`https://api.datamuse.com/words?sp=${w}&max=1`);
  if (!res.ok) return false;

  const data = await res.json();
  return data.length > 0 && data[0].word === w;
}

function evaluateGuess(guess, answer) {
  const result = Array(5).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");

  // mark correct first
  const used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
      guessArr[i] = null;
    }
  }

  // mark present second
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] == null) continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessArr[i] === answerArr[j]) {
        result[i] = "present";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

function getBetterStatus(oldStatus, newStatus) {
  const priority = { correct: 3, present: 2, absent: 1, undefined: 0 };
  return priority[newStatus] > (priority[oldStatus] ?? 0)
    ? newStatus
    : oldStatus;
}

export default function App() {
  const emptyBoard = Array.from({ length: 6 }, () => Array(5).fill(""));
  const emptyStatus = Array.from({ length: 6 }, () => Array(5).fill(""));

  const [board, setBoard] = useState(emptyBoard);
  const [status, setStatus] = useState(emptyStatus);
  const [keyStatuses, setKeyStatuses] = useState({});

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const [answer, setAnswer] = useState(() => getNextAnswer(ANSWERS));
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const resetGame = () => {
    setBoard(emptyBoard.map((r) => [...r]));
    setStatus(emptyStatus.map((r) => [...r]));
    setKeyStatuses({});
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setWon(false);
    setMessage("");
    setIsChecking(false);

    setAnswer(getNextAnswer(ANSWERS));
  };

  const handleKey = (rawKey) => {
    if (gameOver) return; // lock input after game ends

    const key = String(rawKey).toUpperCase();

    // letters A-Z
    if (key.length === 1 && key >= "A" && key <= "Z") {
      if (currentRow < 6 && currentCol < 5) {
        setBoard((prev) => {
          const next = prev.map((r) => [...r]);
          next[currentRow][currentCol] = key;
          return next;
        });
        setCurrentCol((c) => c + 1);
      }
      return;
    }

    // delete/backspace
    if (key === "BACKSPACE" || key === "DEL") {
      if (currentCol > 0) {
        setBoard((prev) => {
          const next = prev.map((r) => [...r]);
          next[currentRow][currentCol - 1] = "";
          return next;
        });
        setCurrentCol((c) => c - 1);
      }
      return;
    }

    // enter -> evaluate
    if (key === "ENTER") {
      if (currentCol !== 5) return;
      if (isChecking) return;

      const guess = board[currentRow].join("");

      setIsChecking(true);
      setMessage("");

      (async () => {
        const ok = await isValidWordDatamuse(guess);
        if (!ok) {
          setMessage("Not in dictionary");
          setIsChecking(false);

          const timer = setTimeout(() => {
            setMessage("");
          }, 700);

          return;
        }

        const rowStatuses = evaluateGuess(guess, answer);

        setStatus((prev) => {
          const next = prev.map((r) => [...r]);
          next[currentRow] = rowStatuses;
          return next;
        });

        setKeyStatuses((prev) => {
          const updated = { ...prev };
          for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            const newStatus = rowStatuses[i];
            updated[letter] = getBetterStatus(updated[letter], newStatus);
          }
          return updated;
        });

        if (rowStatuses.every((s) => s === "correct")) {
          setWon(true);
          setGameOver(true);
          setIsChecking(false);
          return;
        }

        if (currentRow === 5) {
          setGameOver(true);
          setWon(false);
          setIsChecking(false);
          return;
        }

        setCurrentRow((r) => r + 1);
        setCurrentCol(0);
        setIsChecking(false);
      })();

      return;
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => handleKey(e.key);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameOver, currentRow, currentCol, board]); // gameOver included so listener respects lock

  return (
    <div className="app">
      <Nav></Nav>
      <div className="board-div">
        <Board boardState={board} statusState={status} />
      </div>

      {message && (
        <div className="overlay">
          <div className="msgpopup">
            <div className="message">{message}</div>
          </div>
        </div>
      )}

      <div className="keyboard-div">
        <Keyboard
          onKey={handleKey}
          keyStatuses={keyStatuses}
          disabled={gameOver}
        />
      </div>

      {gameOver && (
        <div className="overlay">
          <div className="popup">
            <h2>{won ? "You win!" : "Game over"}</h2>
            {!won && <p className="small">Answer: {answer}</p>}
            <button className="restart" onClick={resetGame}>
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
