import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import TypeBar from '../components/TypeBar';
import JobTitleBar from '../components/JobTitleBar';
import FilterAward from '../components/FilterAward';
import EmployeeList from '../components/employees/EmployeeList';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { fetchEmployees, fetchJobTitles, fetchSubdivision } from '../http/employeeApi';
import EmployeesTable from '../components/employees/EmployeesTable';
import Awards from '../components/Awards';
import { AiFillCloseSquare } from "react-icons/ai";
import FilterSubdivisions from '../components/FilterSubdivisions';

const InfoPage = observer(() => {
    const { employee } = useContext(Context);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobTitles = await fetchJobTitles();
                employee.setJobTitles(jobTitles);

                const subdivisions = await fetchSubdivision();
                employee.setSubdivisions(subdivisions);

                const employees = await fetchEmployees();
                employee.setEmployees(employees);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, [employee]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleClearSearch = () => {
        setSearch('');
    };

    const renderContent = () => {
        let filteredEmployees = employee.employees;

        // Фильтрация по награде, если выбрана награда
        // if (employee.selectedAward) {
        //     filteredEmployees = filteredEmployees.filter(emp => {
        //         return emp.awards.some(award => award.id === employee.selectedAward.id);
        //     });
        // }

        switch (employee.selectedType.id) {
            case 1:
                return (
                    <>
                        <JobTitleBar />
                        <div className="d-flex">
                            
                            <div style={{paddingRight: "20px"}}><FilterAward /></div>
                            <div><FilterSubdivisions /></div>
                            
                        </div>

                        <EmployeeList search={search} employees={filteredEmployees} />
                    </>
                );
            case 2:
                return (
                    <>
                        <JobTitleBar />
                        <div className="d-flex">
                            
                            <div style={{paddingRight: "20px"}}><FilterAward /></div>
                            <div><FilterSubdivisions /></div>
                            
                        </div>
                        <EmployeesTable search={search} employees={filteredEmployees} />
                    </>

                );
            case 3:
                return (
                    <Awards
                        search={search}
                        awards={employee.awards}
                        selectedAward={employee.selectedAward}
                        onSelectAward={employee.setSelectedAward}
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container>
            <Row className="mt-4">
                <Col md={3}>
                    <TypeBar />
                </Col>
                <Col md={9}>
                    <div className="d-flex">
                        <Form.Control
                            className="mb-3"
                            placeholder="Искать..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        {search && (
                            <AiFillCloseSquare
                                style={{ fontSize: "40px", color: "red", cursor: "pointer" }}
                                onClick={handleClearSearch}
                            />
                        )}
                    </div>

                    {renderContent()}
                </Col>
            </Row>
        </Container>
    );
});

export default InfoPage;
