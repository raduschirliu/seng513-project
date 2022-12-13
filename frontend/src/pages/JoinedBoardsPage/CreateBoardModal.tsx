import React, { useState } from 'react';
import { BoardsApi } from '../../api/boards';
import useApi from '../../state/useApi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Form, Button, Modal } from 'react-bootstrap';
import { IBoard } from '../../models';

type CreateBoardFormData = {
  boardname: string;
  adminId: string;
};

export type Props = {
  onBoardCreated: (board: IBoard) => void;
};

export default function CreateBoardModal({ onBoardCreated }: Props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { register, handleSubmit, reset } = useForm<CreateBoardFormData>();
  const boardsApi = useApi(BoardsApi);

  const onSubmit: SubmitHandler<CreateBoardFormData> = (data) => {
    // Clear form and send log in request
    console.log('Creating board...');
    reset();

    boardsApi.createBoard(data.boardname).then((res) => {
      if (!res.success) {
        console.error('Failed to create board', res.error);
        return;
      }

      onBoardCreated(res.data);
      setShow(false);
    });
  };

  return (
    <>
      <button type="button" onClick={handleShow} className="plus-button">
        <FontAwesomeIcon className="plus-icon" icon={faPlus} />
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{}}>
            <div style={{}}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group style={{ paddingBottom: '12px' }}>
                  <Form.Label>Board Name:</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('boardname', { required: true })}
                    style={{ maxWidth: '400px' }}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ backgroundColor: '#889bfc', border: 'none' }}
                >
                  Create Board
                </Button>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
