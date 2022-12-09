import { IChatMessage } from '../../models';

export interface IParams {
  message: IChatMessage;
}

export default function ChatMessage({ message }: IParams) {
  return (
    <div>
      <h1>{message.author}</h1>
      <p>{message.message}</p>
    </div>
  );
}
