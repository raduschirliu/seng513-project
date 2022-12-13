import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IChatConversation } from '../../models';

interface IProps {
  conversation: IChatConversation;
}

export default function ConversationCard({ conversation }: IProps) {
  const navigate = useNavigate();

  return (
    <Card role="button" onClick={() => navigate(`/app/chat/${conversation._id}`)}>
      <Card.Body>
        <img className='chatavatar' src={conversation.users[0].avatarUrl}></img>
        <p style={{display: "inline", paddingRight: "10px"}}>{conversation.users[0].fullName},</p>
        <img className='chatavatar' src={conversation.users[1].avatarUrl}></img>
        <p style={{display: "inline"}}>{conversation.users[1].fullName}</p>
        
      </Card.Body>
    </Card>
  );
}
