import React, { useState } from "react";
import { CardBody, Container, Row, Col, Button, Card, CardGroup, Form,} from "react-bootstrap";

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
        console.log('Login successful:', data);
        const { user, token } = data;
        onLoggedIn(user, token); // Ensure this call remains to set user token
      })
      .catch(error => {
        console.error('Fetch operation failed:', error);
        setError(error.message); // Update state with error message
      });
    };

  return (
    <Container className="d-flex align-items-center justify-content-center">
    <Row>
      <Col>
        <CardGroup>
          <Card>
            <CardBody>
            <Card.Title className="d-flex align-items-center justify-content-center">Please Login</Card.Title>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
      <Form.Label>Username:</Form.Label>
      <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter a Username"/>
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a Password" />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">
        Login      
      {error && <div>Error: {error}</div>}
        </Button>
    </Form>
      </CardBody>
            </Card>
          </CardGroup>
        </Col>
      </Row>
    </Container>
  );
};