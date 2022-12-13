import './BoardTile.css'

interface Props {
    boardname: string;
}

const BoardTile: React.FC<Props> = ({ boardname }) => {

  return (
    <div style={{paddingBottom: '12px'}}>
    <div className="tile" style={{}}>
        <h1 style={{paddingLeft: "2vw", paddingTop: "calc(35px - ((9px + 0.4vw) / 2))", fontSize: 'calc(18px + 0.8vw)'}}>
            {boardname}
        </h1>
    </div>
    </div>
  );
}

export default BoardTile;