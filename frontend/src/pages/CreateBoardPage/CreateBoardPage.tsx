import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, SubmitHandler } from 'react-hook-form';
import { faPlus, faTableColumns, faList, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { BoardsApi } from '../../api/boards';
import useApi from '../../state/useApi';
import { useState } from 'react';
import uuid from "react-uuid";


type CreateBoardFormData = {
    boardname: string;
    adminId: string;
  };

export default function CreateBoardPage() {

    const { register, handleSubmit, reset } = useForm<CreateBoardFormData>();
    const boardsApi = useApi(BoardsApi);

  const onSubmit: SubmitHandler<CreateBoardFormData> = (data) => {
    // Clear form and send log in request
    console.log('Creating board');
    reset();

    boardsApi.createBoard(data.boardname, data.adminId);
  };

  return (
    <div className='d-flex bg-light page'>
      {/* <p>ID from URL is: {params.boardId}</p> */}
      <div className='d-flex flex-column justify-content-between m-2 nav-bar bg-white'>
        <Logo />

        <div className='d-flex flex-column mx-2 my-5'>
          <h6><b>Your project</b></h6>
          <ul>
            <li className='nav-element'><FontAwesomeIcon icon={faTableColumns} /> Dashboard</li>
            <li className='nav-element'><FontAwesomeIcon icon={faList} /> Backlog</li>
          </ul>
        </div>

        <div className='d-flex flex-column mx-2 my-5'>
          <h6><b>Account</b></h6>
          <ul>
            <li className='nav-element'><FontAwesomeIcon icon={faUserGroup} /> Projects</li>
            <li className='nav-element'><FontAwesomeIcon icon={faGear} /> Settings</li>
          </ul>
        </div>

        <div className='d-flex flex-row mx-2 avatar-container'>
          <div className="avatar">U</div>
          <p>User</p>
        </div>
      </div>

      <div className='d-flex m-2 flex-column bg-white board'>
        <div style={{paddingLeft: "40px", paddingTop: "20px"}}>
          <h1>
            Create a Board
          </h1>

            <div style={{paddingLeft: "20px"}}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group style={{paddingTop: "40px", paddingBottom: "12px"}}>
                        <Form.Label>Board Name:</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('boardname', { required: true })}
                                style={{maxWidth: "400px"}}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                         Create Board
                    </Button>
                </Form>
            </div>
        </div>
      </div>
      </div>
  );
}
