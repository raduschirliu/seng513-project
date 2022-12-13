interface Props {
    boardname: string;
}

const BoardTile: React.FC<Props> = ({ boardname }) => {

  return (
    <div style={{paddingBottom: '12px'}}>
    <div style={{border: 'solid #565656 3px', borderRadius: "15px", width: "70vw", height: "100px", textAlign: "center", cursor: 'pointer'}}>
        <h1 style={{paddingLeft: "2vw", paddingTop: "calc(10px + 0.45vw)", fontSize: 'calc(18px + 0.8vw)'}}>
            Board Title
        </h1>
    </div>
    </div>
  );
}

export default BoardTile;