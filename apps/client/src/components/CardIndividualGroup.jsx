import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../App.css";

const CardIndividualGroup = (props) => {
  return (
    <div>
      <Card className="p-3 m-4 group-card" style={{ width: "17rem" }}>
        <div className="circle-thumbnail">{Array.from(props.groupName)[0]}</div>
        <Card.Body>
          <Card.Title style={{ fontSize: "28px", textAlign: "center" }}>{props.groupName}</Card.Title>
          <hr className="divider"></hr>
          <div style={{ textAlign: "center" }}>
            {(props.amountToReceive < 0) && <p className="text-danger">You owe ${-1*props.amountToReceive}</p>}
            {(props.amountToReceive > 0) && <p className="text-success">You are to receive ${props.amountToReceive}</p>}
            {(props.amountToReceive === 0) && <p>Net Balanced</p>}             
          </div>
          <div className="button-spacing">
            <Button className="center-button" onClick={props.groupClick} variant="primary">
              View Group
            </Button>
          </div>
          <div className="button-spacing">
            <Button className="center-button" onClick={props.groupDelete} variant="danger">
              Delete Group
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
export default CardIndividualGroup;