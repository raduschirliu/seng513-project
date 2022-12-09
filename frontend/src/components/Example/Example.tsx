import { useState } from 'react';
import { TestApi } from '../../api/test';
import { Alert, Button, FormControl } from 'react-bootstrap';
import useApi from '../../state/useApi';

export default function Example() {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const testApi = useApi(TestApi);

  function sendMessage() {
    testApi.ping(message).then((data) => {
      setResponse(JSON.stringify(data, null, 2));
    });
  }

  return (
    <div>
      <FormControl
        type="text"
        placeholder="Type message..."
        onChange={(event) => {
          setMessage('' + event.target.value);
        }}
      ></FormControl>

      <Button variant="primary" onClick={sendMessage}>
        Send message
      </Button>

      {response.length > 0 && (
        <Alert variant="primary">
          Response from server:
          <br />
          {response}
        </Alert>
      )}
    </div>
  );
}
