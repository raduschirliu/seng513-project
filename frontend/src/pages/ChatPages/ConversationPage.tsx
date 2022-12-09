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
    <Container>
      <Row>
        <Col md={2}>Navbar goes here</Col>

        <Col md={8}>
          <Container>
            <Row>
              <h1>Conversation: {conversation._id}</h1>
            </Row>

            <Row>
              {conversation.messages.map((msg) => (
                <ChatMessage
                  key={msg._id}
                  message={msg}
                  sentByMe={msg.message === 'first message'}
                />
              ))}
            </Row>

            <Row>
              <Stack direction="horizontal">
                <Form.Control
                  type="text"
                  onChange={(event) => setCurrentMessage(event.target.value)}
                />
                <Button onClick={() => sendMessage()}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </Stack>
            </Row>
          </Container>
        </Col>

        <Col>
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
        </Col>
      </Row>
    </Container>
  );
}
