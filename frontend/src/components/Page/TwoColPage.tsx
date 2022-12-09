import { Card, Col, Container, Row } from 'react-bootstrap';
import Nav from '../Nav/Nav';

export interface IProps {
  children?: React.ReactNode;
}

export default function TwoColPage({ children }: IProps) {
  return (
    <Container>
      <Row>
        <Col md={2}>
          <Nav />
        </Col>
        <Col>{children}</Col>
      </Row>
    </Container>
  );
}
