import React, { useState, useEffect, useContext } from 'react';
import { Card, Col, Spinner, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { EMPLOYEE_ROUTE } from '../../utils/consts';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import { MdOutlineModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { deleteEmployee } from '../../http/employeeApi';
import EditEmployee from '../modals/EditEmployee';

const EmployeeItem = observer(({ employee, jt }) => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        if (employee && employee.img) {
            const loadImage = new Image();
            loadImage.src = employee.img;
            loadImage.onload = () => setLoading(false);
            loadImage.onerror = () => setLoading(false);
        } else {
            setLoading(false);
        }
    }, [employee]);

    const handleClick = () => {
        navigate(EMPLOYEE_ROUTE + '/' + (employee ? employee.id : ''));
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteEmployee(employee.id);
            setShowModal(false);
            // Можно добавить логику обновления списка сотрудников
        } catch (e) {
            console.error(e);
            // Обработка ошибок (например, показать уведомление пользователю)
        }
    };

    const handleEditClick = (event) => {
        event.stopPropagation();
        setSelectedEmployee(employee);
        setEditModal(true);
    };

    return (
        <>
            <Col className="mt-3" md={4} onClick={handleClick}>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Удалить сотрудника</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Вы уверены, что хотите удалить сотрудника {employee ? `${employee.lastname} ${employee.name} ${employee.surname}` : 'неизвестного'}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={(event) => { event.stopPropagation(); setShowModal(false); }}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Card style={{ width: 250, cursor: 'pointer', borderRadius: '5px', overflow: 'hidden' }} border={"light"}>
                    {loading ? (
                        <div style={{
                            width: 250,
                            height: 250,
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <div style={{
                            background: employee && employee.img ? `url(${process.env.REACT_APP_API_URL + employee.img}) no-repeat center/cover` : 'none',
                            width: 250,
                            height: 250,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-end"
                        }}>
                            {user.edit && employee && (
                                <>
                                    <div style={{
                                        height: "30px",
                                        width: "30px",
                                        background: "#8B0000",
                                        marginTop: "10px",
                                        marginRight: "5px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "5px"
                                    }}>
                                        <MdDeleteOutline
                                            onClick={handleDeleteClick}
                                            style={{
                                                fontSize: "20px",
                                                color: "white"
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        height: "30px",
                                        width: "30px",
                                        background: "#008B8B",
                                        marginTop: "10px",
                                        marginRight: "5px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "5px"
                                    }}>
                                        <MdOutlineModeEditOutline
                                            onClick={handleEditClick}
                                            style={{
                                                fontSize: "20px",
                                                color: "white"
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <div className="mt-1 mb-1 ms-2" style={{ color: "black" }}>
                        <h6>
                            {employee ? `${employee.lastname} ${employee.name} ${employee.surname}` : 'Имя не указано'}
                        </h6>
                        <p>{jt ? jt.title : 'Должность не указана или уже удалено'}</p>
                    </div>
                </Card>
            </Col>
            <EditEmployee show={editModal} onHide={() => setEditModal(false)} employee={selectedEmployee} />
        </>
    );
});

export default EmployeeItem;
