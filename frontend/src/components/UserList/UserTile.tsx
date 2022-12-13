import React from 'react';
import Logo from '../../assets/Logo';
import './UserList.css';

interface Props {
  fullname: string;
}

const UserTile: React.FC<Props> = ({ fullname }) => {
  return (
    <div style={{ paddingRight: '13px', paddingTop: '6px' }}>
      <div className="tile">
        {/* TODO: Get and use avatar url from api */}
        <div className="avatar-container">
          <div className="avatar">
            <h1
              style={{
                fontSize: 'calc(12px + 1vw)',
                paddingTop: 'calc(1px + 0.05vw)',
              }}
            >
              {fullname.charAt(0)}
            </h1>
          </div>
        </div>
        <h3
          style={{
            paddingLeft: '14px',
            paddingTop: 'calc(6px + 0.22vw)',
            fontSize: 'calc(10px + 0.4vw)',
          }}
        >
          {fullname}
        </h3>
      </div>
    </div>
  );
};

export default UserTile;
