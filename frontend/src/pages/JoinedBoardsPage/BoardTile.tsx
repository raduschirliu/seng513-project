import { Link } from 'react-router-dom';
import { IBoard } from '../../models';
import './BoardTile.css';

interface Props {
  board: IBoard;
}

export default function BoardTile({ board }: Props) {
  return (
    <div style={{ paddingBottom: '12px' }}>
      <div className="tile" style={{}}>
        <Link to={`/app/boards/${board._id}`}>
          <h1
            style={{
              paddingLeft: '2vw',
              paddingTop: 'calc(35px - ((9px + 0.4vw) / 2))',
              fontSize: 'calc(18px + 0.8vw)',
            }}
          >
            {board.name}
          </h1>
        </Link>
      </div>
    </div>
  );
}
