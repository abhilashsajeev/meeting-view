import { useEffect, useState } from "react";
import Router from "next/router";
import { useAuth } from "../context/AuthUserContext";
import { getAllUsersData } from "../lib/fetchFromFireStore";

import { Container, Row, Col, Button, Navbar, NavbarBrand } from "reactstrap";
import AddUserCard from "../components/AddUserCard";

const LoggedIn = () => {
  const [users, setUsers] = useState([]);
  const { authUser, loading, signOut } = useAuth();

  // Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (!loading && !authUser) Router.push("/login");

    (async () => {
      const usersData = await getAllUsersData();
      setUsers(usersData);
    })();
  }, [authUser, loading]);

  return (
    <>
      <Navbar color="warning" dark>
        <NavbarBrand>Add Meeting for</NavbarBrand>
      </Navbar>
      <Container>
        {loading ? (
          <Row>
            <Col>Loading....</Col>
          </Row>
        ) : (
          <>
            <Row>
              <Col>
                {authUser && (
                  <div>
                    Congratulations {authUser?.email}! You are logged in.
                  </div>
                )}
              </Col>
            </Row>

            {users.map((user, index) => (
              <AddUserCard key={index} item={user} />
            ))}

            <Row>
              <Col>
                <Button onClick={signOut}>Sign out</Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default LoggedIn;
