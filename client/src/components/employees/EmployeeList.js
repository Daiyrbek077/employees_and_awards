// EmployeeList.js

import React, { useContext, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import EmployeeItem from './EmployeeItem';
import { fetchEmployees } from '../../http/employeeApi'; // Импортируем функцию fetchEmployees из API

const EmployeeList = observer(({ search }) => {
    const { employee } = useContext(Context);

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

    if (!employee.employees || employee.employees.length === 0) {
        return <h1>Ничего не найдено</h1>;
    }

    const filteredEmployees = employee.employees && employee.employees.length > 0
        ? employee.employees.filter((empl) => {
            if (search && search.trim().toLowerCase() !== '') {
                const searchString = search.trim().toLowerCase();
                return (
                    empl.name.toLowerCase().includes(searchString) ||
                    empl.lastname.toLowerCase().includes(searchString) ||
                    empl.surname.toLowerCase().includes(searchString) ||
                    `${empl.lastname} ${empl.name} ${empl.surname}`.toLowerCase().includes(searchString) ||
                    `${empl.name} ${empl.lastname} ${empl.surname}`.toLowerCase().includes(searchString) ||
                    `${empl.name} ${empl.surname} ${empl.lastname}`.toLowerCase().includes(searchString) ||
                    `${empl.lastname} ${empl.surname} ${empl.name}`.toLowerCase().includes(searchString) ||
                    `${empl.surname} ${empl.lastname} ${empl.name}`.toLowerCase().includes(searchString) ||
                    `${empl.surname} ${empl.name} ${empl.lastname}`.toLowerCase().includes(searchString)
                );
            }
            return true;
        })
        : [];

    if (filteredEmployees.length === 0) {
        return <h1>Ничего не найдено</h1>;
    }

    return (
        <Row className="d-flex">
            {filteredEmployees.map((empl) => {
                const jt = employee.jobTitles.find(jtt => jtt.id === empl.jobTitleId);
                return (
                    <EmployeeItem key={empl.id} jt={jt} employee={empl} />
                );
            })}
        </Row>
    );
});

export default EmployeeList;
