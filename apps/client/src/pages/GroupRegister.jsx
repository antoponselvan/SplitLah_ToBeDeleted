import { useState, useRef } from "react";
import {useNavigate} from 'react-router-dom'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {faPeopleGroup} from '@fortawesome/free-solid-svg-icons'

const GroupRegister = () => {
  const navigate = useNavigate()
  const [selectedUserList, setSelectedUserList] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([
    { id: 1, name: "A", email: "A" },
    { id: 2, name: "B", email: "B" },
  ]);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const searchTextBoxRef = useRef();

  const handleUserSearch = async () => {
    const searchText = searchTextBoxRef.current.value;
    console.log(searchText);
    fetch("/api/users/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchText: searchText }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error({ msg: "Find Call failed" });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUserSearchResults(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemoveUser = () => {};

  const handleAddUser = (user) => {
    return () => {
      const userIdList = selectedUserList.map((user) => user.id);
      if (userIdList.find((id) => id === user.id)) {
        return;
      }
      setSelectedUserList([
        ...selectedUserList,
        { id: user.id, name: user.name, email: user.email },
      ]);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const userList = selectedUserList.map((user) => user.id);

    if (!name || !description || userList === []) {
      setNotification("Inputs cannot be blank");
      return;
    }
    fetch("/api/groups/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, userList }),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error({ msg: "Couldnt create group" });
        }
        return res.json();
      })
      .then((data) => {
        setNotification("Group Created : " + data.name);
        setShowModal(true)
      })
      .catch((error) => {
        console.log(error);
        setNotification("Error in creating group!");
        setShowModal(true)
      });
  };

  return (
    <div>
      <div className="transaction-head d-flex justify-content-center">
        <FontAwesomeIcon icon={faPeopleGroup} style={{height:"50px", "border-radius":"50%"}} className="m-2 bg-warning"/>
        <h1>Create group</h1>
      </div>
      <hr className="divider mx-auto" style={{ width: "400px" }}></hr>
      <Container fluid>
        <Row className="text-center">
          <Col className="text-center d-flex justify-content-center">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-center">Group name:</Form.Label>
                <Form.Control
                  name="name"
                  style={{ width: "300px" }}
                  placeholder="Enter Name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Group description:</Form.Label>
                <Form.Control
                  name="description"
                  as="textarea"
                  placeholder="Description"
                  style={{ height: "100px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="d-block">Find Members:</Form.Label>
                <Dropdown onClick={handleUserSearch} className="d-inline">
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {userSearchResults.map((user) => (
                      <Dropdown.Item onClick={handleAddUser(user)}>
                        {user.name} : {user.email}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  className="d-inline"
                  style={{ width: "230px" }}
                  placeholder="Find by name or Email"
                  ref={searchTextBoxRef}
                />
              </Form.Group>
              <Form.Group>
              <Form.Label className="d-block">Selected Members:</Form.Label>
              </Form.Group>
              <Form.Group className="mb-3">
                <ul>
                  {selectedUserList.map((user) => (
                    <li style={{"list-style":"none"}} className="text-start">
                      {user.name} : {user.email}
                    </li>
                  ))}
                </ul>
              </Form.Group>
              <Button type="submit">Create</Button>
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
          <Button variant="primary" onClick={()=>{navigate('/detailedpages/groups/summary')}}>View Groups</Button>
        </Modal.Footer>        
      </Modal>
    </div>
  );
};

export default GroupRegister;
