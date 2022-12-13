import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import useAuth from '../../state/auth/useAuth';
import './loginStyles.css';
import logo from '../../assets/img/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<LoginFormData>();
  const { login, logout, user, isLoggedIn } = useAuth();

  const [status, setStatus] = useState<string>('Not logged in');

  useEffect(() => {
    if (user) {
      setStatus(`Logged in as ${user.username}`);
    } else {
      setStatus('Not logged in');
    }
  }, [user]);

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    // Clear form and send log in request
    console.log('logging in...');
    reset();

    login(data.username, data.password)
      .then((user) => {
        console.log('Logged in: ', user);
        navigate('/yourprojects');
      })
      .catch((err) => alert('Failed to log in: ' + err));
  };

  function handleCreateAccount() {
    let path = '/signup';
  }

  return (
    <div>
      <nav className="login-navBarContainer">
        <h1 className="login-navBarTitle">Log In</h1>
        {/* <p>Status: {status}</p>
        {isLoggedIn() && <Button onClick={() => logout()}>Logout</Button> } */}
      </nav>
      <section className="login-heroSection">
        <div className="login-leftHero">
          <img className="login-leftHeroImage" src={logo} alt="" />
          <p className="login-leftHeroText">
            A software curated for agile development!
          </p>
          <ul className="login-leftHeroFeaturesList">
            <li>
              <span className="login-checkMark">✓</span> Create a project
              specific board.
            </li>
            <li>
              <span className="login-checkMark">✓</span> Create &amp; store
              tasks on a project board.
            </li>
            <li>
              <span className="login-checkMark">✓</span> Join an exisiting
              project board through a code.
            </li>
            <li>
              <span className="login-checkMark">✓</span> Self assign a task
              &amp; comment on tasks.
            </li>
            <li>
              <span className="login-checkMark">✓</span> And so much more!
            </li>
          </ul>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="login-rightHero"
          action=""
        >
          <label className="login-label" htmlFor="email">
            Username:
          </label>
          <input
            {...register('username', { required: true })}
            className="login-textbox"
            type="text"
            required
          />
          <br />
          <br />
          <label className="login-label" htmlFor="password">
            Password:
          </label>
          <input
            {...register('password', { required: true })}
            className="login-textbox"
            type="password"
            required
          />
          <br />
          <br />
          <div className="login-loginButtonContainer">
            <input type="submit" value="Log In" className="login-loginButton" />
          </div>
          <div className="login-createAccountContainer">
            <hr></hr>
            <p className="login-createAccountText">
              Don't have an account yet?
            </p>
            <Link to={'/signup'}>
              <button className="login-createAccountButton">
                Create an account
              </button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
