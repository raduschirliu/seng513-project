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
        {conversation.users.map((user) => user.fullName).join(', ')}
      </Card.Body>
    </Card>
  );
}
