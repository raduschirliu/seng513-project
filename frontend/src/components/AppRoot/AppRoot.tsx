import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet, useParams } from 'react-router-dom';
import useNav from '../../state/useNav';
import Nav from '../Nav/Nav';
import AuthProtected from '../Page/AuthProtected';

export default function AppRoot() {
  const params = useParams();
  const { setCurrentBoardId } = useNav();

  useEffect(() => {
    if (params.boardId) {
      setCurrentBoardId(params.boardId);
    }
  }, [params, setCurrentBoardId]);

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
