import React, { useContext, useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Dropdown, Image } from 'react-bootstrap';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { updateEmployee, fetchJobTitles, fetchAwards, fetchSubdivision, fetchOneEmployee } from '../../http/employeeApi';

const EditEmployee = observer(({ show, onHide, employee }) => {
    const { employee: employeeStore } = useContext(Context);

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [surname, setSurname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [selectedJobTitle, setSelectedJobTitle] = useState(null);
    const [selectedSubdivision, setSelectedSubdivision] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [employeeOne, setEmployeeOne] = useState([]);
    const [id, setId] = useState(null);
    const [initialState, setInitialState] = useState({});
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (employee) {
            const { id, name, lastname, surname, birthdate, jobTitleId, subdivisionId, img } = employee;
            setId(id || null);
            setName(name || '');
            setLastname(lastname || '');
            setSurname(surname || '');
            setBirthdate(birthdate || '');
            setSelectedJobTitle(jobTitleId || null);
            setSelectedSubdivision(subdivisionId || null);
            setPreview(img ? process.env.REACT_APP_API_URL + img : null);
            setInitialState({ name, lastname, surname, birthdate, jobTitleId, subdivisionId, img, employeeOne: [] });
        }
    }, [employee]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobTitles = await fetchJobTitles();
                employeeStore.setJobTitles(jobTitles);

                if (id) {
                    const employeeData = await fetchOneEmployee(id);
                    setEmployeeOne(employeeData.info || []);
                    setInitialState(prev => ({ ...prev, employeeOne: employeeData.info || [] }));
                }

                const awardData = await fetchAwards();
                employeeStore.setAwards(awardData);

                const subdivisions = await fetchSubdivision();
                employeeStore.setSubdivisions(subdivisions);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [employeeStore, id]);

    const addAward = () => {
        setEmployeeOne([...employeeOne, { awardId: '', description: '', date: '', id: Date.now() }]);
        setIsChanged(true);
    };

    const removeAward = (id) => {
        setEmployeeOne(employeeOne.filter(a => a.id !== id));
        setIsChanged(true);
    };

    const changeAward = (key, value, id) => {
        setEmployeeOne(employeeOne.map(a => a.id === id ? { ...a, [key]: value } : a));
        setIsChanged(true);
    };

    const selectFile = (e) => {
        const file = e.target.files[0];
        setFile(file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            setIsChanged(true);
        } else {
            setPreview(employee ? process.env.REACT_APP_API_URL + employee.img : null);
            setIsChanged(true);
        }
    };

    const handleSubmit = async () => {
        if (!selectedJobTitle || !selectedSubdivision) {
            alert("Пожалуйста, выберите должность и подразделение");
            return;
        }

        if (!isChanged) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('lastname', lastname);
        formData.append('surname', surname);
        formData.append('birthdate', birthdate);
        formData.append('jobTitleId', selectedJobTitle);
        formData.append('subdivisionId', selectedSubdivision);
        if (file) {
            formData.append('img', file);
        }
        formData.append('info', JSON.stringify(employeeOne.map(a => ({
            awardId: a.awardId,
            description: a.description,
            date: a.date,
        }))));

        try {
            await updateEmployee(id, formData);
            onHide();
            setName('');
            setLastname('');
            setSurname('');
            setBirthdate('');
            setFile(null);
            setPreview(null);
            setEmployeeOne([]);
            setIsChanged(false);
        } catch (error) {
            console.error("Failed to update employee:", error);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Редактировать данные сотрудника</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ minHeight: "300px" }}>
                <Row className="d-flex mb-4">
                    <Col md={4}>
                        <Form>
                            <Form.Control
                                value={lastname}
                                onChange={e => { setLastname(e.target.value); setIsChanged(true) }}
                                type="text"
                                placeholder="Введите фамилию"
                            />
                            <Form.Control
                                value={name}
                                onChange={e => { setName(e.target.value); setIsChanged(true) }}
                                className="mt-4"
                                type="text"
                                placeholder="Введите имя"
                            />
                            <Form.Control
                                value={surname}
                                onChange={e => { setSurname(e.target.value); setIsChanged(true) }}
                                className="mt-4"
                                type="text"
                                placeholder="Введите отчество"
                            />
                            <Form.Control
                                value={birthdate}
                                onChange={e => { setBirthdate(e.target.value); setIsChanged(true) }}
                                className="mt-4"
                                type="date"
                                placeholder="Введите дату рождения"
                            />
                        </Form>
                    </Col>
                    <Col md={4}>
                        <Dropdown>
                            <Dropdown.Toggle>{selectedJobTitle ? employeeStore.jobTitles.find(jt => jt.id === selectedJobTitle)?.title : "Выберите должность"}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {employeeStore.jobTitles.map(jt =>
                                    <Dropdown.Item
                                        key={jt.id}
                                        onClick={() => { setSelectedJobTitle(jt.id); setIsChanged(true) }}
                                    >
                                        {jt.title}
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="mt-4">
                            <Dropdown.Toggle>{selectedSubdivision ? employeeStore.subdivisions.find(sub => sub.id === selectedSubdivision)?.title : "Выберите подразделение"}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {employeeStore.subdivisions.map(sub =>
                                    <Dropdown.Item
                                        key={sub.id}
                                        onClick={() => { setSelectedSubdivision(sub.id); setIsChanged(true) }}
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
                    {employeeOne.map(a => (
                        <React.Fragment key={a.id}>
                            <Row className="mt-2">
                                <Dropdown>
                                    <Dropdown.Toggle>{employeeStore.awards.find(award => award.id === a.awardId)?.title || "Выберите награду"}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {employeeStore.awards.map(award =>
                                            <Dropdown.Item
                                                key={award.id}
                                                onClick={() => { changeAward('awardId', award.id, a.id); setIsChanged(true) }}
                                            >
                                                {award.title}
                                            </Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Col md={5}>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Введите описание"
                                        value={a.description}
                                        onChange={(e) => { changeAward('description', e.target.value, a.id); setIsChanged(true) }}
                                    />
                                </Col>
                                <Col md={2}><Form.Control
                                    value={a.date}
                                    onChange={(e) => changeAward('date', e.target.value, a.id)}
                                    className="mb-2"
                                    type="date"
                                    placeholder="Дата получение награды"
                                />
                                </Col>
                                <Col md={2}>
                                    <Button
                                        onClick={() => removeAward(a.id)}
                                        variant="outline-danger"
                                    >
                                        Удалить
                                    </Button>
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button
                    variant="outline-success"
                    onClick={handleSubmit}
                    disabled={!isChanged}
                    style={isChanged ?
                        {
                            backgroundColor: '#28a745',
                            borderColor: '#28a745',
                            color: 'white',
                            cursor: 'pointer'
                        } :
                        {
                            backgroundColor: '#ccc',
                            borderColor: '#ccc',
                            color: '#666',
                            cursor: 'not-allowed'
                        }}
                >
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default EditEmployee;
