import { observer } from 'mobx-react-lite';
import React, {  useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import { createSubdivision } from '../../http/employeeApi';


const CreateSub = observer(({ show, onHide }) => {
    const [sub, setSub] = useState('')

    const addSub = () => {
        if(sub) {
            createSubdivision({ title: sub }).then(data => {
            setSub('')
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
                <Modal.Title>Добавить подразделение</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>

                    <Form.Control
                        value={sub}
                        onChange={e => setSub(e.target.value)}
                        className="mb-3"
                        type="text"
                        placeholder="Введите название подразделении" />


                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                    <Button type="submit" variant="outline-success" onClick={addSub}>Добавить</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
})

export default CreateSub