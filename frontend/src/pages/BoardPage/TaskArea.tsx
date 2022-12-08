import { Draggable, Droppable, DragDropContext} from 'react-beautiful-dnd';
import { ITask } from '../../../models';
import { Column } from './BoardPage';

export default function taskArea (columns: Column, onDragEnd: any) {
    return (
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
                                            {item.description}
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