import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTableColumns, faList, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { DropResult } from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import TaskArea from './TaskArea';
import uuid from "react-uuid";
import { IUser, ITask, IBoard } from '../../models';
import useAuth from '../../state/auth/useAuth';
import useApi from '../../state/useApi';
import { BoardsApi } from '../../api/boards';
import AddTask from '../../components/AddTask/TaskCreation';

export interface ColumnInfo{
  name: string;
  items: ITask[];
}
export interface Column{
  [id: string]: ColumnInfo;
}

const defaultBoard: IBoard = {
  _id: "DEFAULT",
  name: "Project Name",
  users: [],
  tasks: [],
}

export default function BoardPage() {
  const { user } = useAuth();
  const boardAPI = useApi(BoardsApi);
  const [board, setBoard] = useState(defaultBoard);
  const [viewMyTasks, setViewMyTasks] = useState(false);

  const toDoId = uuid();
  const inProgressId = uuid();
  const doneId = uuid();

  const { boardId } = useParams<string>();

  const cols = {
    [toDoId]: {
      name: "To Do",
      items: [] as ITask[]
    },
    [inProgressId]: {
      name: "In Progress",
      items: [] as ITask[]
    },
    [doneId]: {
      name: "Done",
      items: [] as ITask[]
    }
  }

  const [columns, setColumns] = useState(cols);

  useEffect(() => {
    const displayTasks = (tasks: ITask[]) => {
      categorizeTasks(tasks);
    }

    const retrieveBoard = () => {
      getBoard();
    }

    displayTasks(board.tasks);
    retrieveBoard();
  }, [])

  const getBoard = () => {
    return boardAPI.get(boardId!).then((data) => {
      if (data.success){
        setBoard(data.data);
        return;
      }
      alert("Could not retrieve board. Please try again later");
    });
  }

  const categorizeTasks = (tasks: ITask[]) => {
    let seperatedTasks = {'todo': [] as ITask[], 'inprogress': [] as ITask[], 'done': [] as ITask[]}
    for (let i=0; i< tasks.length; i++){
      const task = tasks[i];
      seperatedTasks[task.status].push(task);
    }
    const taskCols = {
      [toDoId]: {
        name: "To Do",
        items: seperatedTasks["todo"]
      },
      [inProgressId]: {
        name: "In Progress",
        items: seperatedTasks["inprogress"]
      },
      [doneId]: {
        name: "Done",
        items: seperatedTasks["done"]
      }
    };
    setColumns(taskCols);
  }

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

      // TO DO: call PUT /tasks/{id} to modify task status

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

  function addTask(props: any) {
    // TODO: complete

    // Opens a new task window to edit task details
    // Add task to database
    <AddTask></AddTask>    
    
  }

  const getTasks = () => {
    // TODO: complete
    
    // Retrieves tasks from the database/server
  }

  const viewMyTasksHandler = () => {
    let tasks: ITask[] = [];
    if (!viewMyTasks){
      const userName = user!.username;
      for (let i=0; i<board.tasks.length; i++){
        if (board.tasks[i].assigned.includes(userName)){
          tasks.push(board.tasks[i]);
        }
      }
      setViewMyTasks(true);
    } else{
      tasks = board.tasks;
      setViewMyTasks(false);
    }
    
    categorizeTasks(tasks);
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
          <div className="avatar">{user!.fullName[0]}</div>
          <p>{user!.fullName}</p>
        </div>
      </div>

      <div className='d-flex m-2 flex-column bg-white board'>
        <div className='d-flex board-page-header p-2 mx-4 my-2'>
          <h1>
            {board.name}
          </h1>

          <button type="button" className="plus-button"><FontAwesomeIcon className="plus-icon" icon={faPlus} /></button>
        </div>

        <div className='d-flex button-container w-100 mw-100'>
          <button type="button" style={{backgroundColor: viewMyTasks? "#5772fb": "#889BFC"}} onClick={() => viewMyTasksHandler()}>
            {viewMyTasks? 'View All Tasks' : 'View My Tasks'}
          </button>
        </div>

        <div className='d-flex w-100 mw-100 task-column-container'>
          <TaskArea columns={cols} onDragEnd={onDragEnd}/>
        </div >
      </div >
    </div >
  );
}
