import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {selectedTransactionActions} from '../store/selectedTransactionSlice'
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";
import CardMoneyBalance from "../components/CardMoneyBalance";
import CardIndividualMember from "../components/CardIndividualMember";

const GroupDetails = () => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.user)
  const groupName = useSelector((state) => state.selectedGroup.name);
  const groupDescription = useSelector((state) => state.selectedGroup.description);
  const netAmount = useSelector((state)=>state.selectedGroup.netAmount)
  const groupMembers = useSelector((state) => state.selectedGroup.userList);
  const totalMembers = useSelector((state) => state.selectedGroup.userList?.length);
  const dispatch = useDispatch()

  const handleSettleUp = (member) => () => {
    let amount = member.amountToRecieve
    const description = "Settling Up Transaction"
    let paidBy, receivedBy
    if (amount < 0){
      receivedBy = {id: member.id, name:member.name, email:member.email}
      paidBy = loggedInUser
      amount = (-1)*amount
    } else {
      receivedBy = loggedInUser
      paidBy = {id: member.id, name:member.name, email:member.email}
    }
    dispatch(selectedTransactionActions.updatePartialTransaction({paidBy, receivedBy,amount,description}))
    dispatch(selectedTransactionActions.setNavigationFlagTrue())
    navigate('/transaction/register')
  }

  return (
    <Container fluid>
      <Row>
        <Col xs="auto" className="mt-2 d-none d-sm-block">
          <div className="circle-thumbnail">{Array.from(groupName)[0]}</div>
        </Col>
        <Col className="text-center text-sm-start my-auto">
          <h1>{groupName}</h1>
          <p className="text-muted">{groupDescription}</p>
        </Col>
        <Col xs="auto" className="my-auto">
          <Button onClick={() => navigate("/group/edit")}>Edit Group</Button>
        </Col>
      </Row>
      <hr className="divider"></hr>
      <h3 className="text-center">Balances</h3>
      <Row className="balance-section text-center">
        <div className="d-flex justify-content-center">
          <div className="card-money-balance">
            <CardMoneyBalance
              moneyBalanceTitle="You owe"
              moneyBalanceAmount={netAmount.received}
              colorClass="text-danger"
            />
          </div>
          <div className="card-money-balance">
            <CardMoneyBalance
              moneyBalanceTitle="You are owed"
              moneyBalanceAmount={netAmount.paid}
              colorClass="text-success"
            />
          </div>
          <div className="card-money-balance">
            <CardMoneyBalance
              moneyBalanceTitle="Total balance"
              moneyBalanceAmount={netAmount.netToReceive}
            />
          </div>
          
        </div>
      </Row>
      <div className="button-stacked">
            <div className="button-padding">
              <Button onClick={() => navigate("/detailedpages/group/transactions")}>View Transactions</Button>
            </div>
            <div className="button-padding">
              <Button onClick={() => navigate("/transaction/register")}>Add Transactions</Button>
            </div>
          </div>
      <hr className="divider"></hr>
      <h3 className="text-center">Members – {totalMembers}</h3>
      <div className="d-flex ms-auto justify-content-center flex-wrap">
        {groupMembers.map((member, idx) => (
          <CardIndividualMember key={idx}
            groupMemberName={member.name}
            amountToRecieve = {member.amountToRecieve}
            handleSettleUp = {handleSettleUp(member)}
          />
        ))}
      </div>
    </Container>
  );
};

export default GroupDetails;
