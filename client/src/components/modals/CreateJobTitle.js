import React, { useContext, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Context } from '../../index';
import { createJobTitle } from '../../http/employeeApi';

const CreateJobTitle = ({ show, onHide }) => {
    const [jobTitle, setJobTitle] = useState('')

    const addJobTitle = () => {
        if(jobTitle) {
            createJobTitle({ title: jobTitle }).then(data => {
            setJobTitle('')
            onHide()
        })
        }
        

    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Добавить должность</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>

                    <Form.Control
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        className="mb-3"
                        type="text"
                        placeholder="Введите название должности" />


                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                    <Button type="submit" variant="outline-success" onClick={addJobTitle}>Добавить</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default CreateJobTitle