import { Card, Col, CardText, CardTitle, Button } from "reactstrap";
import { useRouter } from "next/router";

const AddUserCard = ({ item }) => {
  const router = useRouter();
  const handleNavigate = (id) => {
    router.push(`/add/${id}`);
  };
  return (
    <Col sm="6">
      <Card body>
        <CardTitle tag="h5">{item.name.toUpperCase()}</CardTitle>
        <CardText>
          <p>{item.designation}</p>
        </CardText>
        <Button
          onClick={() => {
            handleNavigate(item.uid);
          }}
        >
          View Tasks
        </Button>
      </Card>
    </Col>
  );
};
export default AddUserCard;
