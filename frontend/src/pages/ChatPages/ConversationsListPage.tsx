import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { getConversations } from '../../api/chat';
import ConversationCard from '../../components/ConversationCard/ConversationCard';
import { IChatConversation } from '../../models';

// TODO: Replace with actual user ID
const myUserId = 'test-user-id';

export default function ConversationsListPage() {
  const [conversations, setConversations] = useState<IChatConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getConversations(myUserId)
      .then((data) => {
        console.log(data);
        setConversations(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div>
        <h1>Conversations</h1>
      </div>
      <div>
        {loading && (
          <Spinner animation="border" role="status">
            Loading...
          </Spinner>
        )}

        {!loading &&
          conversations.map((c) => (
            <ConversationCard key={c._id} conversation={c} />
          ))}
      </div>
    </div>
  );
}
