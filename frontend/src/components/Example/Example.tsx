import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ping } from '../../api/test';
import { Alert, Button, FormControl } from 'react-bootstrap';
import TaskDetails from '../TaskDetails/TaskDetails';
import { IComment, ITask, IUser } from '../../../models';

export default function Example() {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  let ass1: IUser = {
    id: "0",
    name: "Adam",
    email: "",
    avatarUrl: "https://avatars.dicebear.com/api/initials/asdfasdf.svg",
  }
  let ass2: IUser = {
    id: "1",
    name: "Mark",
    email: "",
    avatarUrl: "https://avatars.dicebear.com/api/initials/m.svg",
  }

  let com1: IComment = {
    author: ass1,
    message: "This is a very good task",
  }

  let com2: IComment = {
    author: ass2,
    message: "I agree. This is the best task. The reason that this task is so good is because the instructions are so clear and they gave us so much time!",
  }

  const taski: ITask = {
    id: "0",
    name: "Create more tasks",
    status: "inprogress",
    description: "This is the task. This task is very important. Please do the task quickly but also do it well. You have 1 day to complete this task. If you do not complete this task, you will be fired",
    assigned: [ass1,ass2],
    comments: [com1,com2],
  }

  function sendMessage() {
    ping(message).then((data) => {
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
      <TaskDetails
        {...taski}
      ></TaskDetails>
      </div>
    </div>
  );
}
