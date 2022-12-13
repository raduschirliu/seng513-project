import { useState } from 'react';
import { TestApi } from '../../api/test';
import { Alert, Button, FormControl } from 'react-bootstrap';
import TaskDetails from '../TaskDetails/TaskDetails';
import { IComment, ITask, IUser } from '../../models';
import useApi from '../../state/useApi';
import { TasksApi } from '../../api/tasks';

export default function Example() {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const testApi = useApi(TestApi);
  const taskApi = useApi(TasksApi);

  let ass1: IUser = {
    _id: "0",
    username: "Adam",
    fullName: "Adam",
    avatarUrl: "https://avatars.dicebear.com/api/initials/asdfasdf.svg",
  }
  let ass2: IUser = {
    _id: "1",
    username: "Mark",
    fullName: "Mark",
    avatarUrl: "https://avatars.dicebear.com/api/initials/m.svg",
  }

  const mei: IUser = {
    _id: "1",
    username: "Jon",
    fullName: "Jon",
    avatarUrl: "https://avatars.dicebear.com/api/initials/j.svg",
  }

  const users = [ass1,ass2,mei];

  let com1: IComment = {
    _id: "2",
    authorId: ass1._id,
    message: "This is a very good task",
  }

  let com2: IComment = {
    _id: "3",
    authorId: ass2._id,
    message: "I agree. This is the best task. The reason that this task is so good is because the instructions are so clear and they gave us so much time!",
  }

  let com3: IComment = {
    _id: "5",
    authorId: ass1._id,
    message: "I guess we had better get started on this task now",
  }

  let com4: IComment = {
    _id: "6",
    authorId: ass2._id,
    message: "Ok. But first I need to recipe lorem ipsum",
  }

  let com5: IComment = {
    _id: "7",
    authorId: ass2._id,
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
  }

  const taski: ITask = {
    _id: "4",
    name: "Create more tasks",
    status: "inprogress",
    description: "This is the task. This task is very important. Please do the task quickly but also do it well. You have 1 day to complete this task. If you do not complete this task, you will be fired",
    assignedUserIds: [ass1._id, ass2._id],
    createdBy: ass1._id,
    comments: [com1,com2,com3,com4,com5],
  }

  function sendMessage() {
    testApi.ping(message).then((data) => {
      setResponse(JSON.stringify(data, null, 2));
    });
  }

  return (
    <div>
      <FormControl
        type="text"
        placeholder="Type message..."
        onChange={(event) => {
          setMessage('' + event.target.value);
        }}
      ></FormControl>

      <Button variant="primary" onClick={sendMessage}>
        Send message
      </Button>

      {response.length > 0 && (
        <Alert variant="primary">
          Response from server:
          <br />
          {response}
        </Alert>
      )}
      <div>
      <TaskDetails thetask = {taski} users = {users} me = {mei} api = {taskApi}></TaskDetails>
      </div>
    </div>
  );
}
