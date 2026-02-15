import Tile from './Tile.jsx'
export default function Row({ letters = [], statuses = []}){
    const tiles = Array.from({ length: 5 }, (_, i) => letters[i] ?? "");
    const stats = Array.from({ length: 5 }, (_, i) => statuses[i] ?? "");
    return(
        <div className="row">
        {tiles.map((letter, index) => (
            <Tile key = {index} letter = {letter} status = {stats[index]}/>
        ))}
        </div>
    )
}