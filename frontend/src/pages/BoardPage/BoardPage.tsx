import { useParams } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTableColumns, faList, faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { Draggable, Droppable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useState } from 'react';
import uuid from "react-uuid";

const exampleItems = [
  { id: uuid(), content: "Secure a domain name" },
  { id: uuid(), content: "Hold investor meeting" }
];

const cols = {
  [uuid()]: {
    name: "To Do",
    items: exampleItems
  },
  [uuid()]: {
    name: "In Progress",
    items: []
  },
  [uuid()]: {
    name: "Done",
    items: []
  }
}

export default function BoardPage() {
  const params = useParams();
  const [columns, setColumns] = useState(cols);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const addTask = () => {
    // TODO: complete

    // Opens a new task window to edit task details
    // Add task to database
  }

  const getTasks = () => {
    // TODO: complete
    
    // Retrieves tasks from the database/server
  }

  return (
    <div className='d-flex bg-light page'>
      {/* <p>ID from URL is: {params.boardId}</p> */}
      <div className='d-flex flex-column justify-content-between m-2 nav-bar bg-white'>
        <Logo />

        <div className='d-flex flex-column mx-2 my-5'>
          <h6><b>Your project</b></h6>
          <ul>
            <li className='nav-element cur-element'><FontAwesomeIcon icon={faTableColumns} /> Dashboard</li>
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
        <div className='d-flex board-page-header p-2 mx-4 my-2'>
          <h1>
            Project Title
          </h1>

          <button type="button" className="plus-button"><FontAwesomeIcon className="plus-icon" icon={faPlus} /></button>
        </div>

        <div className='d-flex w-100 mw-100 task-column-container'>
          <DragDropContext onDragEnd={result => onDragEnd(result)}>
            {
              Object.entries(columns).map(([columnId, column], index) => {
                return (
                  <div className='bg-light task-column' key={columnId}>
                    <h3>{column.name}</h3>
                    <div style={{minHeight: "93%", height: "93%"}}>
                      <Droppable droppableId={columnId} key={columnId}>
                        {(provided, snapshot) => {
                          return (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ background: snapshot.isDraggingOver ? "lightblue" : "#f8f9fa", minHeight: "100%", maxHeight: "100%" }} >
                              {
                                column.items.map((item, index) => {
                                  return (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                      {(provided, snapshot) => {
                                        return (
                                          <div ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}
                                            style={{
                                              userSelect: "none",
                                              padding: 16,
                                              margin: "0 0 8px 0",
                                              minHeight: "50px",
                                              backgroundColor: snapshot.isDragging
                                                ? "#d4d2d2"
                                                : "white",
                                              color: "black",
                                              borderRadius: "0.5em",
                                              border: "1px solid black",
                                              ...provided.draggableProps.style
                                            }}>
                                            {item.content}
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })
                              }
                              {provided.placeholder}
                            </div>
                          )
                        }}
                      </Droppable>
                    </div>
                  </div>
                );
              })
            }
          </DragDropContext>
        </div >
      </div >
    </div >
  );
}
