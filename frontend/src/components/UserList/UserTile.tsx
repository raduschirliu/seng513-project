import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { ChatApi } from '../../api/chat';
import { IUser } from '../../models';
import useApi from '../../state/useApi';
import './UserList.css';

export interface Props {
  user: IUser;
  hideStartChat?: boolean;
}

export default function UserTile({ user, hideStartChat }: Props) {
  const chatApi = useApi(ChatApi);
  const navigate = useNavigate();

  const startChat = () => {
    chatApi.startConversation([user._id]).then((res) => {
      if (!res.success) {
        console.error('Failed to create chat', res.error);
        return;
      }

      navigate(`/app/chat/${res.data._id}`);
    });
  };

  return (
    <div className='p-2 m-2'>
      <div className="tile align-items-center p-2">
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
        {!hideStartChat && <Button className="m-2 p-2" onClick={() => startChat()}>Chat</Button>}
      </div>
    </div>
  );
}
