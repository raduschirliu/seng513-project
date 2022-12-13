import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Nav from '../Nav/Nav';
import AuthProtected from '../Page/AuthProtected';

export default function AppRoot() {
  return (
    <Container fluid className="h-100 bg-light">
      <Row className="h-100">
        <Col md={2}>
          <Nav />
        </Col>
        <Col md={10}>
          <AuthProtected>
            <Outlet />
          </AuthProtected>
        </Col>
      </Row>
    </Container>
  );
}
