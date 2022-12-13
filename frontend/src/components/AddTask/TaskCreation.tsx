import { Key, useState } from 'react';
import uuid from "react-uuid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function TaskCreation(props: any) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
    <Modal 
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    portalClassName="taskcreation">
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
                <h2 className="title">Create New Task</h2>
            </Modal.Title>
            <button className='xbutton' onClick={props.onHide}><FontAwesomeIcon className="x-icon" icon={faXmark} /></button>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
                <Form.Label> Task Name: </Form.Label>
                <Form.Control type="text" placeholder="task name..." required/>
                <Form.Label> Task Description: </Form.Label>
                <Form.Control type="text" placeholder="task description..." required/>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button as="input" type="submit" value="Submit"/>{' '}
        </Modal.Footer>
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

        <TaskCreation 
        show={modalShow}
        onHide={() => setModalShow(false)}
        />
    </>
    );
}