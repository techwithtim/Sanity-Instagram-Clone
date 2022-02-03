import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export default function EditProfile({
  show,
  hideCallback,
  user,
  addAlert,
  profileData,
}) {
  const [bio, setBio] = useState(profileData.bio);
  const [firstName, setFirstName] = useState(profileData.first_name);
  const [lastName, setLastName] = useState(profileData.last_name);
  const [file, setFile] = useState("");

  function bioInput(e) {
    setBio(e.target.value);
  }

  function handleUpload(e) {
    setFile(e.target.files[0]);
  }

  function firstNameInput(e) {
    setFirstName(e.target.value);
  }

  function lastNameInput(e) {
    setLastName(e.target.value);
  }

  function updatePressed(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", user);
    if (firstName) formData.append("first_name", firstName);
    if (lastName) formData.append("last_name", lastName);
    if (bio) formData.append("bio", bio);
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    fetch("/updateProfile", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        addAlert({
          variant: "success",
          message: "Profile updated successfully.",
        });
        if (file) data.image_url = URL.createObjectURL(file);
        hideCallback(data);
      })
      .catch((err) => {
        addAlert({
          variant: "danger",
          message: err.message,
        });
        hideCallback(undefined);
      });
  }

  return (
    <Modal show={show} onHide={hideCallback}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            {profileData.photo && !file ? (
              <img src={profileData.photo.asset.url} className="upload-image" />
            ) : (
              <img
                src={file ? URL.createObjectURL(file) : null}
                className="upload-image"
              />
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <input type="file" onChange={handleUpload} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              defaultValue={profileData.first_name}
              placeholder="First Name"
              onInput={firstNameInput}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              defaultValue={profileData.last_name}
              placeholder="Last Name"
              onInput={lastNameInput}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              defaultValue={profileData.bio}
              placeholder="Enter your bio"
              onInput={bioInput}
            />
          </Form.Group>
          <div>
            <Button variant="primary" type="button" onClick={updatePressed}>
              Update
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
