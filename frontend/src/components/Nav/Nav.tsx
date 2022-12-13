import {
  faGear,
  faList,
  faTableColumns,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '../../assets/Logo';
import useAuth from '../../state/auth/useAuth';

export default function Nav() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="d-flex flex-column justify-content-between bg-white h-100">
      <Logo />

      <div className="d-flex flex-column mx-2 my-5">
        <h6>
          <b>Your project</b>
        </h6>
        <ul>
          <li className="nav-element cur-element">
            <FontAwesomeIcon icon={faTableColumns} /> Dashboard
          </li>
          <li className="nav-element">
            <FontAwesomeIcon icon={faList} /> Backlog
          </li>
        </ul>
      </div>

      <div className="d-flex flex-column mx-2 my-5">
        <h6>
          <b>Account</b>
        </h6>
        <ul>
          <li className="nav-element">
            <FontAwesomeIcon icon={faUserGroup} /> Projects
          </li>
          <li className="nav-element">
            <FontAwesomeIcon icon={faGear} /> Settings
          </li>
        </ul>
      </div>

      <div className="d-flex flex-row mx-2 avatar-container">
        <div className="avatar">{user!.fullName[0]}</div>
        <p>{user!.fullName}</p>
      </div>
    </div>
  );
}
