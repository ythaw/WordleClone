import Row from './Row.jsx'
export default function Board({boardState, statusState}){
    const defaultBoard = Array.from({ length: 6 }, () => Array(5).fill(""));
    const defaultStatus = Array.from({ length: 6 }, () => Array(5).fill(""));
    const board = boardState ?? defaultBoard;
    const statuses = statusState ?? defaultStatus;
    return (
        <div className="board">
            {board.map((rowLetters, index) => (
                <Row key={index} letters={rowLetters}  statuses={statuses[index]} />
            ))}
        </div>
    );
}