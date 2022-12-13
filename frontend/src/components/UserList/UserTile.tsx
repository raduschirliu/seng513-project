import { IUser } from '../../models';
import './UserList.css';

export interface Props {
  user: IUser;
}

export default function UserTile({ user }: Props) {
  return (
    <div style={{ paddingRight: '13px', paddingTop: '6px' }}>
      <div className="tile">
        <div className="avatar-container">
          <div className="avatar">
            <img src={user.avatarUrl} alt="User avatar" />
          </div>
        </div>
        <h3
          style={{
            paddingLeft: '14px',
            paddingTop: 'calc(6px + 0.22vw)',
            fontSize: 'calc(10px + 0.4vw)',
          }}
        >
          {user.fullName}
        </h3>
      </div>
    </div>
  );
}
