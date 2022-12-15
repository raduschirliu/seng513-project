import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet, useParams } from 'react-router-dom';
import useNav from '../../state/useNav';
import Nav from '../Nav/Nav';
import AuthProtected from '../Page/AuthProtected';
import './AppRoot.css';

export default function AppRoot() {
  const params = useParams();
  const { setCurrentBoardId } = useNav();

  useEffect(() => {
    if (params.boardId) {
      setCurrentBoardId(params.boardId);
    }
  }, [params, setCurrentBoardId]);

  return (
    <div className="AppRoot-container bg-light">
      <div className="AppRoot-nav">
        <Nav />
      </div>
      <div className="AppRoot-content">
        <AuthProtected>
          <Outlet />
        </AuthProtected>
      </div>
    </div>
  );
}
