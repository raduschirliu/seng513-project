import { Draggable, Droppable, DragDropContext} from 'react-beautiful-dnd';
import { ITask, IUser } from '../../models';
import { Column, ColumnInfo } from './BoardPage';
import TaskDetails from '../../components/TaskDetails/TaskDetails';
import { TestApi } from '../../api/test';

export default function taskArea (props: {columns: Column, onDragEnd: any, boardusers: IUser[], me_user: IUser, endp: TestApi}) {
    return (
        <DragDropContext onDragEnd={result => props.onDragEnd(result)}>
            {
              Object.entries(props.columns).map(([columnId, column], index) => {
                return (
                  <div className='bg-light task-column' key={columnId}>
                    <h3>{column.name}</h3>
                    <div style={{minHeight: "90%", height: "90%"}}>
                      <Droppable droppableId={columnId} key={columnId}>
                        {(provided, snapshot) => {
                          return (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ background: snapshot.isDraggingOver ? "lightblue" : "#f8f9fa", minHeight: "100%", maxHeight: "100%", overflow: 'auto' }} >
                              {
                                column.items.map((item, index) => {
                                  return (
                                    <Draggable key={item._id} draggableId={item._id} index={index}>
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
                                            {/*{item.name}*/}
                                            {/*<TaskDetails thetask={item} users={props.boardusers} me={props.me_user} api={props.endp} />*/}
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
    )
}