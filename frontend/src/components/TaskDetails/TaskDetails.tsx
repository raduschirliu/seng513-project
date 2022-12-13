import { Key, useState } from 'react';
import uuid from 'react-uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faXmark,
  faTableColumns,
  faList,
  faGear,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IComment, ITask, IUser } from '../../models';
import './taskdetailstyle.css';

function MyVerticallyCenteredModal(props: any) {
  const [comments, setComments] = useState(props.task.comments);
  const [assigned, setAssigned] = useState(props.task.assigned);
  const [users, s] = useState(props.users);
  const [me, a] = useState(props.me);
  const [mycomment, setMyComment] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleMakeComment();
    setMyComment('');
  };
  const handleMakeComment = () => {
    setComments((prevComments: IComment[]) => [
      ...prevComments,
      { _id: 0, authorId: me.username, message: mycomment },
    ]);
  };
  const handleAddAssigned = () => {
    if (!assigned.some((item: string) => me.username === item)) {
      setAssigned((prevAssigned: string[]) => [...prevAssigned, me.username]);
    }
  };

  let lightclass = '';
  let status = '';
  if (props.task.status === 'inprogress') {
    status = 'In progress';
    lightclass = 'ylight';
  } else if (props.task.status === 'todo') {
    status = 'To-do';
    lightclass = 'rlight';
  } else if (props.task.status === 'done') {
    status = 'completed';
    lightclass = 'glight';
  }
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="taskdescription"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 className="title">{props.task.name}</h1>
          <div className="status">
            <span className={lightclass}></span>
            <i className="statusword">{status}</i>
          </div>
        </Modal.Title>
        <button className="xbutton" onClick={props.onHide}>
          <FontAwesomeIcon className="x-icon" icon={faXmark} />
        </button>
      </Modal.Header>
      <Modal.Body className="dialog">
        <div className="leftdiv">
          <div className="description">
            <h4>Task Description</h4>
            <p>{props.task.description}</p>
          </div>
          <div className="assigned">
            <h4 className="atitle">Assigned</h4>
            <div className="avatars">
              {assigned.map((user: string, index: Key) => (
                <img
                  key={index}
                  className="taskavatar"
                  alt="?"
                  src={
                    users.find((u: IUser) => {
                      return u.username === user;
                    }).avatarUrl
                  }
                ></img>
              ))}
              <button
                onClick={handleAddAssigned}
                type="button"
                className="task-plus-button"
              >
                <FontAwesomeIcon className="plus-icon" icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
        <div className="comments">
          <h4>Comments</h4>
          <div className="innercomments">
            <div className="commentbox">
              {comments.map((comment: IComment, index: Key) => (
                <div className="post" key={index}>
                  <img
                    className="commentavatar"
                    alt="?"
                    src={
                      users.find((u: IUser) => {
                        return u.username === comment.authorId;
                      }).avatarUrl
                    }
                  ></img>

                  <p className="comment">{comment.message}</p>
                </div>
              ))}
            </div>
            <div className="writebox">
              <form onSubmit={handleSubmit}>
                <input
                  className="input"
                  placeholder="write a comment"
                  value={mycomment}
                  onChange={(e) => setMyComment(e.target.value)}
                ></input>
                <input className="send" type="submit"></input>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/*
        <Button onClick={props.onHide}>Close</Button>*/}
      </Modal.Footer>
    </Modal>
  );
}

export default function TaskDetails(props: {
  thetask: ITask;
  users: IUser[];
  me: IUser;
}) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        {props.thetask.name}
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        task={props.thetask}
        users={props.users}
        me={props.me}
      />
    </>
  );
}
