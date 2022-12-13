import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IChatConversation } from '../../models';

interface IProps {
  conversation: IChatConversation;
}

export default function ConversationCard({ conversation }: IProps) {
  const navigate = useNavigate();

  return (
    <Card role="button" onClick={() => navigate(`/chat/${conversation._id}`)}>
      <Card.Body>Users: {conversation.users.join(', ')}</Card.Body>
    </Card>
  );
}
