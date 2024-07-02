import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row } from 'react-bootstrap';
import { createAward } from '../../http/employeeApi';

const CreateAward = observer(({ show, onHide, header, edit, titleT, descriptionA }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (titleT) {
      setTitle(titleT);
    }
    if (descriptionA) {
        setDescription(descriptionA)
    }
  }, [titleT]);

  const selectFile = e => {
    setFile(e.target.files[0]);
  };

  const addAward = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('img', file);
    createAward(formData).then(() => onHide());
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      fullscreen
    >
      <Modal.Header closeButton>
        <Modal.Title>{header || 'Добавьте награды'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Form>
            <Form.Control
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              type="text"
              placeholder="Введите название награды"
            />
            <Form.Control
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ height: "200px" }}
              className="mt-3"
              as="textarea"
              placeholder="Введите описание"
            />
            <Form.Control
              required
              className="mt-4"
              type="file"
              size="lg"
              onChange={selectFile}
            />
          </Form>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        <Button type="submit" variant="outline-success" onClick={addAward}>{edit || 'Добавить'}</Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateAward;
