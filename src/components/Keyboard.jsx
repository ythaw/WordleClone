const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
];
export default function Keyboard({ onKey = () => {} }) {
  return (
    <div className="keyboard">
      {ROWS.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => (
            <button
              key={key}
              className={`key ${key === "ENTER" || key === "DEL" ? "key-wide" : ""}`}
              type="button"
              onClick={() => onKey(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
