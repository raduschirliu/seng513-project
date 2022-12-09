import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useTimeout } from 'usehooks-ts';
import useInterval from 'usehooks-ts/dist/esm/useInterval/useInterval';
import { getConversation, sendChatMessage } from '../../api/chat';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import { IChatConversation } from '../../models';

const CHAT_REFRESH_INTERVAL_MS = 5000;

// TODO: Replace with actual user ID
const userId = 'test-user-id';

export default function ConversationsPage() {
  const params = useParams();
  const conversationId: string = params.conversationId!;

  const [conversation, setConversation] = useState<IChatConversation | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const refresh = useCallback(() => {
    getConversation(conversationId)
      .then(setConversation)
      .catch((err) => {
        console.error(err);
        setConversation(null);
      })
      .finally(() => setLoading(false));
  }, [conversationId]);

  useInterval(() => {
    refresh();
    console.log('Refreshing conversation...');
  }, CHAT_REFRESH_INTERVAL_MS);

  function sendMessage() {
    sendChatMessage(conversationId, currentMessage).then((msg) => {
      setConversation((prevVal) => {
        if (!prevVal) return null;

        return {
          ...prevVal,
          messages: [...prevVal.messages, msg],
        };
      });
    });

    setCurrentMessage('');
  }

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        Loading...
      </Spinner>
    );
  }

  if (!conversation) {
    return (
      <div>
        <h1>Conversation does not exist</h1>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>Conversation: {conversation._id}</h1>
        <h2>Users:</h2>
        {conversation.users.map((userId) => (
          <p key={userId}>{userId}</p>
        ))}
      </div>
      <div>
        {conversation.messages.map((msg) => (
          <ChatMessage key={msg._id} message={msg} />
        ))}
      </div>
      <div>
        <Form.Control
          type="text"
          onChange={(event) => setCurrentMessage(event.target.value)}
        />
        <Button onClick={() => sendMessage()}>Send message</Button>
      </div>
    </div>
  );
}
