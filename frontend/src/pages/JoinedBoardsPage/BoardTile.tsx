import { Link } from 'react-router-dom';
import { IBoard } from '../../models';
import './BoardTile.css';

interface Props {
  board: IBoard;
}

export default function BoardTile({ board }: Props) {
  return (
    <div style={{ paddingBottom: '12px' }}>
      <div className="board-tile" style={{}}>
        <Link to={`/app/boards/${board._id}`}>
          <h1
            style={{
              paddingLeft: '20px',
              fontSize: '20px',
            }}
          >
            {board.name}
          </h1>
        </Link>
      </div>
    </div>
  );
}
