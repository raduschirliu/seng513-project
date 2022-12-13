import UserTile from './UserTile';
import { IUser } from '../../models';

export type Props = {
  title: string;
  users: IUser[];
};

export default function UserList({ title, users }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      <div>
        {users.map((user) => (
          <UserTile user={user} />
        ))}
      </div>
    </div>
  );
}
