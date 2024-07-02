import React, { useContext } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TypeBar = observer(() => {
  const { employee } = useContext(Context);

  return (
    <ListGroup style={{userSelect: "none"}}>
      {employee.types.map(type => (
        <ListGroup.Item
          active={employee.selectedType && type.id === employee.selectedType.id}
          onClick={() => {
            employee.setSelectedType(type);
          }}
          key={type.id}
          style={{ cursor: "pointer" }}
        >
          {type.title}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default TypeBar;
