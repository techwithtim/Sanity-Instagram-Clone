import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import AllPosts from "./components/AllPosts.js";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Login from "./components/Login";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import AlertDismissible from "./components/AlertDismissible";
import Search from "./components/Search";
import CreatePost from "./components/CreatePost";

function App() {
  const [user, setUser] = useState("");
  const [alert, setAlert] = useState(null);

  return (
    <div className="fill-parent">
      <BrowserRouter>
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
          <Container fluid>
            <LinkContainer to="/">
              <Navbar.Brand>Instagram Clone</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/search">
                  <Nav.Link>Search</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/create-post">
                  <Nav.Link>Post</Nav.Link>
                </LinkContainer>
              </Nav>
              <Nav>
                {user ? (
                  <Navbar.Text>
                    Signed in as: <Link to={"/profile/" + user}>{user}</Link> |{" "}
                    <Button
                      onClick={() => {
                        setUser("");
                        setAlert({
                          variant: "warning",
                          message: "Signed out.",
                        });
                      }}
                    >
                      Logout
                    </Button>
                  </Navbar.Text>
                ) : (
                  <Navbar.Text>
                    <Link to="/login">Not Signed In</Link>
                  </Navbar.Text>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {alert ? (
          <AlertDismissible {...alert} deleteAlert={() => setAlert(null)} />
        ) : null}
        <Routes>
          <Route element={<AllPosts user={user} />} path="/" exact />
          <Route
            element={<Login addAlert={setAlert} setUser={setUser} />}
            path="/login"
          />
          <Route
            element={<SignUp setUser={setUser} addAlert={setAlert} />}
            path="/signup"
          />
          <Route
            element={<Profile addAlert={setAlert} user={user} />}
            path="/profile/:username"
          />
          <Route
            element={<CreatePost addAlert={setAlert} user={user} />}
            path="/create-post"
          />
          <Route element={<AllPosts user="" />} path="/logout" />
          <Route element={<Search />} path="/search" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
