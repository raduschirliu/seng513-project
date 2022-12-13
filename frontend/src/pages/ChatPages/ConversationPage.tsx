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
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import { IChatConversation } from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import useApi from '../../state/useApi';
import { ChatApi } from '../../api/chat';
import useAuth from '../../state/auth/useAuth';
import Page from '../../components/Page/Page';

const CHAT_REFRESH_INTERVAL_MS = 2500;

export default function ConversationsPage() {
  const chatApi = useApi(ChatApi);

  const { user } = useAuth();

  const params = useParams();
  const conversationId: string = params.conversationId!;

  const [conversation, setConversation] = useState<IChatConversation | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const refresh = useCallback(() => {
    chatApi
      .getConversation(conversationId)
      .then((res) => {
        if (res.success) {
          setConversation(res.data);
        } else {
          console.error('Conversation does not exist!');
          setConversation(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setConversation(null);
      })
      .finally(() => setLoading(false));
  }, [chatApi, conversationId]);

  useInterval(() => {
    refresh();
    console.log('Refreshing conversation...');
  }, CHAT_REFRESH_INTERVAL_MS);

  function sendMessage() {
    chatApi.sendChatMessage(conversationId, currentMessage).then((res) => {
      if (!res.success) {
        return;
      }

      const msg = res.data;

      setCurrentMessage('');
      setConversation((prevVal) => {
        if (!prevVal) return null;

        return {
          ...prevVal,
          messages: [...prevVal.messages, msg],
        };
      });
    });
  }

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return <Spinner animation="border" role="status"></Spinner>;
  }

  if (!user) {
    return (
      <div>
        <h1>Not logged in</h1>
      </div>
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
    <Page>
      <Stack direction="horizontal">
        <Container>
          <Row>
            <Col>
              <h1 className="m-2 h-2">Conversation</h1>
            </Col>
          </Row>

          <Row className="my-4">
            <Col>
              <Stack gap={4}>
                {conversation.messages.map((msg) => (
                  <ChatMessage
                    key={msg._id}
                    author={
                      conversation.users.find((u) => u._id === msg.authorId)!
                    }
                    message={msg}
                    sentByMe={msg.authorId === user._id}
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
                  value={currentMessage}
                  onChange={(event) => setCurrentMessage(event.target.value)}
                />
                <Button onClick={() => sendMessage()}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </Stack>
            </Col>
          </Row>
        </Container>

        <div
          className="ms-auto align-items-start justify-content-start"
          style={{ minWidth: '20%' }}
        >
          <Row>
            <h2>Users</h2>
          </Row>
          {conversation.users.map((user) => (
            <Row key={user._id}>
              <div className="d-flex flex-row ml-5 p-1 align-items-center">
                <img
                  src={user.avatarUrl}
                  className="avatar m-2"
                  alt="User avatar"
                />
                <p className="flex-grow-1 align-middle h-auto m-0 ms-2">
                  {user.fullName}
                </p>
              </div>
            </Row>
          ))}
        </div>
      </Stack>
    </Page>
  );
}
