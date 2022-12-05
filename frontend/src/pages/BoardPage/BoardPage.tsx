import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTableColumns, faList, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';

export default function BoardPage() {
  const params = useParams();

  return (
    <div className='d-flex bg-light page'>
      {/* <p>ID from URL is: {params.boardId}</p> */}
      <div className='d-flex flex-column justify-content-between m-2 nav-bar bg-white'>
          <Logo />

          <div className='d-flex flex-column mx-2 my-5'>
            <h6><b>Your project</b></h6>
            <ul>
              <li><FontAwesomeIcon icon={faTableColumns}/> Dashboard</li>
              <li><FontAwesomeIcon icon={faList} /> Backlog</li>
            </ul>
          </div>

          <div className='d-flex flex-column mx-2 my-5'>
            <h6><b>Account</b></h6>
            <ul>
              <li><FontAwesomeIcon icon={faUserGroup}/> Projects</li>
              <li><FontAwesomeIcon icon={faGear} /> Settings</li>
            </ul>
          </div>

          <div className='d-flex flex-row mx-2 avatar-container'>
            <div className="avatar">U</div>
            <p>User</p>
          </div>
      </div>

      <div className='d-flex m-2 flex-column bg-white board'>
        <div className='d-flex board-page-header p-2 mx-4 my-2'>
          <h1>
            Project Title
          </h1>

          <button type="button" className="plus-button"><FontAwesomeIcon className="plus-icon" icon={faPlus} /></button>
        </div>

        <div className='d-flex w-100 mw-100 task-column-container'>
          <div className='bg-light task-column'>
            <h3>
              Todo
            </h3>
            <div className='bg-white task-box'>
              <p>Secure a domain name</p>
            </div>
            <div className='bg-white task-box'>
              <p>Hold investor meeting</p>
            </div>
          </div>
          <div className='bg-light task-column'>
            <h3>
              In Progress
            </h3>
          </div>
          <div className='bg-light task-column'>
            <h3>
              Done
            </h3>
          </div>

        </div>
      </div>


    </div>
  );
}
