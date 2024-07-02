import React, { useContext, useState } from 'react';
import { Container, Form, Button, Card, Row, Alert } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { INFOPAGE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { registration, login } from '../http/userApi';
import { Context } from '../index';

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState(null);

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(name, password);
      } else {
        data = await registration(name, password, role);
      }
      user.setUser(data); // Установка данных пользователя после успешной аутентификации
      user.setIsAuth(true);
      navigate(INFOPAGE_ROUTE);
    } catch (error) {
      setError(error.response.data.message); // Установка ошибки в состояние для отображения
    }
  };

  const handleRoleChange = (e) => {
    if (e.target.checked) {
      setRole('ADMIN');
    } else {
      setRole('USER');
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3"
            placeholder="Введите ваше имя..."
          />
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3"
            placeholder="Введите ваш пароль..."
            type="password"
          />

          {!isLogin && (
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Ad..........."
              className="mt-3"
              onChange={handleRoleChange}
            />
          )}

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          <Row className="d-flex justify-content-between mt-3 ps-3 pe-3">
            {isLogin ? (
              <div>
                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
              </div>
            ) : (
              <div>
                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
              </div>
            )}
            <Button onClick={click} variant={"outline-success"}>
              {isLogin ? 'Войти' : 'Регистрация'}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
