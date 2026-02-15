import { useEffect, useState } from "react";

import "./App.css";
import Keyboard from "./components/Keyboard.jsx";
import Board from "./components/Board.jsx";

const ANSWER = "PLANT"; // hardcoded
function evaluateGuess(guess, answer) {
  const result = Array(5).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const ANSWER = "PLANT"; // hardcoded for now

  // mark correct first
  const used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
      guessArr[i] = null; // consume this guess letter
    }
  }

  // mark present (yellow) second, handling duplicates
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
export default function App() {
  const [board, setBoard] = useState(
    Array.from({ length: 6 }, () => Array(5).fill("")),
  );
  const [status, setStatus] = useState(
    Array.from({ length: 6 }, () => Array(5).fill("")),
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameState, setGameState] = useState("playing"); // "playing" | "won" | "lost"

  const handleKey = (rawKey) => {
    if (gameState !== "playing") return;
    const key = rawKey.toUpperCase();

    // letters A-Z
    if (key.length === 1 && key >= "A" && key <= "Z") {
      if (currentRow < 6 && currentCol < 5) {
        const newBoard = [];
        for (let i = 0; i < board.length; i++) {
          newBoard.push([...board[i]]);
        }
        newBoard[currentRow][currentCol] = key;
        setBoard(newBoard);
        setCurrentCol((prev) => prev + 1);
      }
      return;
    }
    if (key === "BACKSPACE" || key === "DEL") {
      if (currentCol > 0) {
        const newBoard = [];
        for (let i = 0; i < board.length; i++) {
          newBoard.push([...board[i]]);
        }
        newBoard[currentRow][currentCol - 1] = "";
        setBoard(newBoard);
        setCurrentCol((prev) => prev - 1);
        /*
        setBoard((prev) => {
          const next = prev.map((r) => [...r]);
          next[currentRow][currentCol - 1] = "";
          return next;
        });
        setCurrentCol((c) => c - 1);
        */
      }
      return;
    }
    if (key === "ENTER") {
      if (currentCol !== 5) return; // must be full row

      const guess = board[currentRow].join("");
      const rowStatuses = evaluateGuess(guess, ANSWER);

      const isWin = rowStatuses.every((s) => s === "correct");
      setStatus((prev) => {
        const next = prev.map((r) => [...r]);
        next[currentRow] = rowStatuses;
        return next;
      });

      if (isWin) {
        setGameState("won");
      } else if (currentRow === 5) {
        setGameState("lost");
      }

      // move to next row
      if (!isWin && currentRow < 5) {
        setCurrentRow((r) => r + 1);
        setCurrentCol(0);
      }
    }
  };
  useEffect(() => {
    const onKeyDown = (e) => handleKey(e.key);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentRow, currentCol]);

  return (
    <div className="app">
      <div className="board-div">
        <Board boardState={board} statusState={status} />
      </div>
      <div className="keyboard-div">
        <Keyboard onKey={handleKey} />
      </div>
    </div>
  );
}
