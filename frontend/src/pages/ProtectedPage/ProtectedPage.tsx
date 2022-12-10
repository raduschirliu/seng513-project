import { useNavigate } from 'react-router';
import useAuth from '../../state/auth/useAuth';

export interface IProps {
  children?: React.ReactNode;
}

export default function ProtectedPage({ children }: IProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    console.log('not logged in!!');
    setTimeout(() => {
      if (!isLoggedIn()) {
        navigate('/');
      }
    }, 1000);

    <p>You need to be logged in to see this, redirecting...</p>;
  }

  return <>{children}</>;
}
