const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","DEL"],
];

export default function Keyboard({ onKey = () => {}, keyStatuses = {}, disabled = false }) {
  return (
    <div className="keyboard">
      {ROWS.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((k) => (
            <button
              key={k}
              className={`key ${k === "ENTER" || k === "DEL" ? "key-wide" : ""} ${keyStatuses[k] ?? ""}`}
              type="button"
              onClick={() => { if (!disabled) onKey(k); }}
              disabled={disabled}
            >
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
