import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/esm/Image";
import profile from "../images/profile.png";
import "../App.css";

const CardIndividualMember = (props) => {
  console.log(props)
  return (
    <div>
      <Card className="p-3 m-4 group-card" style={{ width: "17rem" }}>
        <Image src={profile} style={{ width: "100px", borderRadius: "50%" }} />
        <Card.Body>
          <Card.Title style={{ fontSize: "28px", textAlign: "center" }}>
            {props.groupMemberName}
          </Card.Title>
          <hr className="divider"></hr>
          <div className="mb-2" style={{ textAlign: "center" }}>
            {(props.amountToRecieve < 0) && <p className="text-danger">You owe ${-1*props.amountToRecieve}</p>}
            {(props.amountToRecieve > 0) && <p className="text-success">You are to receive ${props.amountToRecieve}</p>}
            {(props.amountToRecieve === 0) && <p>You are settled-up!</p>} 
          </div>
          {(props.amountToRecieve === 0) || <Button className="center-button my-2" onClick={props.handleSettleUp} variant="primary">
              Settle Up!
            </Button>}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardIndividualMember;
