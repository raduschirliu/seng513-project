import { useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useEffectOnce } from 'usehooks-ts';
import { ChatApi } from '../../api/chat';
import ConversationCard from '../../components/ConversationCard/ConversationCard';
import TwoColPage from '../../components/Page/TwoColPage';
import { IChatConversation } from '../../models';
import useApi from '../../state/useApi';

export default function ConversationsListPage() {
  const chatApi = useApi(ChatApi);
  const [conversations, setConversations] = useState<IChatConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffectOnce(() => {
    chatApi
      .getConversations()
      .then((res) => {
        if (!res.success) {
          console.error(res);
          return;
        }

        console.log(res.data);
        setConversations(res.data);
      })
      .finally(() => setLoading(false));
  });

  return (
    <TwoColPage>
      <Container>
        <Row>
          <Col>
            <h1>Conversations</h1>
          </Col>
        </Row>

        {loading && (
          <Row>
            <Col>
              <Spinner animation="border" role="status"></Spinner>
            </Col>
          </Row>
        )}

        {!loading &&
          conversations.map((conversation) => (
            <Row key={conversation._id}>
              <Col>
                <ConversationCard conversation={conversation} />
              </Col>
            </Row>
          ))}
      </Container>
    </TwoColPage>
  );
}
