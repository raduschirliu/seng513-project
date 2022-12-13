import moment from 'moment';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { IChatMessage, IUser } from '../../models';

export interface IParams {
  author: IUser;
  message: IChatMessage;
  sentByMe: boolean;
}

export default function ChatMessage({ author, message, sentByMe }: IParams) {
  function MessageBody() {
    return (
      <>
        <p className="m-0 fw-semibold">{author.fullName}</p>
        <Card
          bg={sentByMe ? 'primary' : 'light'}
          text={sentByMe ? 'white' : 'dark'}
        >
          <Card.Body style={{padding: "7px"}}>{message.message}</Card.Body>
        </Card>
        <p className="m-0 fs-6 fst-italic">
          Sent {moment(message.timestamp).calendar()}
        </p>
      </>
    );
  }

  return (
    <Container>
      {/* Either align on left or right, depending on who sent the message */}
      {sentByMe ? (
        <Row>
          <Col></Col>
          <Col>
            <MessageBody />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <MessageBody />
          </Col>
          <Col></Col>
        </Row>
      )}
    </Container>
  );
}
