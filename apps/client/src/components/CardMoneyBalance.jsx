import Card from 'react-bootstrap/Card';

const CardMoneyBalance = (props) => {
  return (
    <div>
      <Card variant="light" >
        <Card.Header>{props.moneyBalanceTitle}</Card.Header>
        <Card.Body>
          <Card.Text className={props.colorClass}>${props.moneyBalanceAmount}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CardMoneyBalance;