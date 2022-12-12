import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import useAuth from '../../state/auth/useAuth';

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
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
      })
      .catch((err) => alert('Failed to log in: ' + err));
  };

  return (
    <Container>
      <Row className="pb-5">
        <Col>Status: {status}</Col>
      </Row>
      {isLoggedIn() && (
        <Row className="pb-5">
          <Col>
            <Button onClick={() => logout()}>Logout</Button>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                {...register('username', { required: true })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                id="password"
                {...register('password', { required: true })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
