import React from "react"
import Logo from '../../assets/Logo';

interface Props {
    fullname: string;
}

const UserTile: React.FC<Props> = ({ fullname }) => {

    return (
      <div style={{paddingRight: "13px", paddingTop: "6px"}}>
        <div style={{display: "flex", backgroundColor: "white", border: 'solid 10px white', borderRadius: "15px",  cursor: "pointer"}}>
            <div className='avatar-container'>
                <div className="avatar" style={{width: 'calc(25px + 1vw)', height: 'calc(25px + 1vw)'}}>
                    <h1 style={{fontSize: 'calc(12px + 1vw)', paddingTop: 'calc(1px + 0.05vw)'}}>{fullname.charAt(0)}</h1>
                </div>
            </div>
            <h3 style={{paddingLeft: "14px", paddingTop: 'calc(6px + 0.22vw)', fontSize: 'calc(10px + 0.4vw)'}}>{fullname}</h3>
        </div>
      </div>
    );
  }

  export default UserTile;