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
          color="success"
          onClick={() => {
            handleNavigate(item.uid);
          }}
        >
          ADD NEW TASK
        </Button>
      </Card>
    </Col>
  );
};
export default AddUserCard;
