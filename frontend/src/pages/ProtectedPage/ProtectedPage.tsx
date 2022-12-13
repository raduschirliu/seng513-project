import { useNavigate } from 'react-router';
import { useTimeout } from 'usehooks-ts';
import useAuth from '../../state/auth/useAuth';

export interface IProps {
  children?: React.ReactNode;
}

// Wait ~1.5 seconds to check auth before redirecting
const REDIRECT_DELAY = 1500;

export default function ProtectedPage({ children }: IProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useTimeout(
    () => {
      if (!isLoggedIn()) {
        navigate('/');
      }
    },
    isLoggedIn() ? null : REDIRECT_DELAY
  );

  return isLoggedIn() ? <>{children}</> : <div>Loading...</div>;
}
