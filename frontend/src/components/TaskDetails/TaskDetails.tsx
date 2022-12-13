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
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { IComment, ITask, IUser } from '../../models';
import './taskdetailstyle.css';
import { TasksApi } from '../../api/tasks';
import useApi from '../../state/useApi';
import useAuth from '../../state/auth/useAuth';

function TaskComment({
  comment,
  users,
}: {
  comment: IComment;
  users: IUser[];
}) {
  return (
    <div className="post">
      <img
        className="commentavatar"
        alt="?"
        src={
          users.find((u: IUser) => {
            return u._id === comment.authorId;
          })?.avatarUrl
        }
      ></img>

      <p className="comment">{comment.message}</p>
    </div>
  );
}

export type TaskDetailsProps = ModalProps & {
  showModal: boolean;
  task: ITask;
  users: IUser[];
  onHide: () => void;
};

export default function TaskDetails({
  showModal,
  task,
  users,
  onHide,
  ...rest
}: TaskDetailsProps) {
  const [newComments, setNewComments] = useState<IComment[]>([]);
  const [mycomment, setMyComment] = useState('');
  const tasksApi = useApi(TasksApi);
  const { user } = useAuth();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleMakeComment();
    setMyComment('');
  };
  const handleMakeComment = () => {
    tasksApi.comment(task._id, mycomment).then((res) => {
      if (!res.success) {
        console.error('Failed to post comment', res.error);
        return;
      }

      setNewComments((prevComments: IComment[]) => {
        return [...prevComments, res.data];
      });
    });
  };
  const handleAddAssigned = () => {
    if (!user) return;

    // TODO(radu): API hookup
    tasksApi.update(task._id, {
      assignedUserIds: [...task.assignedUserIds, user._id],
    });
  };

  if (!showModal || !task) {
    return null;
  }

  let lightclass = '';
  let status = '';
  if (task.status === 'inprogress') {
    status = 'In progress';
    lightclass = 'ylight';
  } else if (task.status === 'todo') {
    status = 'To-do';
    lightclass = 'rlight';
  } else if (task.status === 'done') {
    status = 'completed';
    lightclass = 'glight';
  }
  return (
    <Modal
      {...rest}
      show={showModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="taskdescription"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 className="title">{task.name}</h1>
          <div className="status">
            <span className={lightclass}></span>
            <i className="statusword">{status}</i>
          </div>
        </Modal.Title>
        <button className="xbutton" onClick={onHide}>
          <FontAwesomeIcon className="x-icon" icon={faXmark} />
        </button>
      </Modal.Header>
      <Modal.Body className="dialog">
        <div className="leftdiv">
          <div className="description">
            <h4>Task Description</h4>
            <p>{task.description}</p>
          </div>
          <div className="assigned">
            <h4 className="atitle">Assigned</h4>
            <div className="avatars">
              {task.assignedUserIds.map((user: string, index: Key) => (
                <img
                  key={index}
                  className="taskavatar"
                  alt="?"
                  src={
                    users.find((u: IUser) => {
                      return u._id === user;
                    })?.avatarUrl
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
              {task.comments.map((comment: IComment) => (
                <TaskComment
                  key={comment._id}
                  comment={comment}
                  users={users}
                />
              ))}
              {newComments.map((comment: IComment) => (
                <TaskComment
                  key={comment._id}
                  comment={comment}
                  users={users}
                />
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
      {/* <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
}
