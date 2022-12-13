import { Key, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, Form, ModalTitle, ModalProps } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import './taskcreationstyle.css';
import { ITask } from '../../models';
import { BoardsApi } from '../../api/boards';
import useApi from '../../state/useApi';

type TaskFormData = {
  taskName: string;
  taskDescription: string;
};

export type AddTaskModalProps = ModalProps & {
  boardId: string;
  show: boolean;
  onTaskAdded: (newTask: ITask) => void;
  onClose: () => void;
};

export default function AddTaskModal({
  boardId,
  show,
  onTaskAdded,
  onClose,
  ...rest
}: AddTaskModalProps) {
  const { register, handleSubmit, reset } = useForm<TaskFormData>();
  const boardApi = useApi(BoardsApi);

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    console.log('adding new task to board...', boardId, data);
    boardApi
      .createTask(boardId, {
        name: data.taskName,
        description: data.taskDescription,
      })
      .then((res) => {
        if (!res.success) {
          console.error('Failed to create task', res.error);
          return;
        }

        console.log('new task created');
        reset();
        onTaskAdded(res.data);
        console.log(res.data);
      });
  };

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
    >
      <div>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <h2 className="taskname">Create New Task</h2>
          </Modal.Title>
          <button className="xbutton" onClick={onClose}>
            <FontAwesomeIcon className="x-icon" icon={faXmark} />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="group">
              <Form.Label className="label"> Task Name: </Form.Label>
              <Form.Control
                className="control"
                type="text"
                {...register('taskName', { required: true })}
                placeholder="Task name..."
              />
            </Form.Group>
            <Form.Group className="group">
              <Form.Label className="label"> Task Description: </Form.Label>
              <Form.Control
                className="control"
                type="text"
                {...register('taskDescription', { required: true })}
                placeholder="Task description..."
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
}