import UserTile from "./UserTile"
import { BoardsApi } from '../../api/boards';
import React, { useState } from 'react';
import useApi from '../../state/useApi';

export default function UserList() {

  const [response, setResponse] = useState<string>('');
  const boardsApi = useApi(BoardsApi);

  function getUsers() {
    let temp = [];
    let users = [];
    // TODO replace '123' with real board id
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
      temp.push(lines[line].trim());

    }

    for (let i = 0; i < temp.length; i++) {
      let tempData = temp[i].split(':');
      let extractedName = tempData[0].replaceAll('\"', '');
      let extractedId = parseInt(tempData[1]);
      users.push({fullname:extractedName, id:extractedId});
    }

    if (users.length < 1) {
      return [{fullname:"Something Broke", id:0}, {fullname:"ListLength IsZero", id:1}, {fullname:"Not Working", id:2}, {fullname:"Plz Fix", id:3}];
    }

    return users;
  }

  return (
    <div>
      <h2>
        Board Members
      </h2>
        {getUsers().map(user => (
        <UserTile fullname={user.fullname}/>
        ))}
    </div>
  );
}
