import { Key, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, Form, ModalTitle } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import './taskcreationstyle.css';

type TaskFormData = {
  taskName: string;
  taskDescription: string;
};

function TaskCreation(props: any) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const { register, handleSubmit, reset } = useForm<TaskFormData>();

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    console.log('new task created');
    reset();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      portalClassName="taskcreation"
    >
      <div>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <h2 className="taskname">Create New Task</h2>
          </Modal.Title>
          <button className="xbutton" onClick={props.onHide}>
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
                placeholder="task name..."
              />
            </Form.Group>
            <Form.Group className="group">
              <Form.Label className="label"> Task Description: </Form.Label>
              <Form.Control
                className="control"
                type="text"
                {...register('taskDescription', { required: true })}
                placeholder="task description..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default function AddTask() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Create New Task
      </Button>

      <TaskCreation show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
