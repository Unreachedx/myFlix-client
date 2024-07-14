import React, { useState } from "react";
import { Container, Row, Col, Button, Card, CardGroup, Form } from "react-bootstrap";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      Username: username,
      Password: password
    };

    fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        const { user, token } = data;
        onLoggedIn(user, token);
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <CardGroup>
            <Card>
              <Card.Body>
                <Card.Title>Please Login</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter a Username"
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a Password"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                  {error && <div className="error-message">Error: {error}</div>}
                </Form>
              </Card.Body>
            </Card>
          </CardGroup>
        </Col>
      </Row>
      <div className="links">
        <a href="/signup">Don't have an account?</a>
      </div>
    </Container>
  );
};