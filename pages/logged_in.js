import { useEffect, useState } from "react";
import Router from "next/router";
import { useAuth } from "../context/AuthUserContext";
import { getAllUsersData } from "../lib/fetchFromFireStore";
import Head from "next/head";
import { Container, Row, Col, Button, Navbar, NavbarBrand } from "reactstrap";
import AddUserCard from "../components/AddUserCard";
import styles from "../styles/NavBarNew.module.css";

const LoggedIn = () => {
  const [users, setUsers] = useState([]);
  const { authUser, loading, signOut } = useAuth();

  // Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (!loading && !authUser) Router.push("/login");

    (async () => {
      console.log("authUser", authUser);
      const usersData = await getAllUsersData(authUser?.email);
      setUsers(usersData);
    })();
  }, [authUser, loading]);

  const doLogout = async () => {
    await signOut();
    Router.push("/login");
  };

  return (
    <>
      <Head>
        <title> Add Meeting for Users </title>
        <meta name="description" content="Add Meeting for Users" />
      </Head>
      <Navbar className={styles.header_gradient} dark>
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
                <Button onClick={doLogout}>Sign out</Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default LoggedIn;
