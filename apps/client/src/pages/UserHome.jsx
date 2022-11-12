import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {useEffect} from 'react'
import {userSummaryActions} from '../store/userSummarySlice'
import profile from "../images/profile.png";
import CardMoneyBalance from "../components/CardMoneyBalance";
import CardRecentExpenses from "../components/CardRecentExpenses";
import CardUserGroupSummary from "../components/CardUserGroupSummary";

const UserHome = () => {

  const navigate = useNavigate()
  // const userName = "Anam";
  const dispatch = useDispatch()
  const user = useSelector((state)=>state.user)
  const groupList = useSelector((state)=>state.userSummary.groupList)
  const netReceivedAmount = useSelector((state)=>state.userSummary.netReceivedAmount)
  const netPaidAmount = useSelector((state)=>state.userSummary.netPaidAmount)
  const netAmountToReceive = useSelector((state)=>state.userSummary.netAmountToReceive)
  // let recentTransactionReceviedList = [[{id:1, receivedByName:"",description:"",amount:0}]]
  const recentTransactionReceviedList = useSelector((state)=>state.userSummary.transactionReceivedList)
  const recentTransactionPaidList = useSelector((state)=>state.userSummary.transactionPaidList)
  
  useEffect(()=>{
    fetch('/api/users/summary')
    .then((res)=>{
      if (res.status !== 200){
        throw new Error({msg:"Server Error"})
      }
      return res.json()})
    .then((data)=>{
      console.log(data)
      dispatch(userSummaryActions.updateUserSummary(data))})
    .catch((error)=>{
      console.log(error)
      navigate('/')
    })
  },[])

  return (
    <Container fluid>
      <Row>
        <Col xs="auto" className="mt-2 d-none d-sm-block">
          <Image src={profile} style={{ width: '100px', borderRadius: '50%' }}/>
        </Col>
        <Col className="my-auto text-center text-sm-start">
          <h1>Hi {user.name}!</h1>
          <p className="text-muted">Welcome to your dahsboard</p>
        </Col>
        <Col xs="auto" className="my-auto">
          <Button onClick={() => navigate("/users/edit")} variant="primary">Edit Profile</Button>
        </Col>
      </Row>
      <hr className="divider"></hr>
      <Row>
        <div className="col-md-5">
          <div className="d-flex justify-content-center">
            <div className="card-money-balance">
              <CardMoneyBalance moneyBalanceTitle="You owe" colorClass="text-danger" moneyBalanceAmount={netReceivedAmount}/>
            </div>
            <div className="card-money-balance">
              <CardMoneyBalance moneyBalanceTitle="You are owed" colorClass="text-success" moneyBalanceAmount={netPaidAmount}/>
            </div>
            <div className="card-money-balance">
              <CardMoneyBalance moneyBalanceTitle="Total balance" moneyBalanceAmount={netAmountToReceive} />
            </div>
          </div>
          <div className="users-groups m-1 mx-2">
            <CardUserGroupSummary />
          </div>
        </div>
        <div className="recent-expenses m-1 col-md-6">
          <h4 className="text-center mt-3">Recent Transactions</h4>
          <CardRecentExpenses 
          expenseTitle="Paid to" transactionList={recentTransactionPaidList} />
          <CardRecentExpenses 
          expenseTitle="Received from" transactionList={recentTransactionReceviedList} />
        </div>
        
      </Row>
    </Container>
  );
};

export default UserHome;
