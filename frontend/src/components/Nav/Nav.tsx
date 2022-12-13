import { Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <Stack>
      <Link to="/">Home</Link>
      <Link to="/chat">Chat</Link>
    </Stack>
  );
}
