import Page from '../../components/Page/Page';
import UserList from '../../components/UserList/UserList';

export default function BoardUserList() {
  return (
    <Page>
      <div
        style={{
          width: '19%',
          minWidth: '265px',
          paddingLeft: '0.5vw',
          paddingTop: '12px',
        }}
      >
        <UserList />
      </div>
    </Page>
  );
}
