import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Page from '../../components/Page/Page';
import useAuth from '../../state/auth/useAuth';

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onClickLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Page>
      <Button onClick={onClickLogout}>Logout</Button>
    </Page>
  );
}
