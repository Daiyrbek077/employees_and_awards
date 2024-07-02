import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import CreateEmployee from '../components/modals/CreateEmployee';
import CreateAward from '../components/modals/CreateAward';
import CreateJobTitle from '../components/modals/CreateJobTitle';
import CreateSub from '../components/modals/CreateSub';
import EditModal from '../components/modals/EditModal';
import { observer } from 'mobx-react-lite';

const Admin = observer(() => {
  const [employeeVisible, setEmployeeVisible] = useState(false);
  const [awardVisible, setAwardVisible] = useState(false);
  const [jobTitleVisible, setJobTitleVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  return (
    <Container className="d-flex flex-column">
      <Button
        onClick={() => setEmployeeVisible(true)}
        variant="outline-dark"
        className="mt-3"
      >
        Добавить сотрудника
      </Button>
      <Button
        onClick={() => setAwardVisible(true)}
        variant="outline-dark"
        className="mt-4 p-2"
      >
        Добавить награду
      </Button>
      <Button
        onClick={() => setJobTitleVisible(true)}
        variant="outline-dark"
        className="mt-4 p-2"
      >
        Добавить должность
      </Button>
      <Button
        onClick={() => setSubVisible(true)}
        variant="outline-dark"
        className="mt-4 p-2"
      >
        Добавить подразделение
      </Button>
      <Button
        onClick={() => setEditVisible(true)}
        variant="outline-dark"
        className="mt-4 p-2"
        style={{ width: "100%" }}
      >
        Изменить должности и подразделения
      </Button>

      <CreateEmployee show={employeeVisible} onHide={() => setEmployeeVisible(false)} />
      <CreateAward show={awardVisible} onHide={() => setAwardVisible(false)} />
      <CreateJobTitle show={jobTitleVisible} onHide={() => setJobTitleVisible(false)} />
      <CreateSub show={subVisible} onHide={() => setSubVisible(false)} />
      <EditModal show={editVisible} onHide={() => setEditVisible(false)} />
    </Container>
  );
});

export default Admin;
