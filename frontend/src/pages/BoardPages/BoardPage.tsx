//@ts-nocheck
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DropResult } from 'react-beautiful-dnd';
import { useState, useEffect, useCallback } from 'react';
import TaskArea from './TaskArea';
import uuid from 'react-uuid';
import { ITask, IBoard } from '../../models';
import useAuth from '../../state/auth/useAuth';
import useApi from '../../state/useApi';
import { BoardsApi } from '../../api/boards';
import { TasksApi } from '../../api/tasks';
import TaskDetails from '../../components/TaskDetails/TaskDetails';
import AddTaskModal from '../../components/AddTask/TaskCreation';
import Page from '../../components/Page/Page';

export interface ColumnInfo {
  name: string;
  items: ITask[];
}
export interface Column {
  [id: string]: ColumnInfo;
}

const defaultBoard: IBoard = {
  _id: 'DEFAULT',
  name: 'Project Name',
  users: [],
  admins: [],
  tasks: [],
};

export default function BoardPage() {
  const { user } = useAuth();

  const boardAPI = useApi(BoardsApi);
  const taskAPI = useApi(TasksApi);
  const [board, setBoard] = useState(defaultBoard);
  const [viewMyTasks, setViewMyTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);

  const toDoId = uuid();
  const inProgressId = uuid();
  const doneId = uuid();

  const { boardId } = useParams<string>();

  const cols = {
    [toDoId]: {
      name: 'To Do',
      items: [] as ITask[],
    },
    [inProgressId]: {
      name: 'In Progress',
      items: [] as ITask[],
    },
    [doneId]: {
      name: 'Done',
      items: [] as ITask[],
    },
  };

  const [columns, setColumns] = useState(cols);

  const refresh = useCallback(() => {
    return boardAPI.get(boardId!).then((data) => {
      if (data.success) {
        setBoard(data.data);
        categorizeTasks(data.data.tasks);
      } else {
        alert('Could not retrieve board. Please try again later');
      }
    });
  });

  useEffect(() => {
    refresh();
  }, []);

  const categorizeTasks = (tasks: ITask[]) => {
    let seperatedTasks = {
      todo: [] as ITask[],
      inprogress: [] as ITask[],
      done: [] as ITask[],
    };
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      seperatedTasks[task.status].push(task);
    }
    const taskCols = {
      [toDoId]: {
        name: 'To Do',
        items: seperatedTasks['todo'],
      },
      [inProgressId]: {
        name: 'In Progress',
        items: seperatedTasks['inprogress'],
      },
      [doneId]: {
        name: 'Done',
        items: seperatedTasks['done'],
      },
    };
    setColumns(taskCols);
  };

  const getItemById = (taskId: string) => {
    if (board.tasks.length !== 0) {
      for (let i = 0; i < board.tasks.length; i++) {
        if (board.tasks[i]._id === taskId) {
          return board.tasks[i];
        }
      }
    }
  };

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
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
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
          items: copiedItems,
        },
      });
    }
  };

  const modifyTask = (task: ITask) => {
    const taskToSend: Partial<ITask> = {
      status: task.status,
    };
    taskAPI.update(task._id, taskToSend).then((data) => {
      console.log(data);
    });
  };

  const onTaskSelected = (task: ITask) => {
    setSelectedTask(task);
  };

  const onDetailsClose = () => {
    setSelectedTask(false);
  };

  const viewMyTasksHandler = () => {
    let tasks: ITask[] = [];
    if (!viewMyTasks) {
      if (board.tasks.length !== 0) {
        const userId = user!._id;
        for (let i = 0; i < board.tasks.length; i++) {
          if (board.tasks[i].assignedUserIds.includes(userId)) {
            tasks.push(board.tasks[i]);
          }
        }
      }
      setViewMyTasks(true);
    } else {
      tasks = board.tasks;
      setViewMyTasks(false);
    }

    categorizeTasks(tasks);
  };

  if (!user) {
    return null;
  }

  return (
    <Page>
      <div className="d-flex board-page-header p-2 mx-4 my-2">
        <h1>{board.name}</h1>

        <button
          type="button"
          className="plus-button"
          onClick={() => setShowAddTaskModal(true)}
        >
          <FontAwesomeIcon className="plus-icon" icon={faPlus} />
        </button>
      </div>

      <div className="d-flex button-container w-100 mw-100">
        <button
          type="button"
          style={{ backgroundColor: viewMyTasks ? '#5772fb' : '#889BFC' }}
          onClick={() => viewMyTasksHandler()}
        >
          {viewMyTasks ? 'View All Tasks' : 'View My Tasks'}
        </button>
      </div>

      <div className="d-flex w-100 mw-100 task-column-container">
        {board ? (
          <TaskArea
            columns={columns}
            onDragEnd={onDragEnd}
            boardusers={[...board.users, ...board.admins]}
            me={user}
            onTaskSelected={onTaskSelected}
          />
        ) : (
          <TaskArea
            columns={columns}
            onDragEnd={onDragEnd}
            boardusers={[...board.users, ...board.admins]}
            me={user}
            onTaskSelected={onTaskSelected}
          />
        )}

        <TaskDetails
          showModal={!!selectedTask}
          task={selectedTask}
          users={[...board.users, ...board.admins]}
          onHide={onDetailsClose}
        />
      </div>

      <AddTaskModal
        boardId={board._id}
        show={showAddTaskModal}
        onTaskAdded={() => refresh()}
        onClose={() => setShowAddTaskModal(false)}
      />
    </Page>
  );
}
