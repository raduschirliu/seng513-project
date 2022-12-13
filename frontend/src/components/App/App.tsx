import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <Link to="/example">Example</Link>
        <Link to="/board/123">Board</Link>
        <Link to="/createboard">CreateBoard</Link>
      </header>
    </div>
  );
}
