import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTableColumns,
  faList,
  faGear,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import CreateBoardModal from './CreateBoardModal';
import BoardTile from './BoardTile';
import { Button } from 'react-bootstrap';
import { BoardsApi } from '../../api/boards';
import useApi from '../../state/useApi';
import React, { useCallback, useEffect, useState } from 'react';
import useAuth from '../../state/auth/useAuth';
import { IBoard } from '../../models';
import Page from '../../components/Page/Page';
import { useEffectOnce } from 'usehooks-ts';

export default function JoinedBoardsPage() {
  const { user } = useAuth();
  const boardsApi = useApi(BoardsApi);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [enteredId, setEnteredId] = useState<string>('');

  const refreshBoards = useCallback(() => {
    boardsApi.getAll().then((data) => {
      if (data.success) {
        setBoards(data.data);
      } else {
        alert('Could not load boards: ' + data.error);
      }
    });
  }, [boardsApi]);

  useEffectOnce(() => {
    refreshBoards();
  });

  function updateId(newId: string) {
    setEnteredId(newId);
  }

  function joinBoard() {
    boardsApi
      .join(enteredId)
      .then((data) => {
        if (!data.success) {
          alert('Failed to join board: ' + data.error);
          return;
        }

        refreshBoards();
      })
      .catch((err) => {
        alert('Please enter a valid board ID');
      });
  }

  return (
    <Page>
      <div className="d-flex flex-column m-2 bg-white board">
        <div
          className="d-flex flex-row"
          style={{ paddingTop: '12px', paddingLeft: '6vw' }}
        >
          <h1 style={{}}>Your Projects</h1>
          <div style={{ position: 'absolute', right: '8.2vw', top: '20px' }}>
            <CreateBoardModal />
          </div>
        </div>
        <div
          className="d-flex flex-column"
          style={{ paddingTop: '52px', paddingLeft: '6vw' }}
        >
          {boards.length === 0 ? (
            <p>No boards found</p>
          ) : (
            boards.map((board) => <BoardTile key={board._id} board={board} />)
          )}

          <div
            style={{
              border: 'solid #9f9f9f 3px',
              display: 'flex',
              flexDirection: 'row',
              borderRadius: '15px',
              width: '60vw',
              height: '100px',
              textAlign: 'left',
            }}
          >
            <div style={{ paddingTop: '15px', paddingLeft: '20px' }}>
              <input
                type="text"
                placeholder="Enter project code"
                style={{
                  height: '60px',
                  width: '290px',
                  textAlign: 'center',
                  fontSize: '30px',
                }}
                onInput={(e) => updateId(e.currentTarget.value)}
              ></input>
            </div>
            <div
              style={{
                paddingTop: '22px',
                marginLeft: 'auto',
                marginRight: '28px',
              }}
            >
              <Button
                style={{
                  width: '100px',
                  height: '50px',
                  backgroundColor: '#889BFC',
                }}
                onClick={joinBoard}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
