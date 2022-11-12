import {useSelector, useDispatch} from 'react-redux'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import {transactionListActions} from '../store/transactionListSlice'
import CardRecentExpenses from "../components/CardRecentExpenses";

const GroupTransactions = () => {
  const navigate = useNavigate()
  const groupName = useSelector((state) => state.selectedGroup.name);
  const groupId = useSelector((state)=>state.selectedGroup.groupId)
  const paidTransactionsPageNum = useSelector((state)=>state.transactionList.paidTransactionsPageNum)
  const receivedTransactionsPageNum = useSelector((state)=>state.transactionList.receivedTransactionsPageNum)
  const paidTransactionList = useSelector((state)=>state.transactionList.paidTransactions)
  const receivedTransactionList = useSelector((state)=>state.transactionList.receivedTransactions)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(transactionListActions.updatePaidTransactionPageNum(1))
    dispatch(transactionListActions.updateReceivedTransactionPageNum(1))
  },[])

  useEffect(()=>{
    fetch('/api/transactions/paid',{
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId,
        pageNum: paidTransactionsPageNum
      }) 
    }).then((res)=>{
      if (res.status !== 200){
        throw new Error({msg:"Some Comm Error"})
      }
      return res.json()
    }).then((data)=>{
      dispatch(transactionListActions.updatePaidTransactionList(data))
    }).catch((error)=>{
      console.log(error)
      navigate('/')
    })},[paidTransactionsPageNum])

  useEffect(()=>{  
    fetch('/api/transactions/received',{
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId,
        pageNum: receivedTransactionsPageNum
      }) 
    }).then((res)=>{
      if (res.status !== 200){
        throw new Error({msg:"Some Comm Error"})
      }
      return res.json()
    }).then((data)=>{
      dispatch(transactionListActions.updateReceivedTransactionList(data))
    }).catch((error)=>{
      console.log(error)
      navigate('/')
    })
  },[receivedTransactionsPageNum])

  const decPaidTransactionsPageNum = () => {
    if (paidTransactionsPageNum>1){
      dispatch(transactionListActions.updatePaidTransactionPageNum(paidTransactionsPageNum-1))
    }
  }

  const incPaidTransactionsPageNum = () => {
    if (paidTransactionList.length > 0){
      dispatch(transactionListActions.updatePaidTransactionPageNum(paidTransactionsPageNum+1))
    }
  }

  const decReceivedTransactionsPageNum = () => {
    if (receivedTransactionsPageNum>1){
      dispatch(transactionListActions.updateReceivedTransactionPageNum(receivedTransactionsPageNum-1))
    }
  }

  const incReceivedTransactionsPageNum = () => {
    if (receivedTransactionList.length > 0){
      dispatch(transactionListActions.updateReceivedTransactionPageNum(receivedTransactionsPageNum+1))
    }
  }
  return (
    <Container fluid>
      <Row>
        <Col xs="auto" className='d-none d-sm-block mt-2'>
          <div className="circle-thumbnail">{Array.from(groupName)[0]}</div>
        </Col>
        <Col className='text-center text-sm-start my-auto'>
          <h1>Transactions</h1>
          <p className="text-muted">For {groupName}</p>
        </Col>
      </Row>
      <hr className="divider"></hr>
      <Row>
        <Col xs={12} md={5} className="mb-5">
          <CardRecentExpenses 
          expenseTitle="Paid to" transactionList={paidTransactionList} />     
          <ButtonGroup className='d-flex justify-content-center' aria-label="Basic example">
            <Button style={{maxWidth:"50px"}}  onClick={decPaidTransactionsPageNum} variant="secondary">{"<<"}</Button>
            <p className='my-auto'>Page # {paidTransactionsPageNum} .</p>
            <Button style={{maxWidth:"50px"}} onClick={incPaidTransactionsPageNum} variant="secondary">{">>"}</Button>
          </ButtonGroup>
        </Col>
        <Col xs={12} md={5} className="mb-5 d-flex row justify-content-center align-items-center">
          <CardRecentExpenses 
          expenseTitle="Received from" transactionList={receivedTransactionList} />
          <ButtonGroup className='d-flex justify-content-center' aria-label="Basic example">
            <Button style={{maxWidth:"50px"}} onClick={decReceivedTransactionsPageNum} variant="secondary">{"<<"}</Button>
            <p className='my-auto'>Page # {receivedTransactionsPageNum} .</p>
            <Button style={{maxWidth:"50px"}} onClick={incReceivedTransactionsPageNum} variant="secondary">{">>"}</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default GroupTransactions;