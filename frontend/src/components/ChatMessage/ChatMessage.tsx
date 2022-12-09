import { Card, Col, Container, Row } from 'react-bootstrap';
import { IChatMessage } from '../../models';

export interface IParams {
  message: IChatMessage;
  sentByMe: boolean;
}

export default function ChatMessage({ message, sentByMe }: IParams) {
  function Header() {
    return <p>{message.author}</p>;
  }

  function Body() {
    return (
      <Card>
        <Card.Body>{message.message}</Card.Body>
      </Card>
    );
  }

  function Swappable({ comp }: any) {
    return sentByMe ? (
      <Row>
        <Col></Col>
        <Col>{comp}</Col>
      </Row>
    ) : (
      <Row>
        <Col>{comp}</Col>
        <Col></Col>
      </Row>
    );
  }

  return (
    <Container>
      <Swappable comp={<Header />} />
      <Swappable comp={<Body />} />
    </Container>
  );
}
