import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom'
import {userActions} from '../store/userSlice';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';
import Image from "react-bootstrap/esm/Image";
import profile from "../images/profile.png";

const UpdateUser = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch()
  const initialName = user.name;
  const initialEmail = user.email;
  console.log(user);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!name || !email || !password) {
      setNotification("Inputs cannot be blank");
      return;
    }
    fetch("/api/users/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        name,
        email,
        password,
      }),
    })
    .then((res) => {
      if (res.status !== 202) {
        throw new Error({ msg: "Couldn't update user information" });
      }
      return res.json();
    })
    .then((data) => {
      setNotification("User updated : " + data.name);
      dispatch(userActions.updateLoggedInUser({id: user.id, name, email}))
      setShowModal(true)
    })
    .catch((error) => {
      console.log(error);
      setNotification("Some error in updating user!");
      setShowModal(true)
    });
  };

  return (
    <div>
      <div className="transaction-head d-flex justify-content-center">
        <Image src={profile} className="mx-3 my-1" style={{ width: '80px', borderRadius: '50%' }}/>
        <h1 className="my-auto text-center">Edit profile</h1>
      </div>
      <hr className="divider mx-auto" style={{ width: "400px" }}></hr>
      <Container fluid>
        <Row className="text-center">
          <Col className="text-center d-flex justify-content-center">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-center">Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  style={{ width: "300px" }}
                  autoComplete="off"
                  placeholder="Enter new name"
                  defaultValue={initialName}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-center">Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  style={{ width: "300px" }}
                  autoComplete="off"
                  placeholder="Enter new email"
                  defaultValue={initialEmail}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-center">Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  style={{ width: "300px" }}
                  autoComplete="off"
                  placeholder="Enter new password"
                />
              </Form.Group>
              <Button type="submit">Update</Button>
              <i className="fa-regular fa-user"></i>
              {notification && <p className="text-danger">{notification}</p>}
            </Form>
          </Col>
        </Row>
      </Container>
      <Modal size="sm" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body  closeButton>
          <p> {notification}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{navigate('/detailedpages/user/home')}}>User Home</Button>
        </Modal.Footer>
        
      </Modal>
    </div>
  );
};

export default UpdateUser;
