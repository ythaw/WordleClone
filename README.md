# 🟩 Wordle Clone – React

A Wordle-style word guessing game built with React.  
This project focuses on state management, game logic, async validation, and clean component architecture.

🔗 **Live Demo:**   
📦 **GitHub Repo:** https://github.com/ythaw/WordleClone  

---

## 🚀 Features

- 6×5 interactive game board
- On-screen and physical keyboard support
- Tile evaluation logic:
  - 🟩 Correct (green)
  - 🟨 Present (yellow)
  - ⬛ Absent (gray)
- Duplicate letter handling (accurate Wordle-style logic)
- Random non-repeating answers using `localStorage`
- Word validation via Datamuse API
- Win / Loss detection
- Restart functionality
- Toast-style error message for invalid words

---

## 🧠 Technical Highlights

- Managed complex nested state (2D arrays) immutably
- Used functional state updates (`prev => ...`) to prevent stale state bugs
- Implemented async validation inside controlled input flow
- Designed scalable component hierarchy:
  - `App`
  - `Board`
  - `Row`
  - `Tile`
  - `Keyboard`
- Persisted answer rotation using `localStorage`
- Prevented answer repetition until full word list cycle completes

---

## 🛠 Tech Stack

- React (Hooks)
- JavaScript (ES6+)
- CSS
- Datamuse API
- LocalStorage

---

## 📂 Project Structure
src/
├── components/
│ ├── Board.jsx
│ ├── Row.jsx
│ ├── Tile.jsx
│ ├── Keyboard.jsx
│ └── Nav.jsx
├── words/
│ └── answers.js
├── App.jsx
└── App.css

---

## 🎯 What I Learned

- How to safely update deeply nested state in React
- How to structure game logic separately from UI components
- Managing keyboard events and user input in React
- Handling async API validation without breaking UX flow
- Designing a scalable and reusable component architecture

---

## 📌 Future Improvements

- Game statistics tracking (win rate, streaks)
- Share results functionality
- Difficulty mode (hard mode constraints)
- Replace API validation with local dictionary for full offline support

---

## ▶️ Run Locally

```bash
npm install
npm run dev

💡 Project Goal

This project was built to deepen my understanding of React state management, event handling, and asynchronous logic in a real-world interactive application.
