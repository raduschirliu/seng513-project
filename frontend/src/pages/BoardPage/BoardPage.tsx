import { useParams } from 'react-router-dom';

export default function BoardPage() {
  const params = useParams();

  return (
    <div>
      <p>ID from URL is: {params.boardId}</p>
    </div>
  );
}
