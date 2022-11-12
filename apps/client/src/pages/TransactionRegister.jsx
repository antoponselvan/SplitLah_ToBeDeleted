import { useState, useRef, useEffect } from "react";
import {useSelector, useDispatch} from 'react-redux'
import {selectedTransactionActions} from '../store/selectedTransactionSlice'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";

const TransactionRegister = () => {
  const selectedTransaction = useSelector((state)=>state.selectedTransaction)
  const dispatch = useDispatch()
  const [selectedReceivedByUser, setSelectedReceivedByUser] = useState({id:"",name:"",email:""});
  const [selectedPaidByUser, setSelectedPaidByUser] = useState({id:"",name:"",email:""});
  const [registerStatus, setRegisterStatus] = useState("")
  const groupUserList = useSelector((state)=>(state.selectedGroup.userList))
  const groupId = useSelector((state)=>(state.selectedGroup.groupId))
  const userId = useSelector((state)=>state.user.id)
  const amountTextBoxRef = useRef();
  const descriptionTextBoxRef = useRef()

  useEffect(()=>{
    if (selectedTransaction.navigatedFromSettleUp){
      setSelectedPaidByUser(selectedTransaction.paidBy)
      setSelectedReceivedByUser(selectedTransaction.receivedBy)
      amountTextBoxRef.current.value = selectedTransaction.amount
      descriptionTextBoxRef.current.value = selectedTransaction.description
      dispatch(selectedTransactionActions.setNavigationFlagFalse())
    }
  },[])

  const handleAddPaidByUser = (user) => {
    return () => {
      setSelectedPaidByUser(user)
    };
  };

  const handleAddReceivedByUser = (user) => {
    return () => {
      setSelectedReceivedByUser(user)
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(userId, selectedPaidByUser.id, selectedReceivedByUser.id,groupId,amountTextBoxRef.current.value, descriptionTextBoxRef.current.value)
    fetch('/api/transactions/register',{
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        createdBy: userId,
        paidBy:selectedPaidByUser.id,
        receivedBy: selectedReceivedByUser.id,
        amount: amountTextBoxRef.current.value,
        description: descriptionTextBoxRef.current.value,
        groupId
      })
    }).then ((res)=>{
        if (!(res.status === 201)){
          throw new Error({msg: "Server Error"})
        }
        return res.json()
      }).then ((data)=>{
        setRegisterStatus("Added Txn:"+selectedPaidByUser.name+" To "+selectedReceivedByUser.name+" ("+(amountTextBoxRef.current.value)+") ")
      }).catch((error)=>{
        console.log(error)
        setRegisterStatus("Txn register failed")
      })
  
  };

  return (
    <div>
      <div className="transaction-head d-flex justify-content-center">
        <div className="circle-thumbnail mt-1">•••</div>
        <h1 className="my-auto ms-2">Add a transaction</h1>
      </div>
      <hr className="divider"></hr>
      <Container fluid>
        <Row className="text-center">
          <Col className="text-center d-flex justify-content-center">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="d-block">Paid by : {selectedPaidByUser.name} -
                <Dropdown className="d-inline">
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {groupUserList.map((user) => (
                      <Dropdown.Item key={user.id} onClick={handleAddPaidByUser(user)}>
                        {user.name} : {user.email}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="d-block">Received by : {selectedReceivedByUser.name}  -
                <Dropdown className="d-inline">
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {groupUserList.map((user) => (
                      <Dropdown.Item key={user.id} onClick={handleAddReceivedByUser(user)}>
                        {user.name} : {user.email}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>       
                </Form.Label>         
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-center">Amount:</Form.Label>
                <Form.Control ref={amountTextBoxRef}
                  name="amount"
                  style={{ width: "300px" }}
                  placeholder="Enter amount"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description:</Form.Label>
                <Form.Control ref={descriptionTextBoxRef}
                  name="description"
                  as="textarea"
                  placeholder="Description"
                  style={{ height: "100px" }}
                />
              </Form.Group>
              <Button type="submit">Add</Button>
              <p>{registerStatus}</p>
            </Form>
            
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TransactionRegister;
