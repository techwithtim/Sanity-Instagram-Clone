import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

export default function Login({ setUser, addAlert }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    fetch(`/getProfile?user=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          addAlert({ variant: "success", message: "Logged in successfully!" });
          setUser(username);
          navigate("/");
        } else {
          addAlert({
            variant: "danger",
            message: "No user with that username exists!",
          });
        }
      })
      .catch((err) => {
        addAlert({ variant: "danger", message: err.message });
      });
  }

  return (
    <Form className="login-form" onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          onInput={(e) => setUsername(e.target.value)}
        />
        <small id="signUp" className="form-text text-muted">
          Don't have an account? Sign up <Link to="/signup">here</Link>.
        </small>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
