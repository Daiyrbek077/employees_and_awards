import React, { useContext, useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Dropdown, Image } from 'react-bootstrap';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { fetchAwards, fetchJobTitles, fetchSubdivision, createEmployee } from '../../http/employeeApi';

const CreateEmployee = observer(({ show, onHide }) => {
    const { employee } = useContext(Context);

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [surname, setSurname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [file, setFile] = useState(null);
    const [awards, setAwards] = useState([]);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobTitles = await fetchJobTitles();
                employee.setJobTitles(jobTitles);
                const awards = await fetchAwards();
                employee.setAwards(awards);
                const subdivisions = await fetchSubdivision();
                employee.setSubdivisions(subdivisions);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, [employee]);

    const addAward = () => {
        setAwards([...awards, { awardId: '', description: '', date: '', id: Date.now() }]);
    };

    const removeAward = (id) => {
        setAwards(awards.filter(i => i.id !== id));
    };

    const changeAward = (key, value, id) => {
        setAwards(awards.map(i => i.id === id ? { ...i, [key]: value } : i));
    };

    const selectFile = e => {
        const file = e.target.files[0];
        setFile(file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl); // Free up the URL after use
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!employee.selectedJT || !employee.selectedSub) {
            alert("Пожалуйста, выберите должность и подразделение");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('lastname', lastname);
        formData.append('surname', surname);
        formData.append('birthdate', birthdate);
        formData.append('jobTitleId', employee.selectedJT.id);
        formData.append('subdivisionId', employee.selectedSub.id);
        formData.append('img', file);
        formData.append('info', JSON.stringify(awards.map(a => ({
            awardId: a.awardId,
            description: a.description,
            date: a.date,
        }))));

        try {
            await createEmployee(formData);
            onHide();
            setName('');
            setLastname('');
            setSurname('');
            setBirthdate('');
            setFile(null);
            setPreview(null);
            setAwards([]);
        } catch (error) {
            console.error("Failed to create employee:", error);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            fullscreen
        >
            <Modal.Header closeButton>
                <Modal.Title>Добавить нового сотрудника</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ minHeight: "300px" }}>
                <Row className="d-flex mb-4">
                    <Col md={4}>
                        <Form>
                            <Form.Control
                                value={lastname}
                                onChange={e => setLastname(e.target.value)}
                                type="text"
                                placeholder="Введите фамилию"
                            />
                            <Form.Control
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="mt-4"
                                type="text"
                                placeholder="Введите имя"
                            />
                            <Form.Control
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                                className="mt-4"
                                type="text"
                                placeholder="Введите отчество"
                            />
                            <Form.Control
                                value={birthdate}
                                onChange={e => setBirthdate(e.target.value)}
                                className="mt-4"
                                type="date"
                                placeholder="Введите дату рождения"
                            />
                        </Form>
                    </Col>
                    <Col md={4}>
                        <Dropdown>
                            <Dropdown.Toggle>{employee.selectedJT?.title || "Выберите должность"}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {employee.jobTitles.map(jt =>
                                    <Dropdown.Item
                                        key={jt.id}
                                        onClick={() => employee.setSelectedJT(jt)}
                                    >
                                        {jt.title}
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="mt-4">
                            <Dropdown.Toggle>{employee.selectedSub?.title || "Выберите подразделение"}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {employee.subdivisions.map(sub =>
                                    <Dropdown.Item
                                        key={sub.id}
                                        onClick={() => employee.setSelectedSub(sub)}
                                    >
                                        {sub.title}
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col className="d-flex flex-column align-items-center" md={4}>
                        <Form.Group controlId="formFileLg" className="mb-3">
                            <Form.Label>Загрузить изображение</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={selectFile}
                            />
                        </Form.Group>
                        {preview && (
                            <Image
                                className="mt-4"
                                width="200px"
                                src={preview}
                            />
                        )}
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Button
                        onClick={addAward}
                        variant="secondary"
                        className="mb-4"
                    >
                        Добавить награду
                    </Button>
                    {awards.map(i => (
                        <React.Fragment key={i.id}>
                            <Row className="mt-2">
                                <Row className="mb-3">
                                    <Dropdown>
                                        <Dropdown.Toggle>{employee.awards.find(a => a.id === i.awardId)?.title || "Выберите награду"}</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {employee.awards.map(award =>
                                                <Dropdown.Item
                                                    onClick={() => changeAward('awardId', award.id, i.id)}
                                                    key={award.id}
                                                >
                                                    {award.title}
                                                </Dropdown.Item>
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Row>
                                <Col md={5}>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Введите описание"
                                        value={i.description}
                                        onChange={(e) => changeAward('description', e.target.value, i.id)}
                                    />
                                </Col>
                                <Col md={3}><Form.Control
                                    value={i.date}
                                    onChange={(e) => changeAward('date', e.target.value, i.id)}
                                    className="mb-2"
                                    type="date"
                                    placeholder="Дата получение награды"
                                />
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => removeAward(i.id)}
                                    >
                                        Удалить
                                    </Button>
                                </Col>
                            </Row>

                            <hr className="mt-2" />
                        </React.Fragment>
                    ))}
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button type="button" variant="outline-success" onClick={handleSubmit}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateEmployee;
