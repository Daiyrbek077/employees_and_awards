import React, { useContext } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { Card } from 'react-bootstrap';

const JobTitleBar = observer(() => {
  const { employee } = useContext(Context);

  return (
    <div className="d-flex flex-wrap mb-4">
      <Card
          onClick={() => employee.setSelectedJT(0)}
          className="p-2 mb-2 me-3"
          style={!employee.selectedJT ? { background: "#0080FF", color: "white", cursor: 'pointer' } : {cursor: 'pointer'}}
        >
          Все
        </Card>
      {employee.jobTitles.map(jt => (
        <Card
          key={jt.id}
          onClick={() => employee.setSelectedJT(jt)}
          className="p-2 mb-2"
          style={jt.id === (employee.selectedJT && employee.selectedJT.id) ? { background: "#0080FF", color: "white", cursor: 'pointer' } : {cursor: 'pointer'}}
        >
          {jt.title}
        </Card>
      ))}
    </div>
  );
});

export default JobTitleBar;
