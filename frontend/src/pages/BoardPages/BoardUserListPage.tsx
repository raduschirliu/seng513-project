import { useState } from 'react';
import { useParams } from 'react-router';
import { useEffectOnce } from 'usehooks-ts';
import { BoardsApi } from '../../api/boards';
import Page from '../../components/Page/Page';
import UserList from '../../components/UserList/UserList';
import { IBoard } from '../../models';
import useApi from '../../state/useApi';

export default function BoardUserListPage() {
  const params = useParams();
  const boardId = params.boardId! as string;

  const [board, setBoard] = useState<IBoard | null>(null);
  const boardsApi = useApi(BoardsApi);

  useEffectOnce(() => {
    boardsApi.get(boardId).then((res) => {
      if (!res.success) {
        console.error('Error getting board', res.error);
        return;
      }

      setBoard(res.data);
    });
  });

  return (
    <Page>
      {board ? (
        <>
          <UserList title="Admins" users={board.admins} />
          <UserList title="Users" users={board.users} />
        </>
      ) : (
        <p>Board does not exist</p>
      )}
    </Page>
  );
}
