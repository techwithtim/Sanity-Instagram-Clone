import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SignUp({ setUser, addAlert }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function createAccount(e) {
    e.preventDefault();
    try {
      const requestOptions = {
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          username: username,
        }),
      };
      fetch("/createUser", requestOptions).then((_res) => {
        setUser(username);
        navigate("/");
        addAlert({
          variant: "success",
          message: "Your account has been created.",
        });
      });
    } catch (err) {
      addAlert({ variant: "danger", message: err.message });
    }
  }

  function updateUsername(e) {
    setUsername(e.target.value);
  }

  function updateFirstName(e) {
    setFirstName(e.target.value);
  }

  function updateLastName(e) {
    setLastName(e.target.value);
  }

  return (
    <Form className="login-form">
      <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          onInput={updateUsername}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First Name"
          onInput={updateFirstName}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last Name"
          onInput={updateLastName}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <small id="signUp" className="form-text text-muted">
          Already have an account? Login <a href="/login">here</a>.
        </small>
      </Form.Group>
      <Button variant="primary" type="button" onClick={createAccount}>
        Create Account
      </Button>
    </Form>
  );
}
