import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import Accordion from 'react-bootstrap/Accordion';
import { fetchJobTitles, fetchSubdivision, updateJobTitle, deleteJobTitle, updateSubdivision, deleteSubdivision } from '../../http/employeeApi';
import { Context } from '../../index';

const EditModal = observer(({ show, onHide }) => {
    const { employee } = useContext(Context);
    const [jobTitles, setJobTitles] = useState([]);
    const [subdivisions, setSubdivisions] = useState([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState(null);
    const [selectedSubdivision, setSelectedSubdivision] = useState(null);
    const [jobTitleForm, setJobTitleForm] = useState({ title: '', description: '' });
    const [subdivisionForm, setSubdivisionForm] = useState({ title: '' });
    const [showEditJobTitleModal, setShowEditJobTitleModal] = useState(false);
    const [showEditSubdivisionModal, setShowEditSubdivisionModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobTitlesData = await fetchJobTitles();
                employee.setJobTitles(jobTitlesData);

                const subdivisionsData = await fetchSubdivision();
                employee.setSubdivisions(subdivisionsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, [employee]);

    const handleEditJobTitle = (jobTitle) => {
        setSelectedJobTitle(jobTitle);
        setJobTitleForm({ title: jobTitle.title, description: jobTitle.description });
        setShowEditJobTitleModal(true);
    };

    const handleUpdateJobTitle = async () => {
        try {
            await updateJobTitle(selectedJobTitle.id, jobTitleForm);
            const updatedJobTitles = await fetchJobTitles();
            employee.setJobTitles(updatedJobTitles);
            setSelectedJobTitle(null);
            setShowEditJobTitleModal(false);
        } catch (error) {
            console.error("Failed to update job title:", error);
        }
    };

    const handleDeleteJobTitle = async (id) => {
        try {
            await deleteJobTitle(id);
            const updatedJobTitles = await fetchJobTitles();
            employee.setJobTitles(updatedJobTitles);
        } catch (error) {
            console.error("Failed to delete job title:", error);
        }
    };

    const handleEditSubdivision = (subdivision) => {
        setSelectedSubdivision(subdivision);
        setSubdivisionForm({ title: subdivision.title });
        setShowEditSubdivisionModal(true);
    };

    const handleUpdateSubdivision = async () => {
        try {
            await updateSubdivision(selectedSubdivision.id, subdivisionForm);
            const updatedSubdivisions = await fetchSubdivision();
            employee.setSubdivisions(updatedSubdivisions);
            setSelectedSubdivision(null);
            setShowEditSubdivisionModal(false);
        } catch (error) {
            console.error("Failed to update subdivision:", error);
        }
    };

    const handleDeleteSubdivision = async (id) => {
        try {
            await deleteSubdivision(id);
            const updatedSubdivisions = await fetchSubdivision();
            employee.setSubdivisions(updatedSubdivisions);
        } catch (error) {
            console.error("Failed to delete subdivision:", error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} fullscreen>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить должности и подразделения</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Должности</Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Название</th>
                                            <th>Описание</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employee.jobTitles.map((jt) => (
                                            <tr key={jt.id}>
                                                <td>{jt.title}</td>
                                                <td>{jt.description}</td>
                                                <td>
                                                    <Button variant="warning" onClick={() => handleEditJobTitle(jt)}>Изменить</Button>{' '}
                                                    <Button variant="danger" onClick={() => handleDeleteJobTitle(jt.id)}>Удалить</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Подразделения</Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Название</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employee.subdivisions.map((sub) => (
                                            <tr key={sub.id}>
                                                <td>{sub.title}</td>
                                                <td>
                                                    <Button variant="warning" onClick={() => handleEditSubdivision(sub)}>Изменить</Button>{' '}
                                                    <Button variant="danger" onClick={() => handleDeleteSubdivision(sub.id)}>Удалить</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>ОК</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditJobTitleModal} onHide={() => setShowEditJobTitleModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать должность</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                value={jobTitleForm.title}
                                onChange={(e) => setJobTitleForm({ ...jobTitleForm, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                type="text"
                                value={jobTitleForm.description}
                                onChange={(e) => setJobTitleForm({ ...jobTitleForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpdateJobTitle}>
                            Сохранить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditSubdivisionModal} onHide={() => setShowEditSubdivisionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать подразделение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                value={subdivisionForm.title}
                                onChange={(e) => setSubdivisionForm({ ...subdivisionForm, title: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpdateSubdivision}>
                            Сохранить
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
});

export default EditModal;
