import { useState } from 'react';
import { useParams } from 'react-router';
import { useEffectOnce } from 'usehooks-ts';
import { BoardsApi } from '../../api/boards';
import { ChatApi } from '../../api/chat';
import Page from '../../components/Page/Page';
import UserList from '../../components/UserList/UserList';
import { IBoard } from '../../models';
import useAuth from '../../state/auth/useAuth';
import useApi from '../../state/useApi';

export default function BoardUserListPage() {
  const params = useParams();
  const boardId = params.boardId! as string;

  const [board, setBoard] = useState<IBoard | null>(null);
  const boardsApi = useApi(BoardsApi);
  const { user } = useAuth();

  useEffectOnce(() => {
    boardsApi.get(boardId).then((res) => {
      if (!res.success) {
        console.error('Error getting board', res.error);
        return;
      }

      setBoard(res.data);
    });
  });

  if (!user) {
    return null;
  }

  return (
    <Page>
      {board ? (
        <>
          <div className="pb-2">
            <h1 className="p-2 m-2">Board details</h1>
            <p className="ms-5">Board ID: {boardId}</p>
          </div>

          <UserList title="Admins" users={board.admins} currentUser={user} />
          <UserList title="Users" users={board.users} currentUser={user} />
        </>
      ) : (
        <p>Board does not exist</p>
      )}
    </Page>
  );
}
