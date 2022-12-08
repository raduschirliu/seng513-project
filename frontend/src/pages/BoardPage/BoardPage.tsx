import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTableColumns, faList, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { Draggable, Droppable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import TaskArea from './TaskArea';
import uuid from "react-uuid";
import { IUser, ITask, IBoard } from '../../../models';

export interface Column{
  [x: string]: {
      name: string;
      items: ITask[];
  };
}

export default function BoardPage(user: IUser, board: IBoard) {
  const params = useParams();
  const [toDo, setToDoTasks] = useState([] as ITask[]);
  const [inProgress, setInProgressTasks] = useState([] as ITask[]);
  const [complete, setDoneTasks] = useState([] as ITask[]);
  const cols: Column = {
    [uuid()]: {
      name: "To Do",
      items: toDo
    },
    [uuid()]: {
      name: "In Progress",
      items: inProgress
    },
    [uuid()]: {
      name: "Done",
      items: complete
    }
  }
  const [columns, setColumns] = useState(cols);

  useEffect(() => {
    const categorizeTasks = (tasks: ITask[]) => {
      let seperatedTasks = {'todo': [] as ITask[], 'inprogress': [] as ITask[], 'done': [] as ITask[]}
      for (let i=0; i< tasks.length; i++){
        const task = tasks[i];
        seperatedTasks[task.status].push(task);
      }
      setToDoTasks(seperatedTasks['todo']);
      setInProgressTasks(seperatedTasks['inprogress']);
      setDoneTasks(seperatedTasks['done']);
    }

    categorizeTasks(board.tasks);
  })

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const addTask = () => {
    // TODO: complete

    // Opens a new task window to edit task details
    // Add task to database
  }

  const getTasks = () => {
    // TODO: complete
    
    // Retrieves tasks from the database/server
  }

  return (
    <div className='d-flex bg-light page'>
      {/* <p>ID from URL is: {params.boardId}</p> */}
      <div className='d-flex flex-column justify-content-between m-2 nav-bar bg-white'>
        <Logo />

        <div className='d-flex flex-column mx-2 my-5'>
          <h6><b>Your project</b></h6>
          <ul>
            <li className='nav-element cur-element'><FontAwesomeIcon icon={faTableColumns} /> Dashboard</li>
            <li className='nav-element'><FontAwesomeIcon icon={faList} /> Backlog</li>
          </ul>
        </div>

        <div className='d-flex flex-column mx-2 my-5'>
          <h6><b>Account</b></h6>
          <ul>
            <li className='nav-element'><FontAwesomeIcon icon={faUserGroup} /> Projects</li>
            <li className='nav-element'><FontAwesomeIcon icon={faGear} /> Settings</li>
          </ul>
        </div>

        <div className='d-flex flex-row mx-2 avatar-container'>
          <div className="avatar">{user.name[0]}</div>
          <p>{user.name}</p>
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
          <TaskArea columns={cols} onDragEnd={onDragEnd}/>
        </div >
      </div >
    </div >
  );
}
