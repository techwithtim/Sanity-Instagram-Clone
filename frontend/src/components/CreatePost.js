import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/CreatePost.css";

export default function CreatePost({ user, addAlert }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      addAlert({
        variant: "warning",
        message: "Please sign in to make a post.",
      });
      navigate("/login");
    }
  }, [user]);

  function captionInput(e) {
    setCaption(e.target.value);
  }

  function handleUpload(e) {
    setFile(e.target.files[0]);
  }

  function post(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", user);
    formData.append("caption", caption);
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    fetch("/createPost", requestOptions)
      .then((_res) => {
        addAlert({ variant: "success", message: "Post created!" });
        navigate("/");
      })
      .catch((err) => {
        addAlert({ variant: "danger", message: err.message });
      });
  }

  if (!user) {
    return null;
  }

  return (
    <Form className="create-post-form" onSubmit={post}>
      <div className="create-post">
        <Form.Group className="mb-3">
          <img
            src={file ? URL.createObjectURL(file) : null}
            className="upload-image"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <input type="file" accept="image/*" onChange={handleUpload} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formControlsTextarea">
          <Form.Control
            type="text"
            placeholder="Enter a caption"
            onInput={captionInput}
          />
        </Form.Group>
        <div className="post-button-wrapper">
          <Button variant="primary" type="submit" className="post-button">
            Post
          </Button>
        </div>
      </div>
    </Form>
  );
}
