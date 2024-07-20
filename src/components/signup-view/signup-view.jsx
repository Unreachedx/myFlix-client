import React, { useState } from "react";
import { Container, Row, Col, Button, Card, CardGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Signup successful");
          navigate("/login"); // Redirect to login page
        } else {
          return response.json().then((errorData) => {
            let errorMessage = "Signup failed";
            if (response.status === 400) {
              if (errorData.message.includes("username")) {
                errorMessage = "Signup failed: Username already exists";
              } else if (errorData.message.includes("email")) {
                errorMessage = "Signup failed: Email already in use";
              } else {
                errorMessage = `Signup failed: ${errorData.message}`;
              }
            } else if (response.status === 500) {
              errorMessage = "Signup failed: Server error, please try again later";
            } else {
              errorMessage = `Signup failed: ${errorData.message}`;
            }
            alert(errorMessage);
          });
        }
      })
      .catch((error) => {
        alert("Signup failed: Network error");
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <CardGroup>
            <Card>
              <Card.Body>
                <Card.Title>Please Register</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength="3"
                      placeholder="Enter a Username"
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength="8"
                      placeholder="Your Password has to be min. 8 digits"
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your Email"
                    />
                  </Form.Group>
                  <Form.Group controlId="Birthday">
                    <Form.Label>Birthday:</Form.Label>
                    <Form.Control
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </CardGroup>
        </Col>
      </Row>
      <div className="links">
        <a href="/login">Already have an account?</a>
      </div>
    </Container>
  );
};
