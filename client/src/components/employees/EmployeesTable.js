import React, { useContext, useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { FaChevronDown } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { fetchAwards, fetchEmployees, fetchJobTitles, fetchOneEmployee, fetchSubdivision } from '../../http/employeeApi';
import Accordion from 'react-bootstrap/Accordion';

const EmployeesTable = observer(({ search }) => {
    const { employee } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [employeeOne, setEmployeeOne] = useState({ info: [] });
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAwards().then(data => employee.setAwards(data));
                await fetchSubdivision().then(data => employee.setSubdivisions(data));
                await fetchJobTitles().then(data => employee.setJobTitles(data));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchEmployeesData = async () => {
            try {
                const jobTitleId = employee.selectedJT ? employee.selectedJT.id : null;
                const awardId = employee.selectedAward ? employee.selectedAward.id : null;
                const subdivisionId = employee.selectedSub ? employee.selectedSub.id : null;
                const employees = await fetchEmployees(jobTitleId, awardId, subdivisionId); // Используем функцию fetchEmployees для получения сотрудников
                employee.setEmployees(employees);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchEmployeesData();
    }, [employee.selectedJT, employee.selectedAward, employee.selectedSub]);

    useEffect(() => {
        if (activeRow !== null) {
            fetchOneEmployee(activeRow).then(data => setEmployeeOne(data));
        }
    }, [activeRow]);

    if (employee.employees.length === 0) {
        return <h1>Ничего не найдено</h1>;
    }

    return (
        <>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Фамилия</th>
                            <th>Имя</th>
                            <th>Отчество</th>
                            <th>Дата рождения</th>
                            <th>Должность</th>
                            <th>Подразделение</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {employee.employees
                            .filter((empl) => {
                                const searchLower = search.toLowerCase();
                                return searchLower === ''
                                    ? true
                                    : empl.name.toLowerCase().includes(searchLower) ||
                                    empl.lastname.toLowerCase().includes(searchLower) ||
                                    empl.surname.toLowerCase().includes(searchLower) ||
                                    `${empl.lastname} ${empl.name} ${empl.surname}`.toLowerCase().includes(searchLower) ||
                                    `${empl.name} ${empl.lastname} ${empl.surname}`.toLowerCase().includes(searchLower) ||
                                    `${empl.name} ${empl.surname} ${empl.lastname}`.toLowerCase().includes(searchLower) ||
                                    `${empl.lastname} ${empl.surname} ${empl.name}`.toLowerCase().includes(searchLower) ||
                                    `${empl.surname} ${empl.lastname} ${empl.name}`.toLowerCase().includes(searchLower) ||
                                    `${empl.surname} ${empl.name} ${empl.lastname}`.toLowerCase().includes(searchLower)
                            })
                            .map((employeeData, index) => {
                                const jt = employee.jobTitles.find(jtt => jtt.id === employeeData.jobTitleId);
                                const sub = employee.subdivisions.find(sub => sub.id === employeeData.subdivisionId);
                                const isActiveRow = activeRow === employeeData.id;

                                return (
                                    <React.Fragment key={employeeData.id}>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{employeeData.lastname}</td>
                                            <td>{employeeData.name}</td>
                                            <td>{employeeData.surname}</td>
                                            <td>{employeeData.birthdate}</td>
                                            <td>{jt ? jt.title : 'N/A'}</td>
                                            <td>{sub ? sub.title : 'N/A'}</td>
                                            <td>
                                                <div style={{ fontSize: "15px", cursor: "pointer" }}>
                                                    <FaChevronDown className={isActiveRow ? "d-none" : ""} onClick={() => setActiveRow(employeeData.id)} />
                                                    <GrClose className={isActiveRow ? "" : "d-none"} onClick={() => setActiveRow(null)} />
                                                </div>
                                            </td>
                                        </tr>
                                        {isActiveRow && (
                                            <tr>
                                                <td colSpan="8" style={{ background: "#D3D3D3" }}>
                                                    <div>
                                                        <h4>Награды</h4>
                                                        <hr />

                                                        <Accordion defaultActiveKey="0">
                                                            {employeeOne.info.length > 0 ? (
                                                                employeeOne.info.map((award) => {
                                                                    const awardTitle = employee.awards.find(a => a.id === award.awardId)?.title || 'N/A';
                                                                    return (
                                                                        <Accordion.Item key={award.id} eventKey={award.id}>
                                                                            <Accordion.Header>
                                                                                <div>{awardTitle}</div>
                                                                                <p 
                                                                                    style={{fontSize: "14px", color: "gray", fontWeight: "600"}}
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
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                    </tbody>
                </Table>
            )}
        </>
    );
});

export default EmployeesTable;
