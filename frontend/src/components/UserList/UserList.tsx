import UserTile from "./UserTile"
import { BoardsApi } from '../../api/boards';
import React, { useState } from 'react';
import useApi from '../../state/useApi';

export default function UserList() {

  const [response, setResponse] = useState<string>('');
  const boardsApi = useApi(BoardsApi);

  function getUsers() {
    let users = [];
    let test = [];
    boardsApi.userList('123').then((data) => {
      setResponse(JSON.stringify(data, null, 2));
    });

    console.log(response);

    if (response === undefined) {
      return [{fullname:"Something Broke", id:0}];
    }

    let lines = response.split('\n');

    for (let line = 3; line < lines.length; line++) {
      if (lines[line].includes(']')) {
        break;
      }
      if (lines[line].includes('{') || lines[line].includes('}')) {
        continue;
      }
    //console.log("Pushing user: " + lines[line]);
    users.push(lines[line].trim());

    }

    for (let i = 0; i < users.length; i++) {
      let tempData = users[i].split(':');
      let extractedName = tempData[0].replaceAll('\"', '');
      let extractedId = parseInt(tempData[1]);
      test.push({fullname:extractedName, id:extractedId});
    }

    return test;
  }

    //console.log(getUsers());
  return (
    <div>
        {getUsers().map(user => (
        <UserTile fullname={user.fullname}/>
        ))}
    </div>
  );
}
