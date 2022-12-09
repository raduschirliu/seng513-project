import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Stack,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useInterval } from 'usehooks-ts';
import { getConversation, sendChatMessage } from '../../api/chat';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import { IChatConversation } from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ThreeColPage from '../../components/Page/ThreeColPage';

const CHAT_REFRESH_INTERVAL_MS = 2500;

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
    return <Spinner animation="border" role="status"></Spinner>;
  }

  if (!conversation) {
    return (
      <div>
        <h1>Conversation does not exist</h1>
      </div>
    );
  }

  function SidePage() {
    if (!conversation) return null;

    return (
      <Container>
        <Row>
          <h2>Users:</h2>
        </Row>
        {conversation.users.map((userId) => (
          <Row>
            <p key={userId}>{userId}</p>
          </Row>
        ))}
      </Container>
    );
  }

  return (
    <ThreeColPage sidePane={<SidePage />}>
      <Container>
        <Row>
          <Col>
            <h1>Conversation: {conversation._id}</h1>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <Stack gap={4}>
              {conversation.messages.map((msg) => (
                <ChatMessage
                  key={msg._id}
                  message={msg}
                  sentByMe={msg.author === userId}
                />
              ))}
            </Stack>
          </Col>
        </Row>

        <Row>
          <Col>
            <Stack direction="horizontal" gap={4}>
              <Form.Control
                type="text"
                onChange={(event) => setCurrentMessage(event.target.value)}
              />
              <Button onClick={() => sendMessage()}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </ThreeColPage>
  );
}
