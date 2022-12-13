import { Card, Col, Container, Row } from 'react-bootstrap';
import Nav from '../Nav/Nav';

export interface IProps {
  children?: React.ReactNode;
  sidePane?: React.ReactNode;
}

export default function ThreeColPage({ children, sidePane }: IProps) {
  return (
    <Container>
      <Row>
        <Col md={2}>
          <Nav />
        </Col>
        <Col>{children}</Col>
        <Col md={2}>{sidePane}</Col>
      </Row>
    </Container>
  );
}
