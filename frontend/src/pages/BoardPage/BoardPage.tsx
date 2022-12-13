//@ts-nocheck
import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTableColumns, faList, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { DropResult } from 'react-beautiful-dnd';
import { useState, useEffect, useCallback } from 'react';
import { useInterval } from 'usehooks-ts';
import TaskArea from './TaskArea';
import uuid from "react-uuid";
import { IUser, ITask, IBoard } from '../../models';
import useAuth from '../../state/auth/useAuth';
import useApi from '../../state/useApi';
import { BoardsApi } from '../../api/boards';
import { TasksApi } from '../../api/tasks';
import AddTask from '../../components/AddTask/TaskCreation';
import UserList from '../../components/UserList/UserList'

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
  const taskAPI = useApi(TasksApi);
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

  const refresh = useCallback(() => {
    return boardAPI.get(boardId!).then((data) => {
      if (data.success){
        setBoard(data.data);
        categorizeTasks(data.data.tasks);
      }
      else{
        alert("Could not retrieve board. Please try again later");
      }
    });
  })

  useEffect(() => {
    refresh();
  }, []);

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

  const getItemById = (taskId: string) => {
    if (board.tasks.length !== 0){
      for (let i=0; i<board.tasks.length; i++){
        if (board.tasks[i]._id === taskId){
          return board.tasks[i];
        }
      }
    }
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

      const task = getItemById(result.draggableId);
      modifyTask(task);

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

  const addTask = (task: ITask) => {
    // TODO: complete

    // Opens a new task window to edit task details
    // Add task to database
    <AddTask></AddTask>    
  }

  const modifyTask = (task: ITask) => {
    const taskToSend: Partial<ITask> = {
      status: task.status
    }
    taskAPI.update(task._id, taskToSend).then( (data) => {
      console.log(data);
    });
  }

  const getTasks = () => {
    // TODO: complete
    
    // Retrieves tasks from the database/server
  }

  const viewMyTasksHandler = () => {
    let tasks: ITask[] = [];
    if (!viewMyTasks){
      if (board.tasks.length !== 0){
        const userId = user!._id;
        for (let i=0; i<board.tasks.length; i++){
          if (board.tasks[i].assignedUserIds.includes(userId)){
            tasks.push(board.tasks[i]);
          }
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
          {board? <TaskArea columns={columns} onDragEnd={onDragEnd}/>: <TaskArea columns={columns} onDragEnd={onDragEnd}/>}
        </div >
      </div >
      <div style={{width: "19%", minWidth: "265px", paddingLeft: "0.5vw", paddingTop: "12px"}}>
        <div>
          <UserList/>
        </div>
      </div>
    </div >
  );
}
