import Accordion from 'react-bootstrap/Accordion';
import Row from 'react-bootstrap/Row'
// import Moment from 'react-moment'
import moment from 'moment'

const CardRecentExpenses = ({expenseTitle, transactionList}) => {
  // console.log(transactionList[0].updatedAt)
  // const dateToFormat = new Date(transaction.updatedAt)
  // console.log(moment.unix(Date.parse(transactionList[0].updatedAt)/1000).format("MM/DD/YYYY HH:mm"))
  // console.log(moment(transactionList[0].updatedAt, "YYYYMMDD HH"))
  return (
    <Row className='m-1 my-2'>
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{expenseTitle}</Accordion.Header>
        <Accordion.Body>
            <ul>
              {transactionList.map((transaction,idx) =>
              <li key={idx} className="d-flex" style={{"justifyContent": "space-between"}}>
              <p>{transaction?.paidByName || transaction?.receivedByName} on {moment.unix(Date.parse(transaction?.updatedAt)/1000).format("DD-MMM-YY")} ({transaction.description}) </p>
              <p> ${transaction.amount} </p></li>
            )}
            </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </Row>
  )
}

export default CardRecentExpenses;