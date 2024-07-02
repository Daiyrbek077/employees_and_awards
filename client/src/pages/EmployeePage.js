import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchOneEmployee, fetchAwards, fetchSubdivision, fetchJobTitles } from '../http/employeeApi';
import { Context } from '..';
import Accordion from 'react-bootstrap/Accordion';

const EmployeePage = observer(() => {
  const { employee } = useContext(Context);
  const [employeeOne, setEmployeeOne] = useState({ info: [] });
  const { id } = useParams();

  useEffect(() => {
    fetchOneEmployee(id).then(data => setEmployeeOne(data));
    fetchAwards().then(data => employee.setAwards(data));
    fetchSubdivision().then(data => employee.setSubdivisions(data));
    fetchJobTitles().then(data => employee.setJobTitles(data));
  }, [id, employee]);

  const jtitle = employee.jobTitles.find(jtt => jtt.id === employeeOne.jobTitleId);
  const sub = employee.subdivisions.find(sub => sub.id === employeeOne.subdivisionId);

  return (
    <Container className="mt-4">
      <Row className="d-flex">
        <Col md={3}>
          <div
            style={{
              background: `url(${process.env.REACT_APP_API_URL + employeeOne.img}) no-repeat center/cover`,
              width: 250,
              height: 300
            }}
          ></div>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item className="p-4 fs-5">Фамилия: {employeeOne.lastname}</ListGroup.Item>
            <ListGroup.Item className="p-4 fs-5">Имя: {employeeOne.name}</ListGroup.Item>
            <ListGroup.Item className="p-4 fs-5">Отчество: {employeeOne.surname}</ListGroup.Item>
            <ListGroup.Item className="p-4 fs-5">Дата рождения: {employeeOne.birthdate}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={5}>
          <ListGroup variant="flush">
            <ListGroup.Item className="p-4 fs-5">Должность: {jtitle ? jtitle.title : 'Не указано или уже удалено'}</ListGroup.Item>
            <ListGroup.Item className="p-4 fs-5">Подразделение: {sub ? sub.title : 'Не указано или уже удалено'}</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <h1 className="mt-4">Награды:</h1>
        <hr />
        {/* {employeeOne.info.length > 0 ? (
          employeeOne.info.map((award, index) => {
            const awardDetails = employee.awards.find(a => a.id === award.awardId);
            return (
              <Row
                key={award.id}
                style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}
              >
                <span style={{ fontWeight: "700", fontSize: "16px" }}>{awardDetails ? awardDetails.title : 'Не указано'}</span>
                <span>{award.description}</span>
              </Row>
            );
          })
        ) : (
          <h2 className="mt-3 text-center" style={{ color: 'grey' }}>Нет наград</h2>
        )} */}

        <Accordion defaultActiveKey="0">
          {employeeOne.info.length > 0 ? (
            employeeOne.info.map((award) => {
              const awardTitle = employee.awards.find(a => a.id === award.awardId)?.title || 'Такое награждение не существует или уже удалено.';
              return (
                <Accordion.Item key={award.id} eventKey={award.id}>
                  <Accordion.Header>
                    <div>{awardTitle}</div>
                    <p
                      style={{ fontSize: "14px", color: "gray", fontWeight: "600" }}
                    >
                      {award.date}

                    </p>
                  </Accordion.Header>
                  <Accordion.Body>

                    {award.description}
                  </Accordion.Body>
                </Accordion.Item>
              );
            })
          ) : (
            <h2 className="mt-3 text-center" style={{ color: 'lightgray' }}>Нет наград</h2>
          )}
        </Accordion>
      </Row>
    </Container>
  );
});

export default EmployeePage;
