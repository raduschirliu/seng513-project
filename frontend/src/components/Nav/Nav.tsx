import {
  faGear,
  faList,
  faMessage,
  faTableList,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo';
import useAuth from '../../state/auth/useAuth';
import useNav from '../../state/useNav';

function ProjectSection({ boardId }: { boardId: string }) {
  return (
    <div>
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
    <div>
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

  if (!user) {
    return null;
  }

  return (
    <Container className="bg-white h-100">
      <Row>
        <Col>
          <div className="mx-auto">
            <Logo />
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {currentBoardId && <ProjectSection boardId={currentBoardId} />}
        </Col>
      </Row>

      <Row>
        <Col>
          <AccountSection />
        </Col>
      </Row>

      {/* User settings */}
      <div className="d-flex flex-row">
        <img
          src={user.avatarUrl}
          width={64}
          className="rounded-circle"
          alt="User avatar"
        />
        <p className="flex-grow-1 align-middle h-auto m-0 ms-2">
          {user.fullName}
        </p>
      </div>
    </Container>
  );
}
