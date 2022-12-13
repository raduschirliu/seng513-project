import UserTile from './UserTile';
import { IUser } from '../../models';

export type Props = {
  title: string;
  users: IUser[];
  currentUser: IUser;
};

export default function UserList({ title, users, currentUser }: Props) {
  return (
    <div>
      <h1 className='p-2 m-2'>{title}</h1>
      <div>
        {users.map((user) => (
          <UserTile
            key={user._id}
            user={user}
            hideStartChat={user._id === currentUser._id}
          />
        ))}
      </div>
    </div>
  );
}
