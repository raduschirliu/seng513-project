import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTableColumns, faList, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import CreateBoardModal from './CreateBoardModal';
import BoardTile from './BoardTile';
import { Button } from 'react-bootstrap';
import { BoardsApi } from '../../api/boards';
import useApi from '../../state/useApi';
import React, { useState } from 'react';


export default function JoinedBoardsPage() {

  const [response, setResponse] = useState<string>('');
  const boardsApi = useApi(BoardsApi);

  function getBoards() {
    let temp = [];
    let test = [];
    boardsApi.getAll().then((data) => {
      setResponse(JSON.stringify(data, null, 2));
    });

    console.log(response);

    if (response === undefined) {
      return [{name:"Something Broke", id:0}];
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
    temp.push(lines[line].trim());

    }

    if (temp.length < 1) {
      return [{name:"Something Broke", id:0}, {name:"No Boards Found", id:0}];
    }

    for (let i = 0; i < temp.length; i++) {
      let tempData = temp[i].split(':');
      let extractedName = tempData[0].replaceAll('\"', '');
      let extractedId = parseInt(tempData[1]);
      test.push({name:extractedName, id:extractedId});
    }

    return test;
  }

  let enteredId = "";

  function updateId(newId: string) {
    enteredId = newId;
  }

  function joinBoard() {
    boardsApi.join(enteredId).then((data) => {
      setResponse(JSON.stringify(data, null, 2));
    });

    console.log(response);
  }

  return (
    <div className='d-flex bg-light page'>
      {/* <p>ID from URL is: {params.boardId}</p> */}
      <div className='d-flex flex-column justify-content-between m-2 nav-bar bg-white'>
        <Logo />

        <div className='d-flex flex-column mx-2 my-5'>
          <h6><b>Your project</b></h6>
          <ul>
            <li className='nav-element'><FontAwesomeIcon icon={faTableColumns} /> Dashboard</li>
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
          <div className="avatar">U</div>
          <p>User</p>
        </div>
      </div>

      <div className='d-flex flex-column m-2 bg-white board'>
        <div className='d-flex flex-row' style={{paddingTop: "12px", paddingLeft: "6vw"}}>
          <h1 style={{}}>
            Your Projects
          </h1>
          <div style={{position: "absolute", right: "8.2vw", top: "20px"}}>
            <CreateBoardModal></CreateBoardModal>
          </div>
        </div>
        <div className='d-flex flex-column' style={{paddingTop: "52px", paddingLeft: "6vw"}}>
          {getBoards().map(board => (
            <BoardTile boardname={board.name}/>
          ))}
          <div style={{border: 'solid #9f9f9f 3px', display: "flex", flexDirection: "row", borderRadius: "15px", width: "70vw", height: "100px", textAlign: "left"}}>
        <div style={{paddingTop: "15px", paddingLeft: "20px"}}>
          <input type="text" placeholder="Enter project code" style={{height: "60px", width: "290px", textAlign: "center", fontSize: "30px"}} onInput={e => updateId(e.currentTarget.value)}></input>
        </div>
        <div style={{paddingTop: "22px", marginLeft: "auto", marginRight: '28px'}}>
          <Button style={{width: "100px", height: "50px"}} onClick={joinBoard}>Join</Button>
        </div>
    </div>
        </div>
      </div>
      
      
      </div>
  );
}
