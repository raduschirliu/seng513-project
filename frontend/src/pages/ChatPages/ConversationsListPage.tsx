import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { getConversations } from '../../api/chat';
import ConversationCard from '../../components/ConversationCard/ConversationCard';
import TwoColPage from '../../components/Page/TwoColPage';
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
          conversations.map((c) => (
            <Row>
              <Col>
                <ConversationCard key={c._id} conversation={c} />
              </Col>
            </Row>
          ))}
      </Container>
    </TwoColPage>
  );
}
