import {
  faBars,
  faGear,
  faList,
  faMessage,
  faTableList,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Col, Collapse, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo';
import useAuth from '../../state/auth/useAuth';
import useNav from '../../state/useNav';

function ProjectSection({ boardId }: { boardId: string }) {
  return (
    <div className="d-flex flex-column">
      <h6>
        <b>Your project</b>
      </h6>
      <ul>
        <Link to={`/app/boards/${boardId}`} className="text-decoration-none">
          <li className="nav-element">
            <FontAwesomeIcon icon={faList} /> Dashboard
          </li>
        </Link>
        <Link
          to={`/app/boards/${boardId}/users`}
          className="text-decoration-none"
        >
          <li className="nav-element">
            <FontAwesomeIcon icon={faUserGroup} /> Users
          </li>
        </Link>
      </ul>
    </div>
  );
}

function AccountSection() {
  return (
    <div className="d-flex flex-column">
      <h6>
        <b>Account</b>
      </h6>
      <ul>
        <Link to="/app/boards" className="text-decoration-none">
          <li className="nav-element">
            <FontAwesomeIcon icon={faTableList} /> Projects
          </li>
        </Link>
        <Link to="/app/chat" className="text-decoration-none">
          <li className="nav-element">
            <FontAwesomeIcon icon={faMessage} /> Conversations
          </li>
        </Link>
        <Link to="/app/settings" className="text-decoration-none">
          <li className="nav-element">
            <FontAwesomeIcon icon={faGear} /> Settings
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default function Nav() {
  const { user } = useAuth();
  const { currentBoardId } = useNav();

  const [showMobile, setShowMobile] = useState<boolean>(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="d-flex d-md-none flex-column bg-white h-auto">
        <div className="d-flex flex-row align-content-center">
          <Logo />
          <Button
            className="ms-auto me-4 my-auto h-25"
            variant="outline-primary"
          >
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => {
                setShowMobile((prevValue) => !prevValue);
              }}
            />
          </Button>
        </div>

        <Collapse in={showMobile}>
          <div>
            <div className="d-flex flex-column mb-5 vh-100">
              {currentBoardId && <ProjectSection boardId={currentBoardId} />}
              <AccountSection />

              {/* User settings */}
              <div className="d-flex flex-row align-items-center">
                <img
                  src={user.avatarUrl}
                  className="avatar"
                  alt="User avatar"
                />
                <p className="flex-grow-1 align-middle h-auto m-0 ms-2">
                  {user.fullName}
                </p>
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      <Container className="bg-white h-100 d-none d-md-block">
        <Row>
          <Col>
            <div className="mx-auto">
              <Logo />
            </div>
          </Col>
        </Row>

        <Row className="my-5 py-5">
          <Col>
            {currentBoardId && <ProjectSection boardId={currentBoardId} />}
          </Col>
        </Row>

        <Row className="my-5 py-5">
          <Col>
            <AccountSection />
          </Col>
        </Row>

        {/* User settings */}
        <div className="d-flex flex-row mt-5 pt-5 align-items-center">
          <img src={user.avatarUrl} className="avatar" alt="User avatar" />
          <p className="flex-grow-1 align-middle h-auto m-0 ms-2">
            {user.fullName}
          </p>
        </div>
      </Container>
    </>
  );
}
